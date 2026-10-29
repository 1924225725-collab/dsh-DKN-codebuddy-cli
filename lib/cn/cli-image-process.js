import spawn from 'cross-spawn'
import { tmpdir } from 'node:os'
import { performance } from 'node:perf_hooks'
import { CodeBuddyCliError, cliOutputError } from './cli-response.js'
import { terminateProcess } from './cli-process.js'
import { processFacts } from './diagnostic-facts.js'

// One input turn per process. Read JSONL frames, never JSON candidates in text.
export function runImageProcess(command, args, { env = process.env, input, timeoutMs = 180000, signal,
  maxStdoutBytes = 20 * 1024 * 1024, terminalDrainMs = 1000, spawnImpl = spawn } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new CodeBuddyCliError('ABORTED', '请求已取消。'))
    const child = spawnImpl(command, args, { cwd: tmpdir(), env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] })
    const started = performance.now(), finals = []
    let pending = '', stdoutBytes = 0, stderrBytes = 0, stderr = '', notice = '', noticeFacts, settled = false, stopping = false, drain, cleanup
    let closeObserved = false, exitSignal, observedExitCode
    const state = { channel: 'image-jsonl', streamReason: 'none', streamPhase: 'awaiting-frame', lastFrameClass: 'none', totalFrames: 0, initCount: 0, finalResultCount: 0, firstFinalSeen: false, deadlineReached: false, tailFrame: false }
    const diagnostics = code => processFacts({ ...state, timeoutMs, elapsedMs: Math.round(performance.now() - started), stdoutBytes, stderrBytes, closeObserved, exitSignal, ...(closeObserved && Number.isInteger(code ?? observedExitCode) ? { exitCode: code ?? observedExitCode } : {}) })
    const finish = (error, code, origin = 'parser') => {
      if (settled) return
      state.terminationInitiator = closeObserved ? (stopping ? 'terminal-drain' : 'process') : stopping ? 'terminal-drain' : origin
      if (closeObserved) state.streamPhase = 'closed'
      settled = true; clearTimeout(timer); clearTimeout(drain); clearTimeout(cleanup); signal?.removeEventListener('abort', onAbort)
      if (error) { error.processDiagnostics = diagnostics(code); if (!closeObserved) terminateProcess(child); reject(error) }
      else resolve({ stdout: JSON.stringify(finals), stderr: '', processDiagnostics: diagnostics(code) })
    }
    const invalid = reason => {
      state.streamReason = reason
      return new CodeBuddyCliError('CLI_STREAM_INVALID', 'CLI 图片通道协议校验未通过；未交付本次工具请求。请查看诊断日志中的固定原因码和帧状态。')
    }
    const classified = (text, fallbackCode, fallbackMessage, source) => {
      const error = cliOutputError(text, stderr, undefined, fallbackCode, fallbackMessage)
      if (error.responseDiagnostics?.noticeSource === 'stdout') error.responseDiagnostics.noticeSource = source
      if (error.responseDiagnostics?.noticeClass === 'unknown' && noticeFacts) error.responseDiagnostics = { ...noticeFacts }
      return error
    }
    const consume = (line, tail = false) => {
      if (!line.trim() || settled) return
      state.totalFrames += 1; state.frameIndex = state.totalFrames; state.frameBytes = Buffer.byteLength(line); state.tailFrame = tail
      let frame
      try { frame = JSON.parse(line) } catch { finish(invalid(tail ? 'partial-tail' : 'json-parse')); return }
      if (!frame || typeof frame !== 'object' || Array.isArray(frame) || typeof frame.type !== 'string') return finish(invalid('frame-shape'))
      const classes = { system: frame.subtype === 'init' ? 'init' : 'system', assistant: 'assistant', user: 'user', result: 'result', error: 'error', control_request: 'control', stream_event: 'stream-event' }
      state.lastFrameClass = Object.hasOwn(classes, frame.type) ? classes[frame.type] : 'other'
      state.streamPhase = finals.length ? 'after-result' : 'receiving'
      if (state.lastFrameClass === 'init') state.initCount += 1
      if (frame.type === 'error') {
        state.streamReason = 'error-frame'
        const message = typeof frame.error === 'string' ? frame.error : typeof frame.error?.message === 'string' ? frame.error.message : ''
        const status = [frame.status, frame.error?.status].map(value => String(value ?? ''))
          .find(value => ['400', '401', '402', '403', '429'].includes(value))
        const notice = `${status ? `HTTP ${status} ` : ''}${message}`
        return finish(classified(notice, 'CLI_REQUEST_FAILED', 'CodeBuddy CLI 图片通道返回错误；请查看普通诊断中的错误类别。', 'error-frame'))
      }
      if (frame.type === 'assistant') {
        if (frame.message?.content !== undefined && !Array.isArray(frame.message.content)) return finish(invalid('frame-shape'))
        // Complete native assistant frames are never DSH tool proposals. Fail
        // before a resident CLI can loop on an unavailable business tool.
        if ((frame.message?.content ?? []).some(block => block?.type === 'tool_use' && block.name !== 'StructuredOutput')) {
          state.streamReason = 'native-tool-protocol'
          return finish(new CodeBuddyCliError('CLI_TOOL_PROTOCOL_ERROR', '模型把 DSH 工具误当成 CLI 原生工具调用，未交付本次工具请求。请保留诊断 ID 并重试；若重复出现，请反馈插件日志。'))
        }
        // Keep only a classified notice, never raw assistant/user/image frames.
        for (const block of frame.message?.content ?? []) if (block?.type === 'text' && typeof block.text === 'string') {
          const candidate = cliOutputError(block.text, '', undefined, 'CLI_STREAM_NOTICE')
          if (candidate.code !== 'CLI_STREAM_NOTICE') { notice = block.text; noticeFacts = { ...candidate.responseDiagnostics, noticeSource: 'assistant-notice' } }
        }
      }
      if (frame.type === 'control_request') { state.streamReason = 'permission-frame'; return finish(new CodeBuddyCliError('CLI_PERMISSION_REQUIRED', 'CLI 图片通道请求了交互控制或工具权限，插件未自动放行。请更新官方 CLI 并检查配置。')) }
      if (frame.type !== 'result') return
      finals.push(frame)
      state.finalResultCount = finals.length; state.firstFinalSeen = true; state.streamPhase = 'after-result'
      if (finals.length > 1) {
        state.streamReason = 'multiple-results'
        const error = new CodeBuddyCliError('STRUCTURED_OUTPUT_INVALID', 'CLI 图片通道返回多个最终结果，未选择其中任何一份或交付工具。 [STRUCTURED_OUTPUT_INVALID:native-final-results]')
        error.responseDiagnostics = { outputMode: 'native-json-schema', reason: 'native-final-results', finalResultCount: finals.length }
        return finish(error)
      }
      // The documented stream is resident. Drain queued frames, then stop this
      // single-turn process and validate the sole terminal record after close.
      drain = setTimeout(() => {
        state.streamPhase = 'draining'
        stopping = true; terminateProcess(child)
        cleanup = setTimeout(() => {
          if (pending.trim()) consume(pending, true)
          if (signal?.aborted) onAbort()
          else if (!settled) finish(undefined, undefined, 'terminal-drain')
        }, 1500)
      }, terminalDrainMs)
    }
    const onAbort = () => { state.streamReason = 'cancelled'; finish(new CodeBuddyCliError('ABORTED', '请求已取消。'), undefined, 'caller') }
    const timer = setTimeout(() => {
      state.streamReason = 'deadline'; state.deadlineReached = true
      finish(classified(notice, 'CLI_TIMEOUT', `CodeBuddy CLI 含图片历史的请求在 ${Math.round(timeoutMs / 1000)} 秒内未返回最终结果。该提示不代表图片过大或登录失效，请查看诊断日志。`, 'assistant-notice'), undefined, 'deadline')
    }, timeoutMs)
    signal?.addEventListener('abort', onAbort, { once: true })
    child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8')
    child.stdout.on('data', chunk => {
      if (settled) return
      stdoutBytes += Buffer.byteLength(chunk)
      if (stdoutBytes > maxStdoutBytes) { state.streamReason = 'output-limit'; return finish(new CodeBuddyCliError('CLI_OUTPUT_TOO_LARGE', 'CLI 图片通道输出超过安全上限。')) }
      pending += chunk
      let newline
      while (!settled && (newline = pending.indexOf('\n')) !== -1) {
        const line = pending.slice(0, newline); pending = pending.slice(newline + 1); consume(line)
      }
    })
    child.stderr.on('data', chunk => { stderrBytes += Buffer.byteLength(chunk); stderr = (stderr + chunk).slice(-32768) })
    child.stdin.on('error', () => {})
    child.once('error', error => { state.streamReason = 'spawn-failed'; finish(new CodeBuddyCliError(error.code === 'ENOENT' ? 'CLI_NOT_FOUND' : 'CLI_START_FAILED', '无法启动官方 CLI 图片通道。'), undefined, 'spawn') })
    child.once('close', (code, signalName) => {
      if (settled) return
      closeObserved = true; observedExitCode = code; exitSignal = signalName == null ? undefined : ['SIGTERM', 'SIGKILL', 'SIGINT', 'SIGABRT', 'SIGSEGV'].includes(signalName) ? signalName : 'other'
      if (pending.trim()) { const last = pending; pending = ''; consume(last, true) }
      if (settled) return
      if (signal?.aborted) return onAbort()
      state.streamPhase = 'closed'
      if ((code !== 0 && !stopping) || finals.length === 0) {
        state.streamReason = code !== 0 && !stopping ? 'nonzero-exit' : 'no-final-result'
        return finish(classified(notice, 'CLI_RESULT_MISSING', 'CLI 图片通道未返回最终结果；未使用普通文字替代。', 'assistant-notice'), code, stopping ? 'terminal-drain' : 'process')
      }
      finish(undefined, code, stopping ? 'terminal-drain' : 'process')
    })
    child.stdin.end(input)
  })
}

import spawn from 'cross-spawn'
import { tmpdir } from 'node:os'
import { performance } from 'node:perf_hooks'
import { CodeBuddyCliError, cliOutputError } from './cli-response.js'
import { terminateProcess } from './cli-process.js'

// One input turn per process. Read JSONL frames, never JSON candidates in text.
export function runImageProcess(command, args, { env = process.env, input, timeoutMs = 180000, signal,
  maxStdoutBytes = 20 * 1024 * 1024, terminalDrainMs = 1000, spawnImpl = spawn } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new CodeBuddyCliError('ABORTED', '请求已取消。'))
    const child = spawnImpl(command, args, { cwd: tmpdir(), env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] })
    const started = performance.now(), finals = []
    let pending = '', stdoutBytes = 0, stderrBytes = 0, stderr = '', notice = '', settled = false, stopping = false, drain, cleanup
    const diagnostics = code => ({ timeoutMs, elapsedMs: Math.round(performance.now() - started), stdoutBytes, stderrBytes, ...(Number.isInteger(code) ? { exitCode: code } : {}) })
    const finish = (error, code) => {
      if (settled) return
      settled = true; clearTimeout(timer); clearTimeout(drain); clearTimeout(cleanup); signal?.removeEventListener('abort', onAbort)
      if (error) { error.processDiagnostics = diagnostics(code); terminateProcess(child); reject(error) }
      else resolve({ stdout: JSON.stringify(finals), stderr: '', processDiagnostics: diagnostics(code) })
    }
    const invalid = () => new CodeBuddyCliError('CLI_STREAM_INVALID', 'CLI 图片通道返回了不合法或未闭合的 JSONL 帧；未交付工具调用。')
    const consume = line => {
      if (!line.trim() || settled) return
      let frame
      try { frame = JSON.parse(line) } catch { finish(invalid()); return }
      if (!frame || typeof frame !== 'object' || Array.isArray(frame) || typeof frame.type !== 'string') return finish(invalid())
      if (frame.type === 'assistant') {
        // Keep only a classified notice, never raw assistant/user/image frames.
        for (const block of frame.message?.content ?? []) if (block?.type === 'text' && typeof block.text === 'string') {
          const candidate = cliOutputError(block.text, '', undefined, 'CLI_STREAM_NOTICE')
          if (candidate.code !== 'CLI_STREAM_NOTICE') notice = block.text
        }
      }
      if (frame.type === 'control_request') return finish(new CodeBuddyCliError('CLI_PERMISSION_REQUIRED', 'CLI 图片通道请求了交互控制或工具权限，插件未自动放行。请更新官方 CLI 并检查配置。'))
      if (frame.type !== 'result') return
      finals.push(frame)
      if (finals.length > 1) {
        const error = new CodeBuddyCliError('STRUCTURED_OUTPUT_INVALID', 'CLI 图片通道返回多个最终结果，未选择其中任何一份或交付工具。 [STRUCTURED_OUTPUT_INVALID:native-final-results]')
        error.responseDiagnostics = { outputMode: 'native-json-schema', reason: 'native-final-results', finalResultCount: finals.length }
        return finish(error)
      }
      // The documented stream is resident. Drain queued frames, then stop this
      // single-turn process and validate the sole terminal record after close.
      drain = setTimeout(() => {
        stopping = true; terminateProcess(child)
        cleanup = setTimeout(() => {
          if (pending.trim()) consume(pending)
          if (signal?.aborted) finish(new CodeBuddyCliError('ABORTED', '请求已取消。'))
          else if (!settled) finish()
        }, 1500)
      }, terminalDrainMs)
    }
    const onAbort = () => finish(new CodeBuddyCliError('ABORTED', '请求已取消。'))
    const timer = setTimeout(() => finish(cliOutputError(notice, stderr, undefined, 'CLI_TIMEOUT', 'CodeBuddy CLI 图片调用超时；请检查登录、模型权限和图片大小。')), timeoutMs)
    signal?.addEventListener('abort', onAbort, { once: true })
    child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8')
    child.stdout.on('data', chunk => {
      if (settled) return
      stdoutBytes += Buffer.byteLength(chunk)
      if (stdoutBytes > maxStdoutBytes) return finish(new CodeBuddyCliError('CLI_OUTPUT_TOO_LARGE', 'CLI 图片通道输出超过安全上限。'))
      pending += chunk
      let newline
      while (!settled && (newline = pending.indexOf('\n')) !== -1) {
        const line = pending.slice(0, newline); pending = pending.slice(newline + 1); consume(line)
      }
    })
    child.stderr.on('data', chunk => { stderrBytes += Buffer.byteLength(chunk); stderr = (stderr + chunk).slice(-32768) })
    child.stdin.on('error', () => {})
    child.once('error', error => finish(new CodeBuddyCliError(error.code === 'ENOENT' ? 'CLI_NOT_FOUND' : 'CLI_START_FAILED', '无法启动官方 CLI 图片通道。')))
    child.once('close', code => {
      if (settled) return
      if (pending.trim()) { const last = pending; pending = ''; consume(last) }
      if (settled) return
      if (signal?.aborted) return onAbort()
      if ((code !== 0 && !stopping) || finals.length === 0) return finish(cliOutputError(notice, stderr, undefined, 'CLI_RESULT_MISSING', 'CLI 图片通道未返回最终结果；未使用普通文字替代。'), code)
      finish(undefined, code)
    })
    child.stdin.end(input)
  })
}

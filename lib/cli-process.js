import spawn from 'cross-spawn'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { CodeBuddyCliError, cliOutputError } from './cli-response.js'
import { processFacts } from './diagnostic-facts.js'

export function terminateProcess(child) {
  if (process.platform === 'win32' && Number.isInteger(child.pid)) {
    const taskkill = join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe')
    const killer = spawn(taskkill, ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' })
    killer.on('error', () => { try { child.kill() } catch {} })
    killer.on('exit', (code) => { if (code !== 0) { try { child.kill() } catch {} } })
    killer.unref()
  } else {
    try { child.kill('SIGKILL') } catch {}
  }
}

export function runProcess(command, args, {
  env = process.env, input = '', timeoutMs = 30000, signal, maxStdoutBytes = 20 * 1024 * 1024
} = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new CodeBuddyCliError('ABORTED', '请求已取消。'))
    const child = spawn(command, args, { cwd: tmpdir(), env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    let stdoutBytes = 0
    let settled = false
    let timedOut = false
    let overflow = false
    const startedAt = performance.now()
    let stderrBytes = 0
    let terminationInitiator, closeObserved = false, observedExitCode, exitSignal
    const diagnostics = () => processFacts({ channel: 'text-json', timeoutMs, elapsedMs: Math.round(performance.now() - startedAt), stdoutBytes, stderrBytes,
      closeObserved, deadlineReached: timedOut, terminationInitiator,
      ...(closeObserved && Number.isInteger(observedExitCode) ? { exitCode: observedExitCode } : {}), ...(exitSignal ? { exitSignal } : {}) })
    const timeoutError = () => {
      const error = new CodeBuddyCliError('CLI_TIMEOUT', `CodeBuddy CLI 在 ${Math.round(timeoutMs / 1000)} 秒内未完成调用。此截止提示不能确定登录、网络或模型权限问题，请查看诊断日志。`)
      error.processDiagnostics = diagnostics()
      return error
    }
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      if (error) { error.processDiagnostics = diagnostics(); reject(error) }
      else resolve(value)
    }
    const onAbort = () => {
      terminationInitiator = 'caller'
      finish(new CodeBuddyCliError('ABORTED', '请求已取消。'))
      terminateProcess(child)
    }
    const timer = setTimeout(() => {
      timedOut = true
      terminationInitiator = 'deadline'
      // Settle even if process-tree cleanup does not emit close promptly.
      finish(timeoutError())
      terminateProcess(child)
    }, timeoutMs)
    timer.unref?.()
    signal?.addEventListener('abort', onAbort, { once: true })
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      if (settled) return
      stdoutBytes += Buffer.byteLength(chunk)
      if (stdoutBytes > maxStdoutBytes) { overflow = true; terminationInitiator = 'parser'; finish(new CodeBuddyCliError('CLI_OUTPUT_TOO_LARGE', 'CodeBuddy CLI 输出超过安全上限。')); terminateProcess(child); return }
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => { stderrBytes += Buffer.byteLength(chunk); stderr = (stderr + chunk).slice(-32768) })
    child.stdin.on('error', () => {})
    child.once('error', (error) => { terminationInitiator = 'spawn'; finish(new CodeBuddyCliError(
      error?.code === 'ENOENT' ? 'CLI_NOT_FOUND' : 'CLI_START_FAILED',
      error?.code === 'ENOENT' ? '找不到 CodeBuddy CLI，请点击“一键配置 CLI”。' : '无法启动 CodeBuddy CLI。'
    )); })
    child.once('close', (code, signalName) => {
      if (settled) return
      closeObserved = true; observedExitCode = code; terminationInitiator ??= 'process'
      exitSignal = signalName == null ? undefined : ['SIGTERM', 'SIGKILL', 'SIGINT', 'SIGABRT', 'SIGSEGV'].includes(signalName) ? signalName : 'other'
      const processDiagnostics = diagnostics()
      if (signal?.aborted) finish(new CodeBuddyCliError('ABORTED', '请求已取消。'))
      else if (timedOut) finish(timeoutError())
      else if (overflow) finish(new CodeBuddyCliError('CLI_OUTPUT_TOO_LARGE', 'CodeBuddy CLI 输出超过安全上限。'))
      else if (code !== 0) finish(cliOutputError(stdout, stderr, processDiagnostics, `CLI_EXIT_${code ?? 'UNKNOWN'}`, `CodeBuddy CLI 退出，代码 ${code ?? '未知'}。`))
      else finish(undefined, { stdout, stderr, processDiagnostics })
    })
    child.stdin.end(input)
  })
}

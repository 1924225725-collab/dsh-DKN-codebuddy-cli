import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { PassThrough } from 'node:stream'
import { runImageProcess } from '../../lib/cn/cli-image-process.js'
import { collectStructuredResult } from '../../lib/cn/cli-response.js'
import { processFacts } from '../../lib/cn/diagnostic-facts.js'

const init = { type: 'system', subtype: 'init' }
const result = { type: 'result', subtype: 'success', structured_output: { text: '中文🙂 C:\\demo', toolCalls: [] } }
const jsonl = frames => frames.map(f => JSON.stringify(f)).join('\n') + '\n'
function run(input, { cut = 0, close = true, code = 0, signalName, stderr = '', signal, timeoutMs = 200, later, killCloses = true } = {}) {
  let child
  return runImageProcess('synthetic', [], { input: 'synthetic', timeoutMs, terminalDrainMs: 15, signal, spawnImpl() {
    child = new EventEmitter()
    child.stdin = new PassThrough(); child.stdout = new PassThrough(); child.stderr = new PassThrough()
    let stopped = false
    child.kill = () => { stopped = true; if (killCloses) queueMicrotask(() => child.emit('close', null, 'SIGKILL')) }
    child.stdin.on('finish', () => queueMicrotask(() => {
      const data = Buffer.from(input)
      if (cut > 0) for (let i = 0; i < data.length && !stopped; i += cut) child.stdout.write(data.subarray(i, i + cut))
      else child.stdout.write(data)
      if (stderr) child.stderr.write(stderr)
      if (later) setTimeout(() => { if (!stopped) { child.stdout.write(later); child.emit('close', code, signalName) } }, 5)
      else if (close && !stopped) { child.stdout.end(); child.stderr.end(); child.emit('close', code, signalName) }
    }))
    return child
  } })
}

test('valid JSONL is invariant under every fixed byte slice, CRLF, blank lines and a final frame without newline', async () => {
  const input = jsonl([init, result])
  // Includes splits in the middle of both Chinese and four-byte emoji UTF-8.
  for (let cut = 1; cut <= Buffer.byteLength(input); cut++) {
    const value = await run(input, { cut })
    assert.equal(collectStructuredResult(value.stdout).result.text, result.structured_output.text)
    assert.equal(value.processDiagnostics.totalFrames, 2)
    assert.equal(value.processDiagnostics.initCount, 1)
    assert.equal(value.processDiagnostics.finalResultCount, 1)
    assert.equal(value.processDiagnostics.closeObserved, true)
    assert.equal(value.processDiagnostics.terminationInitiator, 'process')
  }
  for (const value of ['\r\n' + input.replaceAll('\n', '\r\n'), input.trimEnd()]) {
    const output = await run(value)
    assert.equal(collectStructuredResult(output.stdout).result.text, result.structured_output.text)
  }
})

test('syntax, complete shape and a failed EOF tail are distinguishable without raw frame content', async () => {
  for (const [input, reason, closed, index] of [
    ['{"PRIVATE_BAD":\n', 'json-parse', false, 1],
    [JSON.stringify({ PRIVATE_FIELD: true }) + '\n', 'frame-shape', false, 1],
    [jsonl([init]) + '{"PRIVATE_TAIL":', 'partial-tail', true, 2],
    [jsonl([init, { type: 'assistant', message: { content: 'PRIVATE_BAD_CONTENT' } }]), 'frame-shape', false, 2]
  ]) {
    await assert.rejects(run(input), error => {
      const d = error.processDiagnostics
      assert.equal(error.code, 'CLI_STREAM_INVALID')
      assert.equal(d.streamReason, reason); assert.equal(d.frameIndex, index)
      assert.equal(d.closeObserved, closed); assert.equal(d.terminationInitiator, closed ? 'process' : 'parser')
      assert.equal(d.exitCode, closed ? 0 : undefined)
      assert.ok(d.frameBytes > 0)
      assert.equal(JSON.stringify(error).includes('PRIVATE'), false)
      return true
    })
  }
})

test('domestic preexisting init and metadata acceptance is measured, not silently changed to the international state machine', async () => {
  for (const [frames, count] of [[ [result], 0 ], [[init, init, result], 2], [[init, result, { type: 'system', subtype: 'synthetic-metadata' }], 1]]) {
    const output = await run(jsonl(frames))
    assert.equal(output.processDiagnostics.initCount, count)
    assert.equal(output.processDiagnostics.finalResultCount, 1)
    assert.deepEqual(collectStructuredResult(output.stdout).result.toolCalls, [])
  }
})

test('delayed duplicate results, error frames and permission frames remain terminal blockers after an otherwise good result', async () => {
  for (const [next, expected, reason] of [[result, 'STRUCTURED_OUTPUT_INVALID', 'multiple-results'], [{ type: 'error', error: 'PRIVATE_ERROR' }, 'CLI_REQUEST_FAILED', 'error-frame'], [{ type: 'control_request' }, 'CLI_PERMISSION_REQUIRED', 'permission-frame']]) {
    await assert.rejects(run(jsonl([init, result]), { close: false, later: jsonl([next]) }), error => {
      assert.equal(error.code, expected); assert.equal(error.processDiagnostics.streamReason, reason)
      assert.equal(error.processDiagnostics.firstFinalSeen, true)
      assert.equal(error.processDiagnostics.finalResultCount, expected === 'STRUCTURED_OUTPUT_INVALID' ? 2 : 1)
      return true
    })
  }
})

test('parser, caller, deadline, process and terminal drain describe observed termination without inventing exit status', async () => {
  const controller = new AbortController()
  const cancel = run(jsonl([init]), { signal: controller.signal, close: false })
  controller.abort()
  await assert.rejects(cancel, e => e.code === 'ABORTED' && e.processDiagnostics.terminationInitiator === 'caller' && !e.processDiagnostics.closeObserved && e.processDiagnostics.exitCode === undefined)
  await assert.rejects(run(jsonl([init]), { close: false, timeoutMs: 15 }), e => e.code === 'CLI_TIMEOUT' && e.processDiagnostics.terminationInitiator === 'deadline' && e.processDiagnostics.deadlineReached && !e.processDiagnostics.closeObserved)
  await assert.rejects(run(jsonl([init]), { code: 7 }), e => e.processDiagnostics.streamReason === 'nonzero-exit' && e.processDiagnostics.exitCode === 7 && e.processDiagnostics.closeObserved)
  await assert.rejects(run(jsonl([init])), e => e.processDiagnostics.streamReason === 'no-final-result' && e.processDiagnostics.terminationInitiator === 'process')
  const resident = await run(jsonl([init, result]), { close: false })
  assert.equal(resident.processDiagnostics.terminationInitiator, 'terminal-drain')
  assert.equal(resident.processDiagnostics.closeObserved, true)
  assert.equal(resident.processDiagnostics.exitCode, undefined)
  assert.equal(resident.processDiagnostics.exitSignal, 'SIGKILL')
})

test('unknown frame names are other, and ordinary diagnostic sanitizers reject arbitrary text and out-of-range facts', async () => {
  const output = await run(jsonl([init, result, { type: 'PRIVATE_TYPE', PRIVATE_KEY: 'PRIVATE_BODY' }]))
  assert.equal(output.processDiagnostics.lastFrameClass, 'other')
  assert.equal(JSON.stringify(output.processDiagnostics).includes('PRIVATE'), false)
  assert.deepEqual(processFacts({ streamReason: 'PRIVATE_REASON', channel: 'PRIVATE_CHANNEL', frameBytes: 1.5, totalFrames: 1e99, exitCode: 3221225477, closeObserved: true, stdout: 'PRIVATE' }), { exitCode: 3221225477, closeObserved: true })
})

test('resident cleanup can finish without a close event and does not invent a natural exit code', async () => {
  const output = await run(jsonl([init, result]), { close: false, killCloses: false, timeoutMs: 3000 })
  assert.equal(output.processDiagnostics.terminationInitiator, 'terminal-drain')
  assert.equal(output.processDiagnostics.closeObserved, false)
  assert.equal(output.processDiagnostics.exitCode, undefined)
  assert.equal(output.processDiagnostics.deadlineReached, false)
})

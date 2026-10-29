import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { runImageProcess } from '../../lib/cn/cli-image-process.js'
import { collectStructuredResult } from '../../lib/cn/cli-response.js'
import { parseStructuredResponse } from '../../lib/cn/model-response.js'
const fixture = fileURLToPath(new URL('./fixtures/fake-image-stream.cjs', import.meta.url))
const run = (mode, extra = {}) => runImageProcess(process.execPath, [fixture, mode], { input: '{}\n', timeoutMs: 5000, terminalDrainMs: 150, ...extra })

test('JSONL handles split UTF-8 and returns native output without synthetic text or deltas', async () => {
  const output = await run('valid')
  const parsed = parseStructuredResponse(collectStructuredResult(output.stdout, output).result, [])
  assert.match(parsed.text, /图像测试完成 C:\\examples\\demo/u)
  assert.match(parsed.text, /\{"example":1\}/u)
  assert.equal(output.processDiagnostics.exitCode, 0)
  assert.deepEqual(parsed.calls, [])
})
test('resident stream closes after terminal drain instead of waiting for the total timeout', async () => {
  const output = await run('resident')
  assert.ok(output.processDiagnostics.elapsedMs < 4000)
  assert.equal(collectStructuredResult(output.stdout, output).result.text.startsWith('图像'), true)
})
test('multiple terminal records including a delayed conflict are rejected before delivery', async () => {
  await assert.rejects(run('multiple'), e => e.code === 'STRUCTURED_OUTPUT_INVALID' && e.responseDiagnostics.finalResultCount === 2)
})
test('invalid frames, partial trailing frames, overflow, nonzero exit and interaction requests fail closed', async () => {
  for (const [mode, code, extra] of [['invalid', 'CLI_STREAM_INVALID'], ['tail', 'CLI_STREAM_INVALID'], ['overflow', 'CLI_OUTPUT_TOO_LARGE', { maxStdoutBytes: 1000 }], ['nonzero', 'CLI_RESULT_MISSING'], ['permission', 'CLI_PERMISSION_REQUIRED']]) {
    await assert.rejects(run(mode, extra), e => e.code === code && e.processDiagnostics.stdoutBytes > 0)
  }
})
test('assistant prose never substitutes for native results, and stream authentication notices are classified', async () => {
  await assert.rejects(run('notice'), { code: 'CLI_RESULT_MISSING' })
  await assert.rejects(run('auth'), e => e.code === 'CLI_AUTH_REQUIRED' && !e.message.includes('401 Unauthorized'))
  const output = await run('string')
  assert.throws(() => parseStructuredResponse(collectStructuredResult(output.stdout, output).result, []), { code: 'STRUCTURED_OUTPUT_INVALID' })
})
test('image stream cancellation and total deadline stop the process without a usable result', async () => {
  const controller = new AbortController()
  const pending = run('hang', { signal: controller.signal })
  setTimeout(() => controller.abort(), 150)
  await assert.rejects(pending, { code: 'ABORTED' })
  await assert.rejects(run('hang', { timeoutMs: 150 }), { code: 'CLI_TIMEOUT' })
})

test('complete direct native business-tool calls stop immediately without delivering or exposing their arguments', async () => {
  for (const mode of ['direct-dsh-tool', 'direct-dsh-tool-resident']) {
    await assert.rejects(run(mode), error => {
      assert.equal(error.code, 'CLI_TOOL_PROTOCOL_ERROR')
      assert.ok(error.processDiagnostics.elapsedMs < 4000)
      assert.equal(error.message.includes('PRIVATE_ARGUMENT'), false)
      assert.equal(error.message.includes('synthetic_media_lookup'), false)
      return true
    })
  }
  for (const mode of ['native-structured-tool', 'prose-tool-example', 'partial-tool-event']) {
    const output = await run(mode)
    assert.equal(parseStructuredResponse(collectStructuredResult(output.stdout, output).result, []).calls.length, 0)
  }
})

test('CLI error frames fail immediately with safe classifications and never accept a later result', async () => {
  for(const [mode,code] of [['error-permission','CLI_LOCAL_PERMISSION_DENIED'],['error-auth','CLI_AUTH_REQUIRED'],['error-generic','CLI_REQUEST_FAILED']]){
    await assert.rejects(run(mode),e=>e.code===code&&!e.message.includes('PRIVATE')&&e.processDiagnostics.stdoutBytes>0)
  }
})

test('image error frames and empty streams classify fixed network notices without leaking or accepting later plans', async () => {
  for(const mode of ['error-network','stderr-network'])await assert.rejects(run(mode),e=>e.code==='CLI_NETWORK_ERROR'&&!e.message.includes('PRIVATE')&&!e.message.includes('private.invalid')&&e.processDiagnostics.stderrBytes+e.processDiagnostics.stdoutBytes>0)
})

test('image error frames classify explicit context-limit and balance statuses safely', async () => {
  for (const [mode, code, status] of [['error-context', 'CLI_CONTEXT_TOO_LARGE', 400], ['error-balance', 'CLI_INSUFFICIENT_BALANCE', 402]]) {
    await assert.rejects(run(mode), error => {
      assert.equal(error.code, code)
      assert.equal(error.failure.status, status)
      assert.equal(error.message.includes('PRIVATE'), false)
      assert.ok(error.processDiagnostics.stdoutBytes > 0)
      return true
    })
  }
})

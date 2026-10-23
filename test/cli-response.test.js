import test from 'node:test'
import assert from 'node:assert/strict'
import { collectResult, collectStructuredResult, collectStreamResult, CodeBuddyCliError } from '../lib/cli-response.js'

const ndjson = (items) => items.map((item) => JSON.stringify(item)).join('\n')

test('stream collection keeps native structured output and joins every thinking block in order', () => {
  const value = { text: 'answer', toolCalls: [] }
  const response = collectStreamResult(ndjson([
    { type: 'system', subtype: 'init' },
    { type: 'assistant', message: { content: [{ type: 'thinking', thinking: 'first' }] } },
    { type: 'assistant', message: { content: [{ type: 'text', text: 'partial' }, { type: 'thinking', thinking: 'second' }] } },
    { type: 'assistant', message: { content: [{ type: 'tool_use', name: 'StructuredOutput', input: value }] } },
    { type: 'result', subtype: 'success', structured_output: value, usage: { input_tokens: 5, output_tokens: 2 } }
  ]))
  assert.deepEqual(response.result, value)
  assert.equal(response.thinking, 'first\n\nsecond')
  assert.deepEqual(response.usage, { input_tokens: 5, output_tokens: 2 })
})

test('stream collection omits the thinking field when the CLI reports no reasoning', () => {
  const response = collectStreamResult(ndjson([
    { type: 'assistant', message: { content: [{ type: 'text', text: 'direct' }] } },
    { type: 'result', subtype: 'success', structured_output: { text: 'direct', toolCalls: [] } }
  ]))
  assert.equal(Object.hasOwn(response, 'thinking'), false)
  for (const blank of ['', '   ']) {
    const skipped = collectStreamResult(ndjson([
      { type: 'assistant', message: { content: [{ type: 'thinking', thinking: blank }] } },
      { type: 'result', subtype: 'success', structured_output: { text: '', toolCalls: [] } }
    ]))
    assert.equal(skipped.thinking, undefined)
  }
})

test('stream collection ignores non-JSON progress lines but still fails on empty output', () => {
  const response = collectStreamResult(`${[
    'CodeBuddy CLI 9.8.7 starting',
    JSON.stringify({ type: 'result', subtype: 'success', structured_output: { text: 'ok', toolCalls: [] } })
  ].join('\n')}\n`)
  assert.deepEqual(response.result, { text: 'ok', toolCalls: [] })
  assert.throws(() => collectStreamResult('only progress lines\n'), (error) => error.code === 'CLI_OUTPUT_INVALID')
})

test('stream collection keeps native-only validation and failure facts', () => {
  assert.throws(() => collectStreamResult(ndjson([{ type: 'result', subtype: 'success', result: '{"text":"prose"}' }])),
    (error) => error.code === 'CLI_STRUCTURED_OUTPUT_MISSING' && error.responseDiagnostics.reason === 'native-structured-output-missing')
  assert.throws(() => collectStreamResult(ndjson([{ type: 'result', subtype: 'error_max_turns', is_error: true, usage: { output_tokens: 3 } }])),
    (error) => error.code === 'CLI_REQUEST_FAILED' && error.usage.output_tokens === 3)
  const doc = { type: 'result', structured_output: { text: 'first', toolCalls: [] } }
  assert.throws(() => collectStreamResult(ndjson([doc, { ...doc, structured_output: { text: 'second', toolCalls: [] } }])),
    (error) => error.code === 'STRUCTURED_OUTPUT_INVALID' && error.responseDiagnostics.outputMode === 'native-json-schema')
})

test('reads a structured result from the documented single-object response', () => {
  const response = collectResult(JSON.stringify({
    structured_output: { text: 'hello', toolCalls: [] },
    usage: { input_tokens: 12, output_tokens: 3 }
  }))

  assert.deepEqual(response, {
    result: { text: 'hello', toolCalls: [] },
    usage: { input_tokens: 12, output_tokens: 3 }
  })
})

test('reads the final result from a JSON message array', () => {
  const response = collectResult(JSON.stringify([
    { type: 'system', subtype: 'init' },
    { type: 'assistant', message: { content: 'working' } },
    {
      type: 'result',
      subtype: 'success',
      structured_output: { text: 'done', toolCalls: [] },
      usage: { input_tokens: 20, output_tokens: 5 }
    }
  ]))

  assert.deepEqual(response, {
    result: { text: 'done', toolCalls: [] },
    usage: { input_tokens: 20, output_tokens: 5 }
  })
})

test('preserves CLI failures inside a JSON message array', () => {
  assert.throws(
    () => collectResult(JSON.stringify([{ type: 'result', subtype: 'error_during_execution', is_error: true }])),
    (error) => error instanceof CodeBuddyCliError && error.code === 'CLI_REQUEST_FAILED'
  )
})

test('reports an array without a final result instead of silently choosing a message', () => {
  assert.throws(
    () => collectResult(JSON.stringify([{ type: 'assistant', message: { content: 'not final' } }])),
    (error) => error instanceof CodeBuddyCliError && error.code === 'CLI_OUTPUT_INVALID'
  )
})

test('preserves per-model counters for success and failure without summing assistant snapshots', () => {
  const usage = { input_tokens: 74, cache_creation_input_tokens: 74 }
  const modelUsage = { model: { inputTokens: 0, outputTokens: 29, cacheCreationInputTokens: 74 } }
  const response = collectResult(JSON.stringify([{ type: 'assistant', usage }, { type: 'result', result: 'ok', usage, modelUsage }]))
  assert.deepEqual(response.modelUsage, modelUsage)
  assert.throws(() => collectResult(JSON.stringify({ type: 'result', subtype: 'error', usage, modelUsage })), (error) => {
    assert.deepEqual(error.modelUsage, modelUsage)
    return true
  })
})

test('recognizes authentication notices even with empty stdout and exit 0 without exposing raw notices', () => {
  const processDiagnostics = { timeoutMs: 10000, elapsedMs: 2500, stdoutBytes: 0, stderrBytes: 200, exitCode: 0, token: 'PRIVATE_TOKEN' }
  for (const stderr of ['401 Authentication required. Please use /login (PRIVATE_TOKEN)', '\u001b[31m401 Unauthorized, sign in again\u001b[0m PRIVATE_TOKEN']) {
    assert.throws(() => collectResult('', { stderr, processDiagnostics }), error => {
      assert.equal(error.code, 'CLI_AUTH_REQUIRED')
      assert.match(error.message, /\/login/u)
      assert.equal(error.processDiagnostics.exitCode, 0)
      assert.equal(error.processDiagnostics.stdoutBytes, 0)
      assert.equal(JSON.stringify(error).includes('PRIVATE_TOKEN'), false)
      assert.equal(error.message.includes('PRIVATE_TOKEN'), false)
      return true
    })
  }
  const valid = JSON.stringify({ result: 'valid reply' })
  assert.equal(collectResult(valid, { stderr: '401 Authentication required from an earlier recovered attempt' }).result, 'valid reply')
})

test('classifies fixed CLI notices and distinguishes empty from non-JSON output without retaining bodies', () => {
  for (const [stdout, stderr, code] of [
    ['', '', 'CLI_OUTPUT_INVALID'], ['PRIVATE_NON_JSON', '', 'CLI_OUTPUT_INVALID'],
    ['', '403 Forbidden: access denied PRIVATE_TOKEN', 'CLI_ACCESS_DENIED'],
    ['', '429 Too many requests PRIVATE_TOKEN', 'CLI_RATE_LIMITED'],
    ['', "EPERM: operation not permitted, mkdir 'PRIVATE_PATH'", 'CLI_LOCAL_PERMISSION_DENIED'],
    ['', 'A model quoted an example 401 Authentication required', 'CLI_OUTPUT_INVALID']
  ]) {
    assert.throws(() => collectResult(stdout, { stderr }), error => {
      assert.equal(error.code, code)
      assert.equal(error.message.includes('PRIVATE'), false)
      assert.equal(JSON.stringify(error).includes('PRIVATE'), false)
      return true
    })
  }
  assert.throws(() => collectResult(''), error => error.message.includes('标准输出为空'))
  assert.throws(() => collectResult('plain'), error => error.message.includes('非 JSON'))
})

test('carries immutable DSH-compatible failure facts with a diagnostic ID instead of UNKNOWN', () => {
  const requestId = '9f68b497-ec6a-4cdf-ad81-c2c5384d0583'
  const error = new CodeBuddyCliError('CLI_AUTH_REQUIRED', 'Synthetic authentication failure', { requestId })
  assert.equal(Object.getOwnPropertyDescriptor(error, 'code').value, 'CLI_AUTH_REQUIRED')
  assert.equal(Object.getOwnPropertyDescriptor(error, 'failure').value.code, error.code)
  assert.equal(error.failure.requestId, requestId)
  assert.equal(error.failure.status, 401)
  assert.equal(error.failure.message, error.message)
  assert.ok(error.message.includes(requestId))
  assert.ok(Object.isFrozen(error.failure))
  assert.equal(new CodeBuddyCliError('CLI_TIMEOUT', 'timeout').failure.code, 'CLI_TIMEOUT')
})

test('native collection accepts only the official field and never falls back to valid-looking prose', () => {
  const value = { text: 'literal {"text":"example"} {"toolCalls":[]}', toolCalls: [] }
  assert.deepEqual(collectStructuredResult(JSON.stringify({ type: 'result', structured_output: value, result: 'conflicting prose' })).result, value)
  for (const field of [{}, { structured_output: null }]) {
    assert.throws(() => collectStructuredResult(JSON.stringify({ type: 'result', result: JSON.stringify(value), usage: { input_tokens: 7 }, ...field })), error => {
      assert.equal(error.code, 'CLI_STRUCTURED_OUTPUT_MISSING')
      assert.equal(error.usage.input_tokens, 7)
      assert.equal(error.responseDiagnostics.outputMode, 'native-json-schema')
      assert.equal(Object.keys(error).includes('rawResult'), false)
      return true
    })
  }
})

test('native collection rejects multiple final records without selecting the last or losing CLI errors', () => {
  const doc = { type: 'result', structured_output: { text: 'first', toolCalls: [] } }
  for (const value of [[], [{ type: 'assistant', structured_output: doc.structured_output }], [doc, doc], [doc, { ...doc, structured_output: { text: 'different', toolCalls: [] } }]]) {
    assert.throws(() => collectStructuredResult(JSON.stringify(value)), e => e.code === 'STRUCTURED_OUTPUT_INVALID' && e.responseDiagnostics.reason === 'native-final-results')
  }
  assert.throws(() => collectStructuredResult(JSON.stringify({ ...doc, is_error: true, subtype: 'error_max_turns', usage: { output_tokens: 13 } })), e => e.code === 'CLI_REQUEST_FAILED' && e.usage.output_tokens === 13)
})

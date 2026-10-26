import test from 'node:test'
import assert from 'node:assert/strict'
import { assertInlineImageDataUriBudget, inlineImageDataUriStats, makeRequest, MAX_INLINE_IMAGE_DATA_URI_CHARS, MODEL_SYSTEM_PROMPT } from '../lib/request.js'

test('sends active schemas once, preserves history and reports sizes without retaining prompt contents in diagnostics', () => {
  const tools = [{ name: 'read_file', description: 'UNIQUE_SCHEMA_MARKER', parameters: { type: 'object', properties: {} } }]
  const messages = [{ role: 'system', content: 'DSH system' }, { role: 'user', content: 'private conversation' }, { role: 'assistant', content: [{ type: 'text', text: 'earlier reply' }] }, { role: 'user', content: 'continue' }]
  const { prompt, diagnostics } = makeRequest({ messages, tools, toolHistory: { tools, updates: [] } }, tools)
  assert.equal(prompt.split('UNIQUE_SCHEMA_MARKER').length - 1, 1)
  const envelope = JSON.parse(prompt.slice(prompt.indexOf('{"protocol"')))
  assert.deepEqual(envelope.messages, messages)
  assert.equal('toolHistory' in envelope, false)
  assert.equal(diagnostics.messageCount, 4)
  assert.equal(diagnostics.toolCount, 1)
  assert.equal(diagnostics.promptBytes, Buffer.byteLength(prompt))
  assert.ok(Object.values(diagnostics).every((value) => typeof value === 'number'))
})

test('preserves tool failure flags and instructs the model to honor DSH file and permission checks', () => {
  const messages = [{ role: 'tool', toolCallId: 'failed', content: [{ type: 'text', text: 'Operation declined' }], isError: true },
    { role: 'tool', toolCallId: 'done', content: [{ type: 'text', text: 'Operation completed' }], isError: false }]
  const request = makeRequest({ messages }, [])
  const envelope = JSON.parse(request.prompt.slice(request.prompt.indexOf('{"protocol"')))
  assert.deepEqual(envelope.messages, messages)
  assert.ok(MODEL_SYSTEM_PROMPT.includes('isError=true'))
  assert.ok(MODEL_SYSTEM_PROMPT.includes('read-before-edit'))
  assert.ok(MODEL_SYSTEM_PROMPT.includes('StructuredOutput'))
  assert.ok(MODEL_SYSTEM_PROMPT.includes('exactly once'))
  assert.ok(envelope.instructions.includes('仅允许调用 StructuredOutput'))
  assert.equal(envelope.submission.nativeTool, 'StructuredOutput')
  assert.ok(MODEL_SYSTEM_PROMPT.includes('two separate tool namespaces'))
})

test('counts inline image data URIs without retaining contents and enforces the aggregate character budget', () => {
  const marker = 'PRIVATE_IMAGE_PAYLOAD_MARKER'
  const uri = `data:image/png;base64,${'A'.repeat(MAX_INLINE_IMAGE_DATA_URI_CHARS - 'data:image/png;base64,'.length)}`
  const messages = [{ role: 'user', content: [{ type: 'text', text: `prefix ${uri} ${marker}` }, { type: 'text', text: uri }] }]
  const stats = inlineImageDataUriStats(messages)
  assert.deepEqual(stats, { inlineImageDataUriCount: 2, inlineImageDataUriChars: uri.length * 2 })
  const request = makeRequest({ messages }, [], undefined, stats)
  assert.deepEqual({ inlineImageDataUriCount: request.diagnostics.inlineImageDataUriCount,
    inlineImageDataUriChars: request.diagnostics.inlineImageDataUriChars }, stats)
  assert.equal(JSON.stringify(request.diagnostics).includes(marker), false)

  const withinBudget = { inlineImageDataUriChars: MAX_INLINE_IMAGE_DATA_URI_CHARS }
  assert.doesNotThrow(() => assertInlineImageDataUriBudget(withinBudget))
  assert.throws(() => assertInlineImageDataUriBudget({ inlineImageDataUriChars: MAX_INLINE_IMAGE_DATA_URI_CHARS + 1 }), error => {
    assert.equal(error.code, 'IMAGE_DATA_URI_TOO_LARGE')
    assert.match(error.message, /未提交本轮模型请求/u)
    assert.equal(error.failure.requestId, undefined)
    return true
  })
})

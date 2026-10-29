import test from 'node:test'
import assert from 'node:assert/strict'
import * as requests from '../../lib/cn/request.js'
import { prepareImages } from '../../lib/cn/images.js'

const MiB = 1024 * 1024
test('size decomposition counts only an included response schema', () => {
  for (const schema of [undefined, null, false, { type: 'object', properties: { text: { type: 'string' } } }]) {
    const d = requests.makeRequest({ messages: [] }, [], schema).diagnostics
    assert.equal(d.schemaBytes, schema ? Buffer.byteLength(JSON.stringify(schema)) : 0)
    assert.equal(d.systemBytes + d.messagesBytes + d.toolsBytes + d.schemaBytes + d.envelopeOverheadBytes, d.promptBytes)
  }
})
test('envelope byte boundary is exact and a refused request retains a numeric size decomposition', () => {
  const empty = { messages: [{ role: 'user', content: '' }] }
  const base = requests.makeRequest(empty, [])
  const exact = { messages: [{ role: 'user', content: 'A'.repeat(12 * MiB - base.diagnostics.promptBytes) }] }
  assert.equal(requests.makeRequest(exact, []).diagnostics.promptBytes, 12 * MiB)
  exact.messages[0].content += '中'
  assert.throws(() => requests.makeRequest(exact, []), error => {
    assert.equal(error.code, 'REQUEST_TOO_LARGE')
    const d = error.requestDiagnostics
    assert.ok(d, 'oversized requests must retain size facts instead of losing them before returning')
    assert.equal(d.requestLimitStage, 'envelope')
    assert.equal(d.requestBytes, 12 * MiB + 3, 'the limit counts UTF-8 bytes, not characters')
    assert.equal(d.requestLimitBytes, 12 * MiB)
    assert.equal(d.systemBytes + d.messagesBytes + d.toolsBytes + d.schemaBytes + d.envelopeOverheadBytes, d.promptBytes)
    assert.equal(JSON.stringify(d).includes(exact.messages[0].content.slice(-100)), false)
    return true
  })
})

test('DSH offloading excludes old image bytes but does not discard or compress history text', async () => {
  const ref = id => ({ attachmentId: id, mediaType: 'image/png', bytes: 3, width: 300, height: 200 })
  const images = Array.from({ length: 118 }, (_, i) => ({ type: 'image', attachment: ref(`fixture-${i}`), ...(i < 113 ? { offloaded: true } : {}) }))
  const source = { messages: [{ role: 'user', content: [{ type: 'text', text: 'PRIVATE_SYNTHETIC_HISTORY_MARKER' + 'x'.repeat(12 * MiB) }, ...images] }] }
  const reads = []
  const projected = await prepareImages(source, { supportsImages: true, attachments: { async readImageRequest(r) { reads.push(r.attachmentId); return { data: Buffer.from('abc'), bytes: 3, width: 300, height: 200, mediaType: 'image/png' } } } })
  assert.equal(reads.length, 5)
  assert.ok(reads.every(id => Number(id.slice(8)) >= 113))
  assert.equal(projected.diagnostics.offloadedImageCount, 113)
  assert.equal(projected.diagnostics.imageBase64Bytes, 20)
  assert.equal(projected.options.messages[0].content[0].text, source.messages[0].content[0].text)
  assert.equal(source.messages[0].content[1].type, 'image', 'projection must not mutate DSH history')
  assert.throws(() => requests.makeRequest(projected.options, []), error => {
    assert.equal(error.code, 'REQUEST_TOO_LARGE')
    assert.equal(error.requestDiagnostics?.requestLimitStage, 'envelope')
    assert.ok(error.requestDiagnostics.messagesBytes > 12 * MiB)
    assert.equal(JSON.stringify(error.requestDiagnostics).includes('PRIVATE_SYNTHETIC'), false)
    return true
  })
})

test('final CLI input is measured after required JSON escaping and keeps the independent 20 MiB boundary', () => {
  assert.equal(requests.assertCliInputBudget('A'.repeat(20 * MiB)).cliInputBytes, 20 * MiB)
  assert.throws(() => requests.assertCliInputBudget('A'.repeat(20 * MiB) + '中'), error => {
    assert.equal(error.code, 'REQUEST_TOO_LARGE')
    assert.deepEqual(error.requestDiagnostics, { cliInputBytes: 20 * MiB + 3, requestLimitStage: 'cli-input', requestBytes: 20 * MiB + 3, requestLimitBytes: 20 * MiB })
    return true
  })
  const request = requests.makeRequest({ messages: [{ role: 'user', content: '\\'.repeat(5.5 * MiB) }] }, [])
  assert.ok(request.diagnostics.promptBytes < 12 * MiB)
  const input = JSON.stringify({ type: 'user', message: { role: 'user', content: [{ type: 'text', text: request.prompt }, { type: 'image', source: { type: 'base64', media_type: 'image/png', data: 'YWJj' } }] } }) + '\n'
  assert.throws(() => requests.assertCliInputBudget(input), error => error.requestDiagnostics.requestLimitStage === 'cli-input')
})

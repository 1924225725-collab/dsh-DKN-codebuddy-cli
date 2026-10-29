import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareImages, imageTarget, IMAGE_LIMITS } from '../../lib/cn/images.js'
import { modelInfo } from '../../lib/cn/model-catalog.js'
const ref = id => ({ attachmentId: id, mediaType: 'image/png', bytes: 3, width: 300, height: 200 })
const image = (id, offloaded = false) => ({ type: 'image', attachment: ref(id), ...(offloaded ? { offloaded: true } : {}) })
const version = data => ({ data, bytes: data.byteLength, mediaType: 'image/png', width: 300, height: 200 })
const options = content => ({ messages: [{ role: 'user', content }] })

test('image projection preserves message/block order, associations, duplicate occurrences and original history', async () => {
  const source = { messages: [{ role: 'user', content: [{ type: 'text', text: 'first' }, image('A'), image('B')] }, { role: 'assistant', content: 'prior' }, { role: 'user', content: [image('A'), { type: 'text', text: 'compare' }] }] }
  const original = JSON.stringify(source), reads = []
  const result = await prepareImages(source, { supportsImages: true, attachments: { async readImageRequest(r, target) { reads.push(r.attachmentId); assert.deepEqual(target, { width: 300, height: 200, maxBytes: 2097152 }); return version(Buffer.from(r.attachmentId)) } } })
  assert.deepEqual(reads, ['A', 'B'])
  assert.deepEqual(result.nativeImages.map(x => Buffer.from(x.source.data, 'base64').toString()), ['A', 'B', 'A'])
  assert.match(result.options.messages[2].content[0].text, /CLI image 3; DSH attachment A/u)
  assert.equal(result.options.messages[0].content[0].text, 'first')
  assert.equal(JSON.stringify(source), original)
  assert.equal(result.diagnostics.imageCount, 3)
  assert.equal(JSON.stringify(result.diagnostics).includes('QQ=='), false)
})

test('offloaded images are honest text placeholders, never reloaded or silently reattached', async () => {
  const result = await prepareImages(options([image('old', true)]), { supportsImages: false, attachments: { readImageRequest() { throw Error('must not read') } } })
  assert.deepEqual(result.nativeImages, [])
  assert.match(result.options.messages[0].content[0].text, /NOT included/u)
  assert.equal(result.diagnostics.offloadedImageCount, 1)
})

test('image gating rejects unknown/text-only routes, missing stores, unsupported roles and bad references', async () => {
  for (const supportsImages of [false, undefined]) await assert.rejects(prepareImages(options([image('A')]), { supportsImages }), { code: 'IMAGE_MODEL_UNSUPPORTED' })
  await assert.rejects(prepareImages(options([image('A')]), { supportsImages: true }), { code: 'IMAGE_SERVICE_UNAVAILABLE' })
  await assert.rejects(prepareImages({ messages: [{ role: 'assistant', content: [image('A')] }] }, { supportsImages: true }), { code: 'IMAGE_ROLE_UNSUPPORTED' })
  await assert.rejects(prepareImages(options([{ type: 'image', attachment: { ...ref('A'), mediaType: 'image/svg+xml' } }])), { code: 'IMAGE_ATTACHMENT_INVALID' })
  assert.deepEqual(modelInfo('p', { id: 'a', name: 'a', supportsImages: true }).inputModalities, ['text', 'image'])
  assert.deepEqual(modelInfo('p', { id: 'a', name: 'a' }).inputModalities, ['text'])
})

test('tool screenshots of any producer share native images while retaining tool identity, text and error flags', async () => {
  const messages = [{ role: 'user', content: [image('upload')] }]
  for (const [n, toolName] of ['desktop_capture', 'window_region', 'browser_snapshot', 'read_image', 'custom_renderer'].entries()) {
    messages.push({ role: 'tool', toolCallId: `call-${n}`, name: toolName, isError: n === 3,
      content: [{ type: 'text', text: `observation-${n}` }, image(`screen-${n}`)] })
  }
  // Count budget is shared, so use five total images for successful projection.
  messages.shift()
  const original = JSON.stringify(messages)
  const result = await prepareImages({ messages }, { supportsImages: true, attachments: { async readImageRequest(r) { return version(Buffer.from(r.attachmentId)) } } })
  assert.deepEqual(result.nativeImages.map(x => Buffer.from(x.source.data, 'base64').toString()), messages.map((m,n) => `screen-${n}`))
  for (const [n, message] of result.options.messages.entries()) {
    assert.equal(message.role, 'tool')
    assert.equal(message.toolCallId, `call-${n}`)
    assert.equal(message.name, messages[n].name)
    assert.equal(message.isError, n === 3)
    assert.equal(message.content[0].text, `observation-${n}`)
    assert.match(message.content[1].text, new RegExp(`CLI image ${n + 1};`))
  }
  assert.equal(JSON.stringify(messages), original)
})

test('mixed user and tool image history preserves occurrence order and reuses bytes without deduplicating occurrences', async () => {
  const reads = []
  const source = { messages: [
    { role: 'user', content: [image('A')] },
    { role: 'assistant', content: [{ type: 'tool-call', id: 'call-X', name: 'screen', arguments: '{}' }] },
    { role: 'tool', toolCallId: 'call-X', isError: false, content: [image('B'), { type: 'text', text: 'second screenshot' }, image('A')] },
    { role: 'user', content: 'compare with the earlier upload' }
  ] }
  const result = await prepareImages(source, { supportsImages: true, attachments: { async readImageRequest(r) { reads.push(r.attachmentId); return version(Buffer.from(r.attachmentId)) } } })
  assert.deepEqual(reads, ['A','B'])
  assert.deepEqual(result.nativeImages.map(x => Buffer.from(x.source.data,'base64').toString()), ['A','B','A'])
  assert.equal(result.options.messages[2].toolCallId, 'call-X')
  assert.match(result.options.messages[2].content[2].text, /CLI image 3;/)
  assert.equal(result.diagnostics.imageCount, 3)
})

test('tool image offloading preserves failure metadata and applies the common user/tool count budget', async () => {
  const messages = [{ role: 'user', content: [image('upload')] }, { role: 'tool', toolCallId: 'failed-call', isError: true, content: [image('old', true), image('screen')] }]
  const result = await prepareImages({messages}, {supportsImages:true,attachments:{async readImageRequest(r){ assert.notEqual(r.attachmentId,'old');return version(Buffer.from(r.attachmentId)) }}})
  assert.equal(result.options.messages[1].isError, true)
  assert.match(result.options.messages[1].content[0].text, /NOT included/)
  assert.equal(result.diagnostics.offloadedImageCount,1)
  assert.equal(result.nativeImages.length,2)
  await assert.rejects(prepareImages({messages:[{role:'user',content:[image('A'),image('B')]},{role:'tool',toolCallId:'C',content:Array.from({length:4},(_,n)=>image(String(n)))}]}, {supportsImages:true}), e=>e.code==='IMAGE_OFFLOAD_REQUIRED'&&e.failure.offloadImages===1)
})

test('detached tool images fail before reading attachments while ordinary tool text needs no image identity', async () => {
  for (const toolCallId of [undefined, '', '  ', 42]) {
    await assert.rejects(prepareImages({messages:[{role:'tool',toolCallId,content:[image('A')]}]}, {supportsImages:true,attachments:{readImageRequest(){throw Error('must not read')}}}), {code:'IMAGE_TOOL_CALL_INVALID'})
  }
  const messages=[{role:'tool',content:[{type:'text',text:'saved screenshot.png at https://example.invalid/image.png'}]}]
  const result=await prepareImages({messages})
  assert.deepEqual(result.nativeImages,[])
  assert.deepEqual(result.options.messages,messages)
})

test('count and exact base64 byte budgets request durable DSH offloading with an explicit occurrence count', async () => {
  await assert.rejects(prepareImages(options(Array.from({ length: 7 }, (_, n) => image(String(n)))), { supportsImages: true }), e => e.code === 'IMAGE_OFFLOAD_REQUIRED' && e.failure.offloadImages === 2)
  const attachments = { async readImageRequest() { return version(Buffer.alloc(IMAGE_LIMITS.maxImageBytes)) } }
  await assert.rejects(prepareImages(options([image('A'), image('B'), image('C'), image('D')]), { supportsImages: true, attachments }), e => e.failure.code === 'IMAGE_OFFLOAD_REQUIRED' && e.failure.offloadImages === 2)
})

test('request target preserves aspect ratio; invalid or oversized provider data is rejected', async () => {
  assert.deepEqual(imageTarget({ width: 8000, height: 4000 }), { width: 1920, height: 960, maxBytes: 2097152 })
  for (const data of [{ ...version(Buffer.from('x')), bytes: 99 }, version(Buffer.alloc(IMAGE_LIMITS.maxImageBytes + 1)), { ...version(Buffer.from('x')), mediaType: 'image/svg+xml' }, { ...version(Buffer.from('x')), width: 9999 }]) {
    await assert.rejects(prepareImages(options([image('A')]), { supportsImages: true, attachments: { async readImageRequest() { return data } } }), e => ['IMAGE_ATTACHMENT_INVALID', 'IMAGE_TOO_LARGE'].includes(e.code))
  }
})

test('read failures and cancellations never send partial images or expose attachment error text', async () => {
  await assert.rejects(prepareImages(options([image('A')]), { supportsImages: true, attachments: { async readImageRequest() { throw Error('PRIVATE_ATTACHMENT_PATH') } } }), e => e.code === 'IMAGE_READ_FAILED' && !e.message.includes('PRIVATE'))
  const controller = new AbortController()
  await assert.rejects(prepareImages({ ...options([image('A')]), signal: controller.signal }, { supportsImages: true, attachments: { async readImageRequest(r, t, signal) { assert.equal(signal, controller.signal); controller.abort(); return version(Buffer.from('x')) } } }), { code: 'ABORTED' })
})

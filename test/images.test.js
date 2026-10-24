import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareImages, imageTarget, IMAGE_LIMITS } from '../lib/images.js'
import { modelInfo } from '../lib/model-catalog.js'
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

test('image gating rejects unknown/text-only routes, missing stores, tool images and bad references', async () => {
  for (const supportsImages of [false, undefined]) await assert.rejects(prepareImages(options([image('A')]), { supportsImages }), { code: 'IMAGE_MODEL_UNSUPPORTED' })
  await assert.rejects(prepareImages(options([image('A')]), { supportsImages: true }), { code: 'IMAGE_SERVICE_UNAVAILABLE' })
  await assert.rejects(prepareImages({ messages: [{ role: 'tool', content: [image('A')] }] }, { supportsImages: true }), { code: 'IMAGE_ROLE_UNSUPPORTED' })
  await assert.rejects(prepareImages(options([{ type: 'image', attachment: { ...ref('A'), mediaType: 'image/svg+xml' } }])), { code: 'IMAGE_ATTACHMENT_INVALID' })
  assert.deepEqual(modelInfo('p', { id: 'a', name: 'a', supportsImages: true }).inputModalities, ['text', 'image'])
  assert.deepEqual(modelInfo('p', { id: 'a', name: 'a' }).inputModalities, ['text'])
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

import test from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { mkdtemp, mkdir, readFile, writeFile, chmod, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
registerHooks({ resolve(specifier, context, next) {
  if (specifier === '@deepseek-ai/schemastery') return { url: 'data:text/javascript,export default {object:x=>x,string:()=>({description(){return this},default(){return this},volatile(){return this}}),number:()=>({description(){return this},default(){return this},volatile(){return this}})}', shortCircuit: true }
  if (specifier === '@deepseek-ai/dsh-llm') return { url: 'data:text/javascript,export class LlmAdapter {}', shortCircuit: true }
  return next(specifier, context)
} })
test('full image adapter transmits native image blocks, retains tool authority and excludes image samples from logs', async t => {
  const { apply, inject } = await import('../lib/index.js')
  assert.ok(inject.includes('attachments'))
  const directory = await mkdtemp(path.join(tmpdir(), 'dsh-image-plugin-'))
  const stateKey = process.platform === 'win32' ? 'LOCALAPPDATA' : process.platform === 'darwin' ? 'HOME' : 'XDG_STATE_HOME'
  const oldStateRoot = process.env[stateKey]; process.env[stateKey] = directory
  const bin = process.platform === 'win32' ? path.join(directory, 'node_modules/@tencent-ai/codebuddy-code/bin') : directory
  await mkdir(bin, { recursive: true })
  const entry = path.join(bin, 'codebuddy')
  await writeFile(entry, await readFile(new URL('./fixtures/fake-codebuddy.cjs', import.meta.url))); await chmod(entry, 0o755)
  const executable = process.platform === 'win32' ? path.join(directory, 'codebuddy.cmd') : entry
  if (process.platform === 'win32') await writeFile(executable, '@echo off\r\n')
  let adapter; const cleanups = [], routes = new Map(), reads = []
  const bytes = Buffer.from('SYNTHETIC_IMAGE_BYTES_DO_NOT_LOG')
  const ctx = {
    attachments: { async readImageRequest(ref) { reads.push(ref.attachmentId); return { data: bytes, bytes: bytes.length, mediaType: 'image/png', width: 10, height: 10 } } },
    llm: { registerAdapter(p, a) { adapter = a; return () => {} } },
    effect(f) { const dispose = f(); if (typeof dispose === 'function') cleanups.push(dispose) }, on() {}, emit() {}, inject(deps, f) { f(ctx) },
    webServer: { register(route) { routes.set(route.path, route.handler); return () => {} } }
  }
  t.after(async () => {
    for (const cleanup of cleanups.reverse()) cleanup()
    if (oldStateRoot === undefined) delete process.env[stateKey]; else process.env[stateKey] = oldStateRoot
    const relative = path.relative(tmpdir(), directory)
    if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) await rm(directory, { recursive: true, force: true })
  })
  apply(ctx, { cliPath: executable, timeoutMs: 15000 })
  const models = await adapter.listModels('codebuddy-cli-cn')
  assert.deepEqual(models[0].inputModalities, ['text', 'image']); assert.deepEqual(models[1].inputModalities, ['text'])
  const ref = { attachmentId: 'synthetic-A', mediaType: 'image/png', bytes: bytes.length, width: 10, height: 10 }
  const images = [{ type: 'text', text: 'tool-round' }, { type: 'image', attachment: ref }]
  const opts = { model: 'future-alpha', messages: [{ role: 'user', content: images }], tools: [{ name: 'read_test', parameters: { type: 'object', properties: {} } }] }
  const collect = async options => { const chunks = []; for await (const chunk of adapter.stream(options)) chunks.push(chunk); return chunks }
  const plan = await collect(opts)
  assert.equal(plan.at(-1).reason.kind, 'tool-calls')
  const call = plan.find(c => c.type === 'block-end' && c.block.type === 'tool-call').block
  const done = await collect({ ...opts, messages: [...opts.messages, { role: 'assistant', content: [call] }, { role: 'tool', toolCallId: call.id, content: 'synthetic result only' }, { role: 'user', content: 'summarize the image and result' }] })
  assert.equal(done.at(-1).reason.kind, 'stop')
  assert.equal(done.some(c => c.type.endsWith('-delta')), false)
  const records = (await readFile(path.join(bin, 'requests.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse).filter(x => x.args)
  assert.equal(records.length, 2)
  for (const record of records) {
    assert.equal(record.args[record.args.indexOf('--tools') + 1], 'StructuredOutput')
    assert.equal(record.args[record.args.indexOf('--allowedTools') + 1], 'StructuredOutput')
    assert.equal(record.args[record.args.indexOf('--output-format') + 1], 'stream-json')
    const message = JSON.parse(record.input)
    assert.equal(message.message.content[1].source.data, bytes.toString('base64'))
    assert.equal(message.message.content[0].text.includes(bytes.toString('base64')), false)
    assert.match(message.message.content[0].text, /CLI image 1; DSH attachment synthetic-A/u)
    assert.equal(record.input.trim().split('\n').length, 1, 'DSH history is not replayed as separate CLI turns')
  }
  await assert.rejects(collect({ ...opts, model: 'new-free-model' }), { code: 'IMAGE_MODEL_UNSUPPORTED' })
  await assert.rejects(collect({ ...opts, messages: [{ role: 'user', content: Array.from({ length: 7 }, () => images[1]) }] }), e => e.code === 'IMAGE_OFFLOAD_REQUIRED' && e.failure.offloadImages === 2 && typeof e.failure.requestId === 'string')
  const logsDir = path.join(directory, 'dsh-codebuddy-cli-cn', 'logs')
  // Exercise the real diagnostics route without a browser or real user data.
  const action = async name => {
    const { Readable } = await import('node:stream')
    const request = Readable.from([JSON.stringify({ action: name })]); request.method = 'POST'
    request.headers = { host: 'localhost', origin: 'http://localhost', 'content-type': 'application/json', 'x-dsh-codebuddy-action': '1' }
    let body
    await routes.get('/plugins/dsh-codebuddy-cli-cn/diagnostics')(request, { writeHead() {}, end(value) { body = JSON.parse(value) } })
    return body
  }
  await action('armCapture')
  await assert.rejects(collect({ ...opts, messages: [{ role: 'user', content: [{ type: 'text', text: 'response-case:wrong-shape' }, images[1]] }] }), { code: 'STRUCTURED_OUTPUT_INVALID' })
  const log = await action('exportDetailedLogs')
  assert.equal(log.entries.at(-1).imageRequest, true)
  assert.equal(log.entries.at(-1).captureAttempted, true)
  assert.equal(log.entries.at(-1).sample, undefined)
  const stored = await readFile(path.join(logsDir, 'diagnostics.json'), 'utf8')
  assert.equal(stored.includes(bytes.toString('base64')), false)
  assert.equal(stored.includes('PRIVATE_FAILED_REPLY'), false)
  assert.equal(log.entries[0].diagnostics.imageBytes, bytes.length)
  assert.equal(reads.length, 3)
})

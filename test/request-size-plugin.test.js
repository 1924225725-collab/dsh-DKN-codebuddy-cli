import test from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { mkdtemp, mkdir, readFile, writeFile, chmod, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createDiagnosticsStore } from '../lib/diagnostics.js'
registerHooks({ resolve(specifier, context, next) {
  if (specifier === '@deepseek-ai/schemastery') return { url: 'data:text/javascript,export default {object:x=>x,string:()=>({description(){return this},default(){return this},volatile(){return this}}),number:()=>({description(){return this},default(){return this},volatile(){return this}})}', shortCircuit: true }
  if (specifier === '@deepseek-ai/dsh-llm') return { url: 'data:text/javascript,export class LlmAdapter {}', shortCircuit: true }
  return next(specifier, context)
} })

test('adapter records both local size gates before invoking the model and preserves small offloaded-image history', async t => {
  const { apply } = await import('../lib/index.js')
  const directory = await mkdtemp(path.join(tmpdir(), 'dsh-size-plugin-'))
  const stateKey = process.platform === 'win32' ? 'LOCALAPPDATA' : process.platform === 'darwin' ? 'HOME' : 'XDG_STATE_HOME'
  const oldState = process.env[stateKey]; process.env[stateKey] = directory
  const bin = process.platform === 'win32' ? path.join(directory, 'node_modules/@tencent-ai/codebuddy-code/bin') : directory
  await mkdir(bin, { recursive: true })
  const entry = path.join(bin, 'codebuddy')
  await writeFile(entry, await readFile(new URL('./fixtures/fake-codebuddy.cjs', import.meta.url))); await chmod(entry, 0o755)
  const executable = process.platform === 'win32' ? path.join(directory, 'codebuddy.cmd') : entry
  if (process.platform === 'win32') await writeFile(executable, '@echo off\r\n')
  let adapter; const cleanups = [], routes = new Map(), reads = []
  const bytes = Buffer.from('SYNTHETIC_SIZE_IMAGE_BYTES')
  const ctx = {
    attachments: { async readImageRequest(ref) { reads.push(ref.attachmentId); return { data: bytes, bytes: bytes.length, mediaType: 'image/png', width: 10, height: 10 } } },
    llm: { registerAdapter(provider, value) { adapter = value; return () => {} } },
    effect(f) { const dispose = f(); if (typeof dispose === 'function') cleanups.push(dispose) }, on() {}, emit() {}, inject(deps, f) { f(ctx) },
    webServer: { register(route) { routes.set(route.path, route.handler); return () => {} } }
  }
  t.after(async () => {
    for (const cleanup of cleanups.reverse()) cleanup()
    if (oldState === undefined) delete process.env[stateKey]; else process.env[stateKey] = oldState
    const relative = path.relative(tmpdir(), directory)
    if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) await rm(directory, { recursive: true, force: true })
  })
  apply(ctx, { cliPath: executable, timeoutMs: 15000 })
  await adapter.listModels('codebuddy-cli-cn')
  const images = Array.from({ length: 118 }, (_, i) => ({ type: 'image', attachment: { attachmentId: `synthetic-${i}`, mediaType: 'image/png', bytes: bytes.length, width: 10, height: 10 }, ...(i < 113 ? { offloaded: true } : {}) }))
  const collect = async options => { const chunks = []; for await (const chunk of adapter.stream(options)) chunks.push(chunk); return chunks }
  const options = text => ({ model: 'future-alpha', messages: [{ role: 'user', content: [{ type: 'text', text }, ...images] }], tools: [{ name: 'fixture_read', parameters: { type: 'object', properties: { target: { type: 'string' } } } }] })
  const modelCalls = async () => (await readFile(path.join(bin, 'requests.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse).filter(item => item.args)
  await assert.rejects(collect(options('PRIVATE_SIZE_HISTORY_' + 'x'.repeat(12 * 1024 * 1024))), error => error.code === 'REQUEST_TOO_LARGE' && /文字请求封装/u.test(error.message))
  await assert.rejects(collect(options('\\'.repeat(5.5 * 1024 * 1024))), error => error.code === 'REQUEST_TOO_LARGE' && /CLI 编码输入/u.test(error.message))
  assert.equal((await modelCalls()).length, 0, 'neither local refusal starts a CLI model process')
  const done = await collect(options('SYNTH_SMALL_HISTORY'))
  assert.equal(done.at(-1).reason.kind, 'stop')
  const calls = await modelCalls()
  assert.equal(calls.length, 1)
  const content = JSON.parse(calls[0].input).message.content
  assert.equal(content.filter(item => item.type === 'image').length, 5)
  const envelope = JSON.parse(content[0].text.slice(content[0].text.indexOf('{"protocol"')))
  assert.equal(envelope.messages[0].content.length, 119)
  assert.equal(envelope.messages[0].content[0].text, 'SYNTH_SMALL_HISTORY')
  assert.equal(envelope.messages[0].content.filter(item => item.text?.includes('offloaded')).length, 113)
  assert.equal(envelope.tools.length, 1)
  assert.ok(reads.every(id => Number(id.slice(10)) >= 113))
  assert.equal(reads.length, 15)
  const logsDirectory = path.join(directory, 'dsh-codebuddy-cli-cn', 'logs')
  const store = createDiagnosticsStore({ directory: logsDirectory }); await store.ready
  const report = await store.export()
  assert.equal(report.entries.length, 3)
  const [first, second, success] = report.entries
  for (const failure of [first, second]) {
    assert.equal(failure.errorCode, 'REQUEST_TOO_LARGE')
    assert.equal(failure.diagnostics.imageCount, 5)
    assert.equal(failure.diagnostics.offloadedImageCount, 113)
    assert.equal(failure.diagnostics.messageCount, 1)
    assert.equal(failure.diagnostics.toolCount, 1)
    assert.deepEqual(failure.processDiagnostics, {})
    assert.ok(failure.diagnostics.requestBytes > failure.diagnostics.requestLimitBytes)
  }
  assert.equal(first.diagnostics.requestLimitStage, 'envelope')
  assert.equal(first.diagnostics.cliInputBytes, undefined, 'a later stage is never fabricated')
  assert.equal(first.diagnostics.systemBytes + first.diagnostics.messagesBytes + first.diagnostics.toolsBytes + first.diagnostics.schemaBytes + first.diagnostics.envelopeOverheadBytes, first.diagnostics.promptBytes)
  assert.equal(second.diagnostics.requestLimitStage, 'cli-input')
  assert.ok(second.diagnostics.promptBytes < 12 * 1024 * 1024)
  assert.equal(second.diagnostics.cliInputBytes, second.diagnostics.requestBytes)
  assert.equal(success.state, 'success')
  assert.equal(success.diagnostics.cliInputBytes, Buffer.byteLength(calls[0].input))
  const stored = await readFile(path.join(logsDirectory, 'diagnostics.json'), 'utf8')
  for (const secret of ['PRIVATE_SIZE_HISTORY_', bytes.toString('base64'), 'SYNTH_SMALL_HISTORY']) assert.equal(stored.includes(secret), false)
})

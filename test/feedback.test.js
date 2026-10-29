import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFile } from 'node:fs/promises'
import { webcrypto } from 'node:crypto'
import { inflateRawSync } from 'node:zlib'
import React from 'react'
import renderer, { act } from 'react-test-renderer'
import { createDiagnosticsStore as chinaDiagnostics } from '../lib/cn/diagnostics.js'
import { createDiagnosticsStore as internationalDiagnostics } from '../lib/intl/diagnostics.js'
import { tmpdir } from 'node:os'
import path from 'node:path'

const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
const eventId = '12345678-1234-4234-8234-123456789abc'
const otherId = '12345678-1234-4234-8234-123456789abd'
const form = { title: '点击工具后回复失败', occurredAt: '2026-10-29T12:30', dshVersion: '0.2.1-rc.3', model: 'synthetic-model / cn', sessionId: 'session-synthetic', diagnosticId: eventId, steps: '在新的合成测试会话中点击测试工具然后等待结果', expected: '显示完整总结', actual: '工具执行完成后出现错误', errorText: 'STRUCTURED_OUTPUT_INVALID', tool: 'synthetic-tool 已执行', frequency: '偶发，三次一次', network: '未知' }
const png = new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64'))
const pictures = [{ bytes: png }]
function fixture(overrides = {}) {
  let api
  const downloads = []
  const sandbox = vm.createContext({ React, TextEncoder, TextDecoder, Uint8Array, DataView, Blob, crypto: webcrypto, AbortController, setTimeout: (fn, ms) => { const timer = setTimeout(fn, ms); timer.unref(); return timer }, clearTimeout, Intl,
    navigator: { userAgent: 'synthetic-browser', language: 'zh-CN' }, URL: { createObjectURL: () => 'blob:synthetic', revokeObjectURL() {} },
    document: { body: { appendChild() {} }, createElement() { return { click() { downloads.push(this.download) }, remove() {} } } },
    window: { __ModuleLoader__: { load(m) { api = m.factory(() => React) } } }, ...overrides })
  vm.runInContext(source, sandbox)
  return { api, kit: api.createFeedbackKit(), downloads }
}
const input = () => ({ form: { ...form }, pictures, region: 'cn', status: { provider: 'codebuddy-cli-cn', pluginVersion: '1.0.1', cliCheck: { state: 'available', version: '2.177.0', path: 'DO_NOT_EXPORT_PATH' }, loginCommand: 'DO_NOT_EXPORT_LOGIN', accounts: { accounts: [{ label: 'DO_NOT_EXPORT_ACCOUNT' }], selectedId: eventId }, catalog: { models: [] } }, config: { cliPath: 'DO_NOT_EXPORT_PATH', configDir: 'DO_NOT_EXPORT_CONFIG', timeoutMs: 180000, model: 'configured-not-call-model' }, report: { schemaVersion: 1, environment: { platform: 'win32', arch: 'x64', nodeVersion: '22.20.0', token: 'DO_NOT_EXPORT_ENV_TOKEN' }, entries: [{ id: eventId, state: 'error', model: 'actual-call-model', pluginVersion: '1.0.1', errorCode: 'CLI_TIMEOUT', at: 1793232000000, diagnostics: { requestBytes: 13000000, requestLimitBytes: 12582912, requestLimitStage: 'envelope', streamInputBytes: 13001000 }, processDiagnostics: { channel: 'image-jsonl', totalFrames: 8, tailFrame: true, exitSignal: 'SIGTERM', exitCode: -1, stdoutBytes: 220, deadlineReached: true, elapsedMs: 180000 }, responseDiagnostics: { resultTypePresent: false, hasStructuredOutput: false }, secret: 'DO_NOT_EXPORT_ENTRY', sample: { head: 'PRIVATE_REPLY', originalBytes: 13 } }] }, browser: { userAgent: 'synthetic-browser', timezone: 'Asia/Shanghai', utcOffset: '-480' } })
const jsonFile = (bundle, name) => JSON.parse(bundle.files.find(x => x.name === name).data)
function unpack(buffer) {
  const result = new Map()
  let p = 0
  while (buffer.readUInt32LE(p) === 0x04034b50) {
    const method = buffer.readUInt16LE(p + 8), bytes = buffer.readUInt32LE(p + 18), nameLength = buffer.readUInt16LE(p + 26), extraLength = buffer.readUInt16LE(p + 28)
    const name = buffer.subarray(p + 30, p + 30 + nameLength).toString('utf8'), start = p + 30 + nameLength + extraLength
    const payload = buffer.subarray(start, start + bytes)
    result.set(name, method === 8 ? inflateRawSync(payload) : payload)
    p = start + bytes
  }
  assert.equal(buffer.readUInt32LE(p), 0x02014b50)
  assert.equal(buffer.readUInt32LE(buffer.length - 22), 0x06054b50)
  assert.equal(buffer.readUInt16LE(buffer.length - 12), result.size)
  return result
}

test('feedback requires only summary, actual result and screenshots; recommended and optional omissions never block export', () => {
  const { kit } = fixture()
  const minimum = {title: '这是问题简述测试', actual: '发生了无法完成回复的问题'}
  assert.equal(kit.validate(minimum, pictures), null)
  assert.equal(kit.validate(minimum, []), 'screenshots')
  for(const key of ['title','actual'])assert.equal(kit.validate({...minimum,[key]:''},pictures),key)
  for(const key of ['occurredAt','dshVersion','model','steps','expected','errorText','tool','frequency','network','sessionId','diagnosticId','missingReason'])assert.equal(kit.validate({...form,[key]:''},pictures),null)
  assert.equal(kit.validate({...minimum,diagnosticId:'typo'},pictures),null)
  assert.equal(kit.validate(form, Array(7).fill(pictures[0])), 'screenshots')
  assert.equal(kit.validate(form, [{ bytes: new Uint8Array(6 * 1024 * 1024) }]), 'screenshots')
})

test('screenshot headers are checked before decoding, including JPEG/WebP dimensions and oversized PNG rejection', () => {
  const { kit } = fixture()
  assert.equal(kit.inspectImage(png, 'image/png').width, 1)
  const huge = new Uint8Array(png); new DataView(huge.buffer).setUint32(16, 40000)
  assert.throws(() => kit.inspectImage(huge, 'image/png'), /dimensions/)
  assert.throws(() => kit.inspectImage(png, 'image/svg+xml'), /dimensions/)
  const jpeg = new Uint8Array([255, 216, 255, 192, 0, 8, 8, 0, 3, 0, 4, 0])
  assert.equal(kit.inspectImage(jpeg, 'image/jpeg').height, 3)
  const webp = new Uint8Array(30)
  webp.set(new TextEncoder().encode('RIFF'), 0); webp.set(new TextEncoder().encode('WEBPVP8X'), 8)
  webp[24] = 4; webp[27] = 5
  assert.equal(kit.inspectImage(webp, 'image/webp').width, 5)
})

test('local diagnostic replacement accepts bounded exports, verifies region, rejects duplicates and arbitrary/credential JSON', () => {
  const {kit} = fixture(), data = input().report
  assert.equal(kit.importLogs(JSON.stringify(data),'cn').regionVerified,false)
  const tagged={...data,region:'cn',provider:'codebuddy-cli-cn'}
  assert.equal(kit.importLogs(JSON.stringify(tagged),'cn').regionVerified,true)
  assert.throws(()=>kit.importLogs(JSON.stringify(tagged),'intl'),/log-region/)
  assert.throws(()=>kit.importLogs('{"access_token":"secret"}','cn'),/log-shape/)
  assert.throws(()=>kit.importLogs(JSON.stringify({...data,entries:[...data.entries,...data.entries]}),'cn'),/duplicate/)
  assert.throws(()=>kit.importLogs(' '.repeat(4*1024*1024+1),'cn'),/log-size/)
})

test('both diagnostic exporters include trustworthy regional metadata for new local replacements', async () => {
  for(const [region, factory] of [['cn',chinaDiagnostics],['intl',internationalDiagnostics]]){
    const store=factory({directory:path.join(tmpdir(),'dkn-feedback-test-'+webcrypto.randomUUID())})
    const exported=await store.export()
    assert.equal(exported.region,region);assert.equal(exported.provider,'codebuddy-cli-'+region)
    assert.equal(fixture().kit.importLogs(JSON.stringify(exported),region).regionVerified,true)
  }
})

test('feedback preserves regional numeric/termination/size facts, separates configuration and exact event, excludes credentials', async () => {
  const { kit } = fixture()
  const bundle = await kit.prepare(input()), report = jsonFile(bundle, 'report.json'), logs = jsonFile(bundle, 'diagnostics.json')
  assert.equal(report.region, 'cn'); assert.equal(report.support.qqGroup, '1095591284'); assert.equal(report.support.automaticUpload, false)
  assert.equal(report.automatic.diagnosticMatch, 'exact-id'); assert.equal(report.automatic.selectedEvent.model, 'actual-call-model')
  assert.equal(report.automatic.status.configuration.model, 'configured-not-call-model')
  assert.equal(report.automatic.selectedEvent.diagnostics.requestBytes, 13000000)
  assert.equal(report.automatic.selectedEvent.processDiagnostics.exitCode, -1)
  assert.equal(report.automatic.selectedEvent.processDiagnostics.totalFrames, 8)
  assert.equal(report.automatic.selectedEvent.responseDiagnostics.resultTypePresent, false)
  assert.equal(logs.entries[0].sample, undefined)
  assert.doesNotMatch(bundle.files.filter(x => typeof x.data === 'string').map(x => x.data).join('\n'), /DO_NOT_EXPORT|PRIVATE_REPLY/)
  const intl = input(); intl.region = 'intl'; intl.report.entries[0].processDiagnostics = { frameCount: 6, resultCount: 1, parseStage: 'tail', terminationInitiator: 'adapter-drain' }
  const i = jsonFile(await kit.prepare(intl), 'report.json')
  assert.equal(i.region, 'intl'); assert.equal(i.automatic.selectedEvent.processDiagnostics.frameCount, 6)
  assert.equal(i.automatic.selectedEvent.processDiagnostics.parseStage, 'tail')
})

test('unmatched IDs, old-version events, missing services and active requests are stated as evidence gaps', async () => {
  const { kit } = fixture(), data = input()
  data.form.diagnosticId = otherId; data.status.activeCalls = 1
  const bundle = await kit.prepare(data)
  assert.equal(bundle.document.automatic.selectedEvent, null)
  assert.ok(bundle.gaps.some(x => x.includes('No matching diagnostic')))
  assert.ok(bundle.gaps.some(x => x.includes('active requests')))
  data.form.diagnosticId = eventId; data.report.entries[0].pluginVersion = '0.4.2'
  assert.ok((await kit.prepare(data)).gaps.some(x => x.includes('versions differ')))
  data.report = null; data.status = null
  const absent = await kit.prepare(data)
  assert.ok(absent.gaps.some(x => x.includes('service was unavailable')))
  assert.ok(absent.gaps.some(x => x.includes('Runtime status was unavailable')))
})

test('raw replies need explicit opt-in and exact ID, exclude image captures and unrelated samples, mask common text secrets', async () => {
  const { kit } = fixture(), data = input()
  data.detailed = true; data.report.entries[0].sample.head = 'Useful failure data api_key="SENSITIVE_API_VALUE" Authorization: Bearer very.secret.token'
  data.report.entries.push({ ...data.report.entries[0], id: otherId, sample: { head: 'UNRELATED_REPLY' } })
  data.attachments = [{ text: 'access_token=OTHER_SECRET\nHelpful context' }]
  data.form.context = 'A quoted example: {"api_key":"USER_SECRET"} and backslash \\ plus 中文'
  const bundle = await kit.prepare(data), content = bundle.files.filter(x => typeof x.data === 'string').map(x => x.data).join('\n')
  assert.match(content, /Useful failure data/); assert.doesNotMatch(content, /SENSITIVE_API_VALUE|very.secret.token|OTHER_SECRET|UNRELATED_REPLY/)
  assert.doesNotMatch(content, /USER_SECRET/)
  assert.ok(jsonFile(bundle, 'report.json').userProvided.context.includes('[REDACTED]'))
  assert.ok(jsonFile(bundle, 'diagnostics.json').entries[0].sample.head.includes('[REDACTED]'))
  data.report.entries[0].imageRequest = true
  assert.equal(jsonFile(await kit.prepare(data), 'report.json').privacy.includesRawReplies, false)
  data.report.entries[0].imageRequest = false; data.form.diagnosticId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
  assert.equal(jsonFile(await kit.prepare(data), 'report.json').privacy.includesRawReplies, false)
})

test('standard ZIP contains bounded files and manifest hashes match every byte including Unicode text and screenshot', async () => {
  const { kit } = fixture(), data = input(); data.attachments = [{ text: '合成测试，不包含用户材料。' }]
  const bundle = await kit.prepare(data), blob = await kit.archive(bundle.files), buffer = Buffer.from(await blob.arrayBuffer()), entries = unpack(buffer)
  assert.equal(blob.type, 'application/zip'); assert.equal(entries.size, bundle.files.length)
  assert.deepEqual(entries.get('screenshots/context-1.png'), Buffer.from(png))
  for (const file of bundle.manifest.files) {
    const bytes = entries.get(file.path)
    assert.equal(bytes.length, file.bytes)
    assert.equal(Buffer.from(await webcrypto.subtle.digest('SHA-256', bytes)).toString('hex'), file.sha256)
  }
  await assert.rejects(kit.archive([{ name: '../escape', data: 'x' }]), /unsafe/)
  data.attachments = Array(4).fill({ text: 'x' }); await assert.rejects(kit.prepare(data), /attachments/)
  data.attachments = [{ text: 'x'.repeat(4 * 1024 * 1024 + 1) }]; await assert.rejects(kit.prepare(data), /attachments/)
})

test('feedback UI blocks incomplete submission, uses only regional local read routes, freezes preview and requires fresh review after edits', async t => {
  const calls = [], data = input(), pngBlob = new Blob([png], { type: 'image/png' })
  const fixtureApi = fixture({
    createImageBitmap: async () => ({ width: 1, height: 1, close() {} }),
    document: { body: { appendChild() {} }, createElement(type) { if (type === 'canvas') return { getContext: () => ({ drawImage() {} }), toBlob: cb => cb(pngBlob) }; return { click() { fixtureApi.downloads.push(this.download) }, remove() {} } } },
    fetch: async (url, options = {}) => { calls.push({ url, options }); return { ok: true, json: async () => url.endsWith('/status') ? data.status : data.report } }
  })
  const labels = {}
  fixtureApi.api.apply({ effect: f => f(), locale: { register: (ns, v) => { labels[ns] = v; return () => {} }, bind: () => x => x }, configForms: { get() {}, whileServed() {} }, slots: { inject() {} } })
  const tZh = key => labels['settings.codebuddy-cli'].zh[key]
  let tree
  await act(async () => { tree = renderer.create(React.createElement(fixtureApi.api.IssueFeedback, { t: tZh, region: 'intl', diagnosticsUrl: '/plugins/dsh-codebuddy-cli-intl/diagnostics', statusUrl: '/plugins/dsh-codebuddy-cli-intl/status', config: data.config })) })
  t.after(() => act(() => tree.unmount()))
  const button = key => tree.root.findAllByType('button').find(x => x.children.join('') === tZh(key))
  assert.equal(calls.length, 1)
  await act(async () => button('feedbackPrepare').props.onClick())
  assert.match(JSON.stringify(tree.toJSON()), /请补全或检查/); assert.equal(calls.length, 1)
  for (const [key, value] of Object.entries(form)) await act(async () => tree.root.findAll(x => ['input', 'textarea'].includes(x.type) && x.props['aria-label'] === tZh('feedback' + key))[0].props.onChange({ target: { value } }))
  const fileInput = tree.root.findAllByType('input').find(x => x.props.accept?.startsWith('image/'))
  await act(async () => fileInput.props.onChange({ target: { files: [{ type: 'image/png', size: png.length, arrayBuffer: async () => png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength) }], value: 'fake.png' } }))
  await act(async () => button('feedbackPrepare').props.onClick())
  assert.equal(calls.length, 3)
  assert.ok(calls.every(x => x.url.startsWith('/plugins/dsh-codebuddy-cli-intl/') && !x.options.method))
  assert.equal(button('feedbackDownload').props.disabled, true)
  const consent = tree.root.findAllByType('input').filter(x => x.props.type === 'checkbox').at(-1)
  await act(async () => consent.props.onChange({ target: { checked: true } }))
  assert.equal(button('feedbackDownload').props.disabled, false)
  await act(async () => button('feedbackDownload').props.onClick())
  assert.match(fixtureApi.downloads.at(-1), /^dsh-dkn-codebuddy-feedback-intl-/)
  assert.equal(calls.length, 3)
  const title = tree.root.findAllByType('input').find(x => x.props['aria-label'] === tZh('feedbacktitle'))
  await act(async () => title.props.onChange({ target: { value: '修改了问题描述以后' } }))
  assert.equal(button('feedbackDownload'), undefined)
})

test('minimal feedback plus optional local replacement preserves provenance, requires legacy-region confirmation and restores automatic logs', async t => {
  const calls=[],data=input(),pngBlob=new Blob([png],{type:'image/png'})
  const f=fixture({createImageBitmap:async()=>({width:1,height:1,close(){}}),document:{body:{appendChild(){}},createElement(type){return type==='canvas'?{getContext:()=>({drawImage(){}}),toBlob:cb=>cb(pngBlob)}:{click(){},remove(){}}}},fetch:async(url,options={})=>{calls.push({url,options});return {ok:true,json:async()=>url.endsWith('/status')?data.status:data.report}}})
  const dictionaries={};f.api.apply({effect:fn=>fn(),locale:{register:(ns,v)=>{dictionaries[ns]=v;return()=>{}},bind:()=>x=>x},configForms:{get(){},whileServed(){}},slots:{inject(){}}})
  const tr=k=>dictionaries['settings.codebuddy-cli'].zh[k]
  let tree;await act(async()=>{tree=renderer.create(React.createElement(f.api.IssueFeedback,{t:tr,region:'cn',statusUrl:'/plugins/dsh-codebuddy-cli-cn/status',diagnosticsUrl:'/plugins/dsh-codebuddy-cli-cn/diagnostics',config:{}}))});t.after(()=>act(()=>tree.unmount()))
  const inputBy=key=>tree.root.findAllByType('input').find(x=>x.props['aria-label']===tr(key))
  const button=key=>tree.root.findAllByType('button').find(x=>x.children.join('')===tr(key))
  assert.equal(calls.length,1)
  assert.equal(tree.root.findAllByType('select').length,0)
  await act(async()=>inputBy('feedbacktitle').props.onChange({target:{value:'这是最少材料测试'}}))
  await act(async()=>tree.root.findAllByType('textarea').find(x=>x.props['aria-label']===tr('feedbackactual')).props.onChange({target:{value:'打开后出现问题无法使用'}}))
  await act(async()=>inputBy('feedbackScreenshots').props.onChange({target:{files:[{type:'image/png',size:png.length,arrayBuffer:async()=>png.buffer.slice(png.byteOffset,png.byteOffset+png.byteLength)}],value:''}}))
  const json=JSON.stringify({...data.report,entries:[{...data.report.entries[0],id:otherId,model:'LOCAL_ONLY_MODEL'}]})
  await act(async()=>inputBy('feedbackReplaceLogs').props.onChange({target:{files:[{name:'diagnostics.json',size:json.length,arrayBuffer:async()=>new TextEncoder().encode(json).buffer}],value:''}}))
  assert.equal(button('feedbackApplyLocal').props.disabled,true)
  const confirm=tree.root.findAllByType('label').find(x=>x.children.some(c=>c===tr('feedbackLocalConfirm'))).findByType('input')
  await act(async()=>confirm.props.onChange({target:{checked:true}}))
  await act(async()=>button('feedbackApplyLocal').props.onClick())
  const before=calls.length
  await act(async()=>button('feedbackPrepare').props.onClick())
  assert.equal(calls.length,before+1);assert.ok(calls.at(-1).url.endsWith('/status'))
  const report=JSON.parse(tree.root.findAllByType('pre').find(x=>x.children.join('').includes('"reportId"')&&x.children.join('').includes('"automatic"')).children.join(''))
  assert.equal(report.automatic.logSource.kind,'local-file');assert.equal(report.automatic.logSource.regionEvidence,'user-confirmed')
  assert.equal(report.automatic.diagnosticMatch,'not-found')
  assert.equal(button('feedbackDownload').props.disabled,true)
  await act(async()=>button('feedbackUseAuto').props.onClick())
  assert.equal(button('feedbackDownload'),undefined)
  assert.ok(calls.at(-1).url.endsWith('/diagnostics'))
})

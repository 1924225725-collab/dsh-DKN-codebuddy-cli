import test from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { mkdtemp, mkdir, writeFile, readFile, chmod, rm } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { createServer } from 'node:http'
import { once } from 'node:events'

const stub=`const field=()=>({description(){return this},default(value){this.fallback=value;return this},volatile(){return this}});export default {string:field,number:field,object:shape=>({shape})}`
registerHooks({resolve(specifier,context,next){
 if(specifier==='@deepseek-ai/schemastery')return{url:'data:text/javascript,'+encodeURIComponent(stub),shortCircuit:true}
 if(specifier==='@deepseek-ai/dsh-llm')return{url:'data:text/javascript,export class LlmAdapter {}',shortCircuit:true}
 return next(specifier,context)
}})
test('one installed package retains two providers, independent requests, cancellation and diagnostics',async t=>{
 const cn=await import('dsh-dkn-codebuddy-cli'),intl=await import('dsh-dkn-codebuddy-cli/intl')
 assert.equal(cn.name,'llm-codebuddy-cli-cn');assert.equal(intl.name,'llm-codebuddy-cli-intl')
 const directory=await mkdtemp(path.join(tmpdir(),'dsh-unified-'))
 const stateKey=process.platform==='win32'?'LOCALAPPDATA':process.platform==='darwin'?'HOME':'XDG_STATE_HOME'
 const oldState=process.env[stateKey];process.env[stateKey]=directory
 const routes=new Map(),adapters=new Map(),cleanups=[]
 const ctx={
  attachments:{async readImageRequest(){const data=Buffer.from('SYNTHETIC_IMAGE');return{data,bytes:data.length,mediaType:'image/png',width:8,height:8}}},
  llm:{registerAdapter(providers,adapter){for(const p of providers)if(adapters.has(p))throw Object.assign(Error('DUPLICATE_ADAPTER'),{code:'DUPLICATE_ADAPTER'});for(const p of providers)adapters.set(p,adapter);return()=>providers.forEach(p=>adapters.delete(p))}},
  effect(fn){const off=fn();if(typeof off==='function')cleanups.push(off)},on(){},emit(){},inject(deps,fn){fn(ctx)},
  webServer:{register(r){assert.ok(!routes.has(r.path));routes.set(r.path,r.handler);return()=>routes.delete(r.path)}}
 }
 const server=createServer((req,res)=>{const handler=routes.get(new URL(req.url,'http://fixture').pathname);if(!handler){res.statusCode=404;res.end();return}Promise.resolve(handler(req,res)).catch(e=>{res.statusCode=500;res.end(e.code||'error')})})
 t.after(async()=>{cleanups.reverse().forEach(f=>f());await new Promise(resolve=>server.close(resolve));if(oldState===undefined)delete process.env[stateKey];else process.env[stateKey]=oldState;assert.ok(directory.startsWith(tmpdir()));await rm(directory,{recursive:true,force:true})})
 const bin=path.join(directory,'node_modules','@tencent-ai','codebuddy-code','bin');await mkdir(bin,{recursive:true})
 const entry=path.join(bin,'codebuddy');await writeFile(entry,await readFile(new URL('./fixtures/dual-cli.cjs',import.meta.url)));await chmod(entry,0o755)
 const executable=process.platform==='win32'?path.join(directory,'codebuddy.cmd'):entry
 if(process.platform==='win32')await writeFile(executable,'@echo off\r\n')
 const cnDir=path.join(directory,'cn'),intlDir=path.join(directory,'intl');await mkdir(cnDir);await mkdir(intlDir)
 cn.apply(ctx,{cliPath:executable,configDir:cnDir,timeoutMs:15000});intl.apply(ctx,{cliPath:executable,configDir:intlDir,timeoutMs:15000})
 server.listen(0,'127.0.0.1');await once(server,'listening');const origin='http://127.0.0.1:'+server.address().port
 const status=region=>fetch(origin+'/plugins/dsh-codebuddy-cli-'+region+'/status').then(r=>r.json())
 const [ca,ia]=[adapters.get('codebuddy-cli-cn'),adapters.get('codebuddy-cli-intl')]
 const [cm,im]=await Promise.all([ca.listModels('codebuddy-cli-cn'),ia.listModels('codebuddy-cli-intl')])
 assert.equal(cm[0].id,im[0].id);assert.notEqual(cm[0].provider,im[0].provider);assert.notEqual(cm[0].name,im[0].name)
 const consume=async(adapter,text,extra={})=>{const chunks=[];for await(const c of adapter.stream({model:'same-model',messages:[{role:'user',content:text}],...extra}))chunks.push(c);return chunks}
 const [cr,ir]=await Promise.all([consume(ca,'hello'),consume(ia,'hello')])
 assert.equal(cr.find(c=>c.type==='block-end').block.text,'internal synthetic reply')
 assert.equal(ir.find(c=>c.type==='block-end').block.text,'public synthetic reply')
 const image={type:'image',attachment:{attachmentId:'synthetic-only',mediaType:'image/png',bytes:15,width:8,height:8}}
 const [ci,ii]=await Promise.all([consume(ca,'image',{messages:[{role:'user',content:[image]}]}),consume(ia,'image',{messages:[{role:'tool',toolCallId:'synthetic-tool-id',content:[image]}]})])
 assert.equal(ci.find(c=>c.type==='block-end').block.text,'internal synthetic reply')
 assert.equal(ii.find(c=>c.type==='block-end').block.text,'public synthetic reply')
 const tool={name:'read_test',parameters:{type:'object',properties:{target:{type:'string'}}}}
 const proposals=await consume(ia,'TOOL_SYNTHETIC',{tools:[tool]})
 const block=proposals.find(c=>c.type==='block-end').block
 assert.equal(JSON.parse(block.arguments).target,'public.txt')
 const follow=await consume(ia,'hello',{tools:[tool],messages:[{role:'assistant',content:[block]},{role:'tool',toolCallId:block.id,content:'synthetic result'}]})
 assert.equal(follow.at(-1).reason.kind,'stop')
 const abort=new AbortController();const waiting=consume(ia,'HANG_SYNTHETIC',{signal:abort.signal}).catch(e=>e)
 for(let n=0;n<100&&(await status('intl')).activeCalls!==1;n++)await new Promise(r=>setTimeout(r,10))
 assert.equal((await status('intl')).activeCalls,1)
 await consume(ca,'hello while international waits');assert.equal((await status('cn')).activeCalls,0)
 abort.abort();assert.equal((await waiting).code,'ABORTED')
 await assert.rejects(consume(ia,'AUTH_SYNTHETIC'),e=>e.code==='CLI_AUTH_REQUIRED')
 await consume(ca,'still works')
 const [cs,is]=await Promise.all([status('cn'),status('intl')])
 assert.equal(cs.usage.lastCall.state,'success');assert.equal(is.usage.lastCall.errorCode,'CLI_AUTH_REQUIRED')
 assert.notEqual(cs.usage.calls,is.usage.calls)
 const [cl,il]=await Promise.all(['cn','intl'].map(r=>fetch(origin+'/plugins/dsh-codebuddy-cli-'+r+'/diagnostics').then(x=>x.json())))
 assert.ok(cl.entries.every(x=>x.model==='same-model'));assert.ok(il.entries.some(x=>x.errorCode==='CLI_AUTH_REQUIRED'))
 assert.ok(!cl.entries.some(x=>x.errorCode==='CLI_AUTH_REQUIRED'))
 for(const [dir,region]of[[cnDir,'internal'],[intlDir,'public']]){
  const records=(await readFile(path.join(dir,'fixture-calls.jsonl'),'utf8')).trim().split('\n').map(JSON.parse)
  assert.ok(records.every(r=>r.region===region))
 }
 assert.equal(routes.size,8)
})

test('unified CN default ignores an inherited foreign CLI directory without changing the parent',async()=>{
 const {cliEnv,loginCommand}=await import('../lib/cn/cli-runtime.js')
 const parent={CODEBUDDY_CONFIG_DIR:'foreign-profile',CODEBUDDY_INTERNET_ENVIRONMENT:'public',KEEP:'synthetic'}
 const env=cliEnv({},parent)
 assert.equal(env.CODEBUDDY_CONFIG_DIR,undefined);assert.equal(env.CODEBUDDY_INTERNET_ENVIRONMENT,'internal');assert.equal(parent.CODEBUDDY_CONFIG_DIR,'foreign-profile')
 assert.equal(cliEnv({configDir:'explicit-cn'},parent).CODEBUDDY_CONFIG_DIR,'explicit-cn')
 assert.ok(loginCommand({},'codebuddy','win32').includes('Remove-Item Env:CODEBUDDY_CONFIG_DIR'))
 assert.ok(loginCommand({},'codebuddy','linux').startsWith('env -u CODEBUDDY_CONFIG_DIR '))
})

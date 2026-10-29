import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import vm from 'node:vm'
import React from 'react'
import renderer,{act} from 'react-test-renderer'

test('one UI keeps regional drafts, actions, consent, log exports and diagnostic formats separate',async t=>{
 let api,page,props;const dictionaries={},calls=[],downloads=[],registrations=[]
 const forms=Object.fromEntries(['cn','intl'].map(region=>{
  let snapshot={status:'ready',writable:true,revision:1,value:{cliPath:'',configDir:region+'-profile',model:'',effort:'',timeoutMs:180000}};const listeners=new Set()
  return [region,{getSnapshot:()=>snapshot,subscribe:f=>{listeners.add(f);return()=>listeners.delete(f)},async mutate(ops,revision){assert.equal(revision,snapshot.revision);snapshot={...snapshot,value:{...snapshot.value},revision:revision+1};for(const op of ops)snapshot.value[op.path[0]]=op.value;listeners.forEach(f=>f())}}]
 }))
 const statuses=Object.fromEntries(['cn','intl'].map(r=>[r,{pluginVersion:'1.0.1',timeoutMs:180000,activeCalls:0,cliCheck:{state:'available',version:'9.8.7'},setup:{state:'idle'},usage:{calls:r==='cn'?2:7,inputTokens:10,outputTokens:1},catalog:{state:'ready',fetchedAt:1,models:[{id:'same-model',name:r,multiplier:r==='cn'?.2:.7,efforts:[],supportsImages:true}]},accounts:{supported:true,selectedId:null,accounts:[]},logs:{entries:1,failures:0,samples:0,captureArmed:false}}]))
 const sandbox=vm.createContext({React,TextEncoder,TextDecoder,AbortController,setInterval:()=>1,clearInterval(){},clearTimeout(){},setTimeout:()=>1,navigator:{clipboard:{writeText:async()=>{}}},Blob,
  URL:{createObjectURL:()=> 'blob:fixture',revokeObjectURL(){}},document:{body:{appendChild(){}},createElement(){return{click(){downloads.push(this.download)},remove(){}}}},
  window:{__ModuleLoader__:{load(m){api=m.factory(()=>React)}}},
  fetch:async(url,options={})=>{
   const region=url.includes('-intl/')?'intl':'cn';const status=statuses[region];const body=options.body?JSON.parse(options.body):null;calls.push({url,region,body})
   if(url.endsWith('/accounts')&&body?.action==='add')status.accounts.accounts.push({id:'synthetic-'+region,label:body.label,credentialsPresent:false})
   if(url.endsWith('/diagnostics')){
    if(body?.action==='armCapture')status.logs.captureArmed=true
    if(body?.action==='exportLogs'||!body)return{ok:true,json:async()=>({entries:[{region}]})}
   }
   return{ok:true,json:async()=>structuredClone(status)}
  }
 })
 vm.runInContext(await readFile(new URL('../lib/client.js',import.meta.url),'utf8'),sandbox)
 const ctx={effect:fn=>fn(),locale:{register:(ns,v)=>{dictionaries[ns]=v;return()=>{}},bind:ns=>key=>dictionaries[ns].zh[key]},configForms:{get:ns=>forms[ns.endsWith('intl')?'intl':'cn'],whileServed:(ns,fn)=>fn()},layout:{selectPanel(){},panelInfo:{getSnapshot:()=>({activePanelId:null})}},slots:{inject:(name,fn)=>fn(),register(options,component){registrations.push(options);if(options.name==='main'){page=component;props=options.inject()}return()=>{}}}}
 api.apply(ctx)
 assert.equal(registrations.filter(x=>x.name==='sidebar.panellist').length,1)
 assert.equal(registrations.filter(x=>x.name==='plugins.row.config').length,2)
 let tree;await act(async()=>{tree=renderer.create(React.createElement(page,props))});t.after(()=>act(()=>tree.unmount()))
 const region=r=>tree.root.findAllByType('div').find(n=>n.props['data-region']===r)
 const button=(r,label)=>region(r).findAllByType('button').find(n=>n.children.join('')===label)
 const switchRegion=async name=>{await act(async()=>tree.root.findAllByType('nav').find(n=>n.props['aria-label']==='配置区域').findAllByType('button').find(n=>n.children.join('')===name).props.onClick())}
 const cnInput=region('cn').findAllByType('input').find(n=>n.props.list==='dsh-codebuddy-cn-models')
 await act(async()=>cnInput.props.onChange({target:{value:'cn-only-draft'}}))
 await switchRegion('国际版')
 assert.equal(region('cn').props.hidden,true);assert.equal(region('intl').props.hidden,false)
 assert.equal(button('intl','刷新模型与倍率').props.disabled,false)
 await act(async()=>button('intl','刷新模型与倍率').props.onClick())
 assert.equal(calls.at(-1).region,'intl');assert.equal(forms.cn.getSnapshot().value.model,'')
 await switchRegion('国内版');assert.equal(cnInput.props.value,'cn-only-draft')
 await act(async()=>button('cn','保存设置').props.onClick())
 assert.equal(forms.cn.getSnapshot().value.model,'cn-only-draft');assert.equal(forms.intl.getSnapshot().value.model,'')
 await switchRegion('国际版')
 const label=region('intl').findAllByType('input').find(n=>n.props['aria-label']==='账号备注')
 await act(async()=>label.props.onChange({target:{value:'intl-only'}}))
 await act(async()=>button('intl','新增独立账号').props.onClick())
 assert.equal(calls.findLast(c=>c.body?.action==='add').url,'/plugins/dsh-codebuddy-cli-intl/accounts');assert.equal(statuses.cn.accounts.accounts.length,0)
 const consent=region('intl').findAllByType('label').find(n=>n.children.some(c=>typeof c==='string' && c===dictionaries['settings.codebuddy-cli-intl-unified'].zh.captureConsent)).findByType('input')
 await act(async()=>consent.props.onChange({target:{checked:true}}))
 await act(async()=>button('intl','采集下一次失败回复').props.onClick())
 assert.equal(statuses.intl.logs.captureArmed,true);assert.equal(statuses.cn.logs.captureArmed,false)
 assert.equal(button('cn','采集下一次失败回复').props.disabled,true)
 await act(async()=>button('intl','导出普通日志').props.onClick())
 assert.match(downloads.at(-1),/dsh-codebuddy-intl-basic-/)
 statuses.intl.usage.lastCall={state:'error',errorCode:'CLI_TIMEOUT',processDiagnostics:{streamReason:'deadline',streamPhase:'after-init',parseStage:'none',frameIndex:2,frameCount:4,frameBytes:20,initCount:1,resultCount:0,lastFrameClass:'assistant',terminationInitiator:'deadline',closeObserved:false,deadlineReached:true},responseDiagnostics:{hasStructuredOutput:false,structuredOutputType:'missing',resultTypeValid:true,finalSubtypeClass:'missing',noticeClass:'network',noticeSource:'stderr'}}
 await act(async()=>button('intl','刷新模型与倍率').props.onClick())
 const text=JSON.stringify(tree.toJSON())
 assert.ok(JSON.stringify(tree.toJSON()).includes('帧 2/4'))
 assert.ok(JSON.stringify(tree.toJSON()).includes('24 MiB'))
 assert.ok(!text.includes('NaN'))
 assert.equal(region('cn').findAllByType('input').find(n=>n.props.list).props.list==='dsh-codebuddy-cn-models',true)
})

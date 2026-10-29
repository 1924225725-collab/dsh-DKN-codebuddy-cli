const fs=require('node:fs'),path=require('node:path'),readline=require('node:readline')
const region=process.env.CODEBUDDY_INTERNET_ENVIRONMENT
const dir=process.env.CODEBUDDY_CONFIG_DIR
function record(value){fs.appendFileSync(path.join(dir,'fixture-calls.jsonl'),JSON.stringify({region,...value})+'\n')}
if(process.argv.includes('--version'))console.log('CodeBuddy CLI 9.8.7')
else if(process.argv.includes('--acp')){
 const reader=readline.createInterface({input:process.stdin})
 reader.on('line',line=>{const m=JSON.parse(line);record({method:m.method});let result
 if(m.method==='initialize')result={protocolVersion:1,agentCapabilities:{}}
 else if(m.method==='session/new')result={sessionId:'synthetic',models:{currentModelId:'same-model',availableModels:[{modelId:'same-model',name:region,_meta:{credits:region==='internal'?'x0.25 credits':'x0.75 credits',supportsImages:true}}]}}
 else throw Error('Only catalog discovery is permitted')
 console.log(JSON.stringify({jsonrpc:'2.0',id:m.id,result}))})
}else{
 let input='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>input+=chunk)
 process.stdin.on('end',()=>{record({kind:'call',configDir:dir})
 if(input.includes('HANG_SYNTHETIC')){setInterval(()=>{},1000);return}
 if(input.includes('AUTH_SYNTHETIC')){process.stderr.write('Error: 401 Authentication required');return}
 const isImage=process.argv.includes('--input-format')
 const text=isImage?JSON.parse(input.trim()).message.content.find(b=>b.type==='text').text:input
 const envelope=JSON.parse(text.slice(text.indexOf('{"protocol"')))
 const calls=text.includes('TOOL_SYNTHETIC')&&!envelope.messages.some(m=>m.role==='tool')?[{name:'read_test',arguments:{target:region+'.txt'}}]:[]
 const result={type:'result',subtype:'success',structured_output:{text:calls.length?'':region+' synthetic reply',toolCalls:calls},usage:{input_tokens:region==='internal'?11:23,output_tokens:3}}
 if(isImage)console.log(JSON.stringify({type:'system',subtype:'init'}))
 console.log(JSON.stringify(result))
 })
}

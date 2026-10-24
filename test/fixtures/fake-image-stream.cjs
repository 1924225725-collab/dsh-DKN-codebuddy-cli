const mode = process.argv[2]
const result = { type: 'result', subtype: 'success', structured_output: { text: '图像测试完成 C:\\examples\\demo {"example":1}', toolCalls: [] }, usage: { input_tokens: 17, output_tokens: 9 } }
const send = value => process.stdout.write(JSON.stringify(value) + '\n')
process.stdin.resume()
process.stdin.on('end', () => {
  if (mode === 'hang') return setInterval(() => {}, 1000)
  if (mode === 'error-permission') { send({type:'error',error:'EPERM: operation not permitted, mkdir PRIVATE_PATH'}); send(result); return }
  if (mode === 'error-auth') { send({type:'error',error:{message:'401 Unauthorized PRIVATE_AUTH'}}); return }
  if (mode === 'error-generic') { send({type:'error',error:{message:'PRIVATE_UNKNOWN_ERROR'}}); return }
  if (mode === 'auth') { send({ type: 'assistant', message: { content: [{ type: 'text', text: '401 Unauthorized' }] } }); return }
  if (mode === 'notice') { send({ type: 'assistant', message: { content: [{ type: 'text', text: '{"text":"fake plan","toolCalls":[]}' }] } }); return }
  if (mode === 'permission') { send({ type: 'control_request', request: { subtype: 'can_use_tool', tool_name: 'Read' } }); return }
  if (mode === 'invalid') { process.stdout.write('{"type":"result"'); return }
  if (mode === 'overflow') { process.stdout.write('X'.repeat(5000)); return }
  if (mode === 'nonzero') { send(result); process.exitCode = 2; return }
  if (mode === 'multiple') { send(result); setTimeout(() => send({ ...result, structured_output: { text: 'conflict', toolCalls: [] } }), 40); return }
  if (mode === 'tail') { send(result); process.stdout.write('{broken'); return }
  if (mode === 'string') { send({ ...result, structured_output: JSON.stringify(result.structured_output) }); return }
  const bytes = Buffer.from(JSON.stringify(result) + '\n')
  const split = bytes.indexOf(Buffer.from('图')) + 1
  process.stdout.write(bytes.subarray(0, split))
  setTimeout(() => { process.stdout.write(bytes.subarray(split)); if (mode === 'resident') setInterval(() => {}, 1000) }, 10)
})

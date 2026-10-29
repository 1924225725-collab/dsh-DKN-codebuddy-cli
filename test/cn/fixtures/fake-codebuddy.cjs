#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const readline = require('node:readline')
const recordFile = path.join(process.env.DSH_FIXTURE_DIR || __dirname, 'requests.jsonl')
const record = (data) => fs.appendFileSync(recordFile, `${JSON.stringify(data)}\n`)
const models = [
  { modelId: 'future-alpha', name: '未来 Alpha', _meta: { credits: 'x0.33 credits', supportsImages: true, supportsReasoning: true, maxInputTokens: 1000000, effortOptions: [{ value: 'high', name: 'High' }] } },
  { modelId: 'new-free-model', name: 'New Free', _meta: { credits: 'x0.00 credits', supportsReasoning: false } }
]
if (process.argv.includes('--version')) {
  console.log(`CodeBuddy CLI ${process.env.DSH_FIXTURE_CLI_VERSION || '9.8.7'}`)
} else if (process.env.DSH_FIXTURE_LOGIN_PROBE === '1') {
  record({ loginArgs: process.argv.slice(2), accountHome: process.env.USERPROFILE, competingAuth: !!(process.env.CODEBUDDY_AUTH_TOKEN || process.env.CODEBUDDY_API_KEY) })
} else if (process.argv.includes('--acp')) {
  console.log('fixture startup diagnostic')
  const reader = readline.createInterface({ input: process.stdin })
  reader.on('line', (line) => {
    const message = JSON.parse(line)
    record({ method: message.method })
    if (process.argv.includes('--hang')) return
    let result
    if (message.method === 'initialize') result = { protocolVersion: 1, agentCapabilities: {} }
    else if (message.method === 'session/new') result = { sessionId: 'fixture-session', models: { currentModelId: 'future-alpha', availableModels: models } }
    else throw new Error('Discovery must never send a model prompt')
    const buffer = Buffer.from(`${JSON.stringify({ jsonrpc: '2.0', id: message.id, result })}\n`)
    const split = Math.floor(buffer.length / 2)
    process.stdout.write(buffer.subarray(0, split))
    setTimeout(() => process.stdout.write(buffer.subarray(split)), 1)
  })
} else if (process.argv.includes('--print')) {
  let input = ''
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (chunk) => { input += chunk })
  process.stdin.on('end', () => {
    record({ args: process.argv.slice(2), input, accountHome: process.env.USERPROFILE, configDir: process.env.CODEBUDDY_CONFIG_DIR, competingAuth: !!(process.env.CODEBUDDY_AUTH_TOKEN || process.env.CODEBUDDY_API_KEY) })
    const streaming = process.argv.includes('--input-format')
    if (streaming) input = JSON.parse(input).message.content[0].text
    if (input.includes('response-case:wait-for-cancel')) { setInterval(() => {}, 1000); return }
    if (input.includes('response-case:auth-required')) { process.stderr.write('401 Authentication required. Please use /login PRIVATE_AUTH_TOKEN'); return }
    if (input.includes('response-case:network-reset')) { process.stderr.write('Error: 502 安全连接建立失败：Client network socket disconnected before secure TLS connection was established PRIVATE_NETWORK_TOKEN https://private.invalid/secret'); return }
    if (input.includes('response-case:empty-output')) return
    if (input.includes('response-case:non-json')) { process.stdout.write('PRIVATE_NON_JSON'); return }
    const envelope = JSON.parse(input.slice(input.indexOf('{"protocol"')))
    const toolCalls = input.includes('tool-round') && envelope.tools.length && !envelope.messages.some((message) => message.role === 'tool') ? [{ name: envelope.tools[0].name, arguments: { target: 'sandbox.txt' } }] : []
    let response = JSON.stringify({ text: toolCalls.length ? '' : 'fixture response', toolCalls })
    if (input.includes('response-case:fenced-tool')) response = `\`\`\`json\n${JSON.stringify({ toolCalls: [{ name: envelope.tools[0].name, arguments: JSON.stringify({ target: 'sandbox.txt' }) }] })}\n\`\`\``
    if (input.includes('response-case:truncated')) response = '{"text":"PRIVATE_FAILED_REPLY'
    if (input.includes('response-case:wrong-shape')) response = JSON.stringify({ text: { PRIVATE_FAILED_REPLY: true }, toolCalls: [] })
    if (input.includes('response-case:malformed-final-text')) response = '{"text":"输出 5\n退出码 0；路径 C:\\project\\demo","toolCalls":[]}'
    if (input.includes('response-case:annotated-tool')) response = '说明 [阶段一] [阶段二]\n' + JSON.stringify({ text: '', toolCalls: [{ name: envelope.tools[0].name, arguments: { target: 'sandbox.txt' } }] })
    if (input.includes('response-case:duplicate-tool')) {
      const plan = JSON.stringify({ text: '', toolCalls: [{ name: envelope.tools[0].name, arguments: { target: 'sandbox.txt' } }] })
      response = plan + '\n' + plan
    }
    if (input.includes('response-case:ambiguous')) response = [JSON.stringify({ text: 'PRIVATE_FAILED_REPLY', toolCalls: [] }), JSON.stringify({ text: 'conflicting reply', toolCalls: [] })].join('\n')
    if (process.argv.includes('--json-schema')) {
      let value = { text: toolCalls.length ? '' : 'fixture response', toolCalls }
      if (input.includes('response-case:native-literal-tool')) value = { text: '示例 {"text":"example"} {"toolCalls":[]}；路径 C:\\samples\\demo', toolCalls: [{ name: envelope.tools[0].name, arguments: { target: 'sandbox.txt' } }] }
      if (input.includes('response-case:native-duplicate-tools')) {
        const call = { name: envelope.tools[0].name, arguments: { target: 'sandbox.txt' } }
        value = { text: '', toolCalls: [call, call] }
      }
      if (input.includes('response-case:native-final')) value = { text: '输出 5\n退出码 0；路径 C:\\project\\demo', toolCalls: [] }
      if (input.includes('response-case:wrong-shape')) value = { text: { PRIVATE_FAILED_REPLY: true }, toolCalls: [] }
      if (input.includes('response-case:native-string')) value = JSON.stringify(value)
      if (input.includes('response-case:native-unknown-tool')) value = { text: '', toolCalls: [{ name: 'UNDECLARED_TOOL', arguments: {} }] }
      if (input.includes('response-case:native-invalid-args')) value = { text: '', toolCalls: [{ name: envelope.tools[0].name, arguments: '{}' }] }
      const result = { type: 'result', subtype: 'success', result: response,
        structured_output: value, usage: { input_tokens: 11, output_tokens: 7, cache_read_input_tokens: 3, cache_creation_input_tokens: 4 } }
      if (input.includes('response-case:truncated') || input.includes('response-case:missing-native')) delete result.structured_output
      if (input.includes('response-case:null-native')) result.structured_output = null
      if (input.includes('response-case:schema-error')) { result.is_error = true; result.subtype = 'error_max_turns' }
      if (input.includes('response-case:ambiguous')) {
        if (streaming) { console.log(JSON.stringify(result)); console.log(JSON.stringify({ ...result, structured_output: { text: 'different final', toolCalls: [] } })); return }
        console.log(JSON.stringify([{ ...result, structured_output: { text: 'PRIVATE_FAILED_REPLY', toolCalls: [] } }, { ...result, structured_output: { text: 'different final', toolCalls: [] } }]))
        return
      }
      if (streaming) {
        console.log(JSON.stringify({ type: 'system', subtype: 'init' }))
        console.log(JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: '{"text":"prose example","toolCalls":[]}' }] } }))
        console.log(JSON.stringify(result))
      } else console.log(JSON.stringify([{ type: 'system', subtype: 'init' }, result]))
      return
    }
    console.log(JSON.stringify([
      { type: 'system', subtype: 'init' },
      { type: 'result', subtype: 'success', result: response, usage: { input_tokens: 11, output_tokens: 7, cache_read_input_tokens: 3, cache_creation_input_tokens: 4 } }
    ]))
  })
} else {
  throw new Error('Unexpected CLI invocation')
}

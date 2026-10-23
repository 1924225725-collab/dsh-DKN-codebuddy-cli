import test from 'node:test'
import assert from 'node:assert/strict'
import { parseModelResponse } from '../lib/model-response.js'

const envelope = { text: 'hello', toolCalls: [] }
const tool = { name: 'edit_demo' }
const toolEnvelope = { text: '', toolCalls: [{ name: tool.name, arguments: { content: 'quoted "text"\nC:\\demo\\file.txt { [ ] }' } }] }

test('accepts exact envelopes and complete wrappers without changing reply or tool arguments', () => {
  const json = JSON.stringify(toolEnvelope)
  for (const result of [toolEnvelope, json, `\uFEFF${json}`, `\n\`\`\`json\n${json}\n\`\`\`\n`, JSON.stringify(json), { data: toolEnvelope }, { result: json }, [toolEnvelope], `模型结果如下：\n${json}\n以上为结果。`]) {
    const parsed = parseModelResponse(result, [tool])
    assert.equal(parsed.text, toolEnvelope.text)
    assert.deepEqual(JSON.parse(parsed.calls[0].arguments), toolEnvelope.toolCalls[0].arguments)
    assert.equal(parsed.responseDiagnostics.reason, 'valid')
  }
})

test('normalizes only unambiguous text-only and nonempty tool-only envelopes', () => {
  assert.deepEqual(parseModelResponse({ text: 'hello' }).calls, [])
  for (const value of [{ toolCalls: toolEnvelope.toolCalls }, { text: null, toolCalls: toolEnvelope.toolCalls }]) {
    const parsed = parseModelResponse(value, [tool])
    assert.equal(parsed.text, '')
    assert.equal(parsed.calls.length, 1)
  }
  for (const value of [{ toolCalls: [] }, { text: null, toolCalls: [] }, { text: 'hello', tool_calls: [toolEnvelope.toolCalls[0]] }]) {
    assert.throws(() => parseModelResponse(value, [tool]), (error) => error.code === 'STRUCTURED_OUTPUT_INVALID')
  }
})

test('decodes complete string arguments but rejects truncated or non-object arguments', () => {
  const value = { ...toolEnvelope, toolCalls: [{ name: tool.name, arguments: JSON.stringify({ content: 'ok' }) }] }
  assert.deepEqual(JSON.parse(parseModelResponse(value, [tool]).calls[0].arguments), { content: 'ok' })
  for (const args of ['{"content":"unfinished', '[]', 'null', '42', [], null]) {
    assert.throws(() => parseModelResponse({ text: '', toolCalls: [{ name: tool.name, arguments: args }] }, [tool]), (error) => error.code === 'TOOL_CALL_INVALID')
  }
})

test('never selects between multiple results, repairs incomplete JSON or accepts unknown tools', () => {
  const json = JSON.stringify(toolEnvelope)
  for (const value of [json + '\n' + json, 'prefix\n' + json + '\n{"text":', json + '}', json.slice(0, -1), '```json\n' + json.slice(0, -1), '[{"text":"ok","toolCalls":[]},', '{"text":"C:\\demo\\test","toolCalls":[]}', JSON.stringify({ text: 'hello', toolCalls: [] }).slice(0, -4)]) {
    assert.throws(() => parseModelResponse(value, [tool]), (error) => error.code === 'STRUCTURED_OUTPUT_INVALID')
  }
  assert.throws(() => parseModelResponse(toolEnvelope, []), (error) => error.code === 'TOOL_CALL_INVALID' && error.responseDiagnostics.reason === 'unknown-tool')
  assert.throws(() => parseModelResponse([envelope, envelope]), (error) => error.responseDiagnostics.reason === 'invalid-envelope')
})

test('accepts delimiter-free plain text as a text-only response without inferring or executing tools', () => {
  const reply = '工作区文件没有列出；请先确认当前测试文件夹已放入 DSH 工作区。'
  const result = parseModelResponse(reply, [tool])
  assert.equal(result.text, reply)
  assert.deepEqual(result.calls, [])
  assert.equal(result.responseDiagnostics.reason, 'plain-text-fallback')
  assert.ok(result.responseDiagnostics.normalizations.includes('plain-text-fallback'))
  for (const malformed of ['{"text":', '{]bad', 'prefix {"text":"ok"']) {
    assert.throws(() => parseModelResponse(malformed, [tool]), error => error.code === 'STRUCTURED_OUTPUT_INVALID')
  }
})

test('preserves complete JSON examples and bracket labels as ordinary text when no protocol result exists', () => {
  for (const reply of [
    'Example: {"example":1}',
    '```json\n{"example":1}\n```',
    'Stage marker [阶段一]',
    'Stages: [阶段一] then [阶段二]',
    'Examples: {} and []',
    '```text\nC:\\测试目录\\含 空格\\demo.txt\n{"example":1} [阶段一] [阶段二]\n他说："hello"；反斜杠是 \\\n```'
  ]) {
    const result = parseModelResponse(reply, [tool])
    assert.equal(result.text, reply)
    assert.deepEqual(result.calls, [])
    assert.equal(result.responseDiagnostics.reason, 'plain-text-fallback')
  }
})

test('treats balanced malformed non-protocol examples as text but rejects malformed protocol-shaped results', () => {
  for (const reply of ['Example: {"example":,}', '```json\n{"example":,}\n```', 'Text {"example":,} and [label]']) {
    const result = parseModelResponse(reply, [tool])
    assert.equal(result.text, reply)
    assert.deepEqual(result.calls, [])
    assert.equal(result.responseDiagnostics.reason, 'plain-text-fallback')
  }
  for (const reply of ['{"text":,}', '{"toolCalls":,}', '{"name":"edit_demo","arguments":,}']) {
    assert.throws(() => parseModelResponse(reply, [tool]), error => error.code === 'STRUCTURED_OUTPUT_INVALID')
  }
})

test('rejects incomplete tails even after a complete text-only candidate', () => {
  const json = JSON.stringify(envelope)
  for (const tail of ['{"example":', '{"toolCalls":', '{"name":"edit_demo"', '{"text":"second']) {
    assert.throws(() => parseModelResponse(`${json}\n${tail}`, [tool]), error => {
      assert.equal(error.responseDiagnostics.reason, 'possibly-truncated-json')
      assert.equal(error.responseDiagnostics.scanIncomplete, true)
      assert.equal(error.responseDiagnostics.incompleteTailIgnored, undefined)
      return true
    })
  }
  assert.throws(() => parseModelResponse(`${JSON.stringify(toolEnvelope)}\n{"example":`, [tool]), error => error.responseDiagnostics.reason === 'possibly-truncated-json')
})

test('diagnostics distinguish empty, syntax and shape failures without including response content or keys', () => {
  const secret = 'PRIVATE_CONTENT_NEVER_LOG'
  const cases = [['', 'empty-result'], ['{] ' + secret, 'invalid-json'], ['{"text":"' + secret, 'possibly-truncated-json'], [{ [secret]: secret }, 'invalid-text-field'], [{ text: secret, toolCalls: '[]' }, 'invalid-tool-calls-field']]
  for (const [value, reason] of cases) {
    assert.throws(() => parseModelResponse(value), (error) => {
      assert.equal(error.responseDiagnostics.reason, reason)
      assert.equal(JSON.stringify(error.responseDiagnostics).includes(secret), false)
      assert.equal(error.message.includes(secret), false)
      if (reason === 'possibly-truncated-json') {
        assert.equal(error.responseDiagnostics.scanIncomplete, true)
        assert.equal(error.responseDiagnostics.scanBroken, false)
        assert.equal(error.responseDiagnostics.insideString, true)
      }
      if (reason === 'invalid-json') assert.equal(error.responseDiagnostics.scanBroken, true)
      return true
    })
  }
})

test('large complete replies and multiline tool content pass without truncation', () => {
  const content = '长文本 "quoted" C:\\demo\\path\n{[content]}\n'.repeat(40000)
  const parsed = parseModelResponse(JSON.stringify({ text: content, toolCalls: [{ name: tool.name, arguments: { content } }] }), [tool])
  assert.equal(parsed.text, content)
  assert.equal(JSON.parse(parsed.calls[0].arguments).content, content)
})

test('empty or whitespace-only text without tools fails instead of silently ending the turn', () => {
  for (const value of [{ text: '', toolCalls: [] }, { text: ' \n\t', toolCalls: [] }, { text: '' }]) {
    assert.throws(() => parseModelResponse(value), error => error.code === 'STRUCTURED_OUTPUT_INVALID' && error.responseDiagnostics.reason === 'empty-content')
  }
  assert.equal(parseModelResponse(toolEnvelope, [tool]).calls.length, 1)
})

test('selects one validated protocol result beside unrelated complete fragments only', () => {
  const json = JSON.stringify(toolEnvelope)
  for (const prefix of ['说明 [阶段一] [阶段二]\n', '{}\n[]\n', '{"example":1}\n["example"]\n']) {
    const parsed = parseModelResponse(prefix + json, [tool])
    assert.equal(parsed.calls.length, 1)
    assert.deepEqual(JSON.parse(parsed.calls[0].arguments), toolEnvelope.toolCalls[0].arguments)
    assert.equal(parsed.responseDiagnostics.validProtocolCandidates, 1)
    assert.equal(parsed.responseDiagnostics.ignoredContainers, 2)
    assert.ok(parsed.responseDiagnostics.normalizations.includes('unique-protocol-result'))
  }
})

test('never ignores a second valid, malformed, wrapped or undeclared tool candidate', () => {
  const json = JSON.stringify(envelope)
  for (const other of [json, JSON.stringify(toolEnvelope), '{"text":42,"toolCalls":[]}', '{"tool_calls":[{"name":"edit_demo"}]}', '{"data":{"text":42}}', '{"name":"edit_demo","arguments":{}}', '{"command":"do not execute"}', JSON.stringify([JSON.stringify(toolEnvelope)]), '{"x":}', '[1,]', '{"text":']) {
    assert.throws(() => parseModelResponse(json + '\n' + other), error => error.code === 'STRUCTURED_OUTPUT_INVALID')
  }
  assert.throws(() => parseModelResponse(json + '\n' + JSON.stringify(toolEnvelope)), error => {
    assert.equal(error.responseDiagnostics.reason, 'ambiguous-json')
    assert.equal(error.responseDiagnostics.containerSummaries[1].toolCount, 1)
    assert.equal(JSON.stringify(error.responseDiagnostics).includes('content'), false)
    return true
  })
  assert.throws(() => parseModelResponse(Array(20).fill(json).join('\n')), error => {
    assert.equal(error.responseDiagnostics.containerSummaries.length, 12)
    assert.equal(error.responseDiagnostics.completeContainers, 20)
    assert.equal(error.responseDiagnostics.containerSummariesTruncated, true)
    return true
  })
})

import z from '@deepseek-ai/schemastery'
import { LlmAdapter } from '@deepseek-ai/dsh-llm'
import { CodeBuddyCliError, collectStructuredResult } from './cli-response.js'
import { runProcess } from './cli-process.js'
import { runImageProcess } from './cli-image-process.js'
import { hasImageBlocks, prepareImages, imageTarget } from './images.js'
import { cliEnv, inspectCli, resolveCli, ensureCli, loginCommand } from './cli-runtime.js'
import { createModelCatalog, queryModelCatalog, modelInfo } from './model-catalog.js'
import { trustedLocalRequest, readAction, readLocalJson } from './local-http.js'
import { createAccountStore, accountModelId } from './accounts.js'
import { cliInvocation } from './cli-invocation.js'
import { normalizeCliUsage } from './usage.js'
import { assertCliInputBudget, assertInlineImageDataUriBudget, inlineImageDataUriStats, makeRequest, MODEL_SYSTEM_PROMPT } from './request.js'
import { parseStructuredResponse } from './model-response.js'
import { createDiagnosticsStore } from './diagnostics.js'
import { performance } from 'node:perf_hooks'
import { randomUUID } from 'node:crypto'

export const name = 'llm-codebuddy-cli-cn'
export const inject = ['llm', 'attachments']

const PROVIDER = 'codebuddy-cli-cn'
const STATUS_PATH = '/plugins/dsh-codebuddy-cli-cn/status'
const ACTION_PATH = '/plugins/dsh-codebuddy-cli-cn/actions'
const DIAGNOSTICS_PATH = '/plugins/dsh-codebuddy-cli-cn/diagnostics'
const ACCOUNTS_PATH = '/plugins/dsh-codebuddy-cli-cn/accounts'
const DEFAULT_MODEL = ''
const DEFAULT_EFFORT = ''
const OFFICIAL_HOME = 'https://www.codebuddy.cn'

export const Config = z.object({
  cliPath: z.string().description('CodeBuddy CLI 可执行文件路径；留空时自动检测当前电脑的安装位置。').default('').volatile(),
  configDir: z.string().description('可选：CLI 配置目录，仅改变此目录不能隔离登录；多账号请使用账号管理。').default('').volatile(),
  model: z.string().description('默认模型 ID（可选）；模型目录自动检测，实际使用 DSH 会话中选择的模型。').default(DEFAULT_MODEL).volatile(),
  effort: z.string().description('默认推理强度（可选）；留空时跟随模型默认值，可选项从 CLI 自动检测。').default(DEFAULT_EFFORT).volatile(),
  timeoutMs: z.number().description('单次 CLI 调用超时（毫秒）。').default(180000).volatile()
})

const runtimeStatus = {
  activeCalls: 0,
  cliCheck: { state: 'not-checked' },
  setup: { state: 'idle' },
  totals: { calls: 0, inputTokens: 0, uncachedInputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, outputTokens: 0, toolCalls: 0 },
  lastCall: undefined,
  recentFailures: []
}
const accountUsage = new Map()

function currentValue(value, fallback) {
  if (value !== null && typeof value === 'object' && typeof value.get === 'function') {
    return currentValue(value.get(), fallback)
  }
  return value === undefined || value === null ? fallback : value
}

function configOf(config) {
  return {
    cliPath: String(currentValue(config?.cliPath, '')).trim(),
    configDir: String(currentValue(config?.configDir, '')).trim(),
    model: String(currentValue(config?.model, DEFAULT_MODEL)).trim() || DEFAULT_MODEL,
    effort: String(currentValue(config?.effort, DEFAULT_EFFORT)).trim() || DEFAULT_EFFORT,
    timeoutMs: clampNumber(currentValue(config?.timeoutMs, 180000), 15000, 600000, 180000)
  }
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value)
  return Number.isSafeInteger(n) ? Math.max(min, Math.min(max, n)) : fallback
}

async function checkCli(config, signal) {
  runtimeStatus.cliCheck = { state: 'checking' }
  try {
    runtimeStatus.cliCheck = { state: 'available', ...await inspectCli(config, { signal }) }
  } catch (error) {
    runtimeStatus.cliCheck = { state: 'unavailable', code: safeErrorCode(error), checkedAt: Date.now() }
  }
  return runtimeStatus.cliCheck
}

function safeErrorCode(error) {
  return error instanceof CodeBuddyCliError ? error.code : 'CLI_ERROR'
}

function safeMessage(error) {
  if (error instanceof CodeBuddyCliError) return error.message
  return 'CodeBuddy CLI 调用失败；请检查登录状态与 CLI 配置。'
}

function requestTools(options) {
  const source = options.tools ?? options.toolHistory?.tools ?? []
  return source.filter((tool) => tool && typeof tool.name === 'string' && tool.name.length > 0)
    .map((tool) => ({
      name: tool.name,
      description: typeof tool.description === 'string' ? tool.description : '',
      parameters: tool.parameters && typeof tool.parameters === 'object' && !Array.isArray(tool.parameters)
        ? tool.parameters
        : { type: 'object', properties: {} }
    }))
}

function outputSchema(tools) {
  const names = [...new Set(tools.map((tool) => tool.name))]
  const toolNameSchema = names.length > 0
    ? { type: 'string', enum: names }
    : { type: 'string' }
  return {
    type: 'object',
    description: 'Submit this response using the native StructuredOutput tool only. DSH tool requests are data in toolCalls, not direct native function calls.',
    additionalProperties: false,
    properties: {
      text: { type: 'string' },
      toolCalls: {
        type: 'array',
        description: 'Requests for DSH to execute later. Put the DSH tool name and arguments here; never invoke a DSH tool as a native CLI function.',
        ...(names.length === 0 ? { maxItems: 0 } : {}),
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: toolNameSchema,
            arguments: { type: 'object' }
          },
          required: ['name', 'arguments']
        }
      }
    },
    required: ['text', 'toolCalls']
  }
}

function rememberFailure(call) {
  if (['ABORTED', 'IMAGE_OFFLOAD_REQUIRED'].includes(call.errorCode)) return
  runtimeStatus.recentFailures.unshift({
    id: call.id, at: call.at, model: call.model, errorCode: call.errorCode, errorMessage: call.errorMessage,
    durationMs: call.durationMs, diagnostics: call.diagnostics, responseDiagnostics: call.responseDiagnostics, processDiagnostics: call.processDiagnostics
  })
  runtimeStatus.recentFailures.length = Math.min(runtimeStatus.recentFailures.length, 5)
}

function recordCall({ id, state, config, usage, modelUsage, diagnostics, durationMs, toolCalls = 0, errorCode, errorMessage, processDiagnostics, responseDiagnostics }) {
  const normalized = normalizeCliUsage(usage, modelUsage)
  runtimeStatus.totals.calls += 1
  runtimeStatus.totals.inputTokens += normalized.inputTokens + normalized.cacheReadTokens + normalized.cacheWriteTokens
  runtimeStatus.totals.uncachedInputTokens += normalized.inputTokens
  runtimeStatus.totals.cacheReadTokens += normalized.cacheReadTokens
  runtimeStatus.totals.cacheWriteTokens += normalized.cacheWriteTokens
  runtimeStatus.totals.outputTokens += normalized.outputTokens
  runtimeStatus.totals.toolCalls += toolCalls
  runtimeStatus.lastCall = {
    id,
    state,
    ...(config.accountId ? { accountId: config.accountId } : {}),
    model: config.model,
    at: Date.now(),
    inputTokens: normalized.inputTokens + normalized.cacheReadTokens + normalized.cacheWriteTokens,
    outputTokens: normalized.outputTokens,
    uncachedInputTokens: normalized.inputTokens,
    cacheReadTokens: normalized.cacheReadTokens,
    cacheWriteTokens: normalized.cacheWriteTokens,
    durationMs,
    diagnostics,
    ...(responseDiagnostics ? { responseDiagnostics } : {}),
    ...(processDiagnostics ? { processDiagnostics } : {}),
    usageSource: modelUsage ? 'cli-model-usage' : 'cli-aggregate',
    toolCalls,
    ...(errorCode ? { errorCode, errorMessage, processDiagnostics } : {})
  }
  const key = config.accountId || 'legacy'
  const usageTotals = accountUsage.get(key) || { calls: 0, inputTokens: 0, outputTokens: 0 }
  usageTotals.calls += 1
  usageTotals.inputTokens += normalized.inputTokens + normalized.cacheReadTokens + normalized.cacheWriteTokens
  usageTotals.outputTokens += normalized.outputTokens
  accountUsage.set(key, usageTotals)
  if (errorCode) rememberFailure(runtimeStatus.lastCall)
  return normalized
}

async function publicStatus(config, catalog, logs, accounts) {
  const accountState = await accounts.snapshot()
  for (const account of accountState.accounts) account.usage = accountUsage.get(account.id) || { calls: 0, inputTokens: 0, outputTokens: 0 }
  return {
    provider: PROVIDER,
    model: config.model,
    effort: config.effort,
    pluginVersion: '0.4.2',
    accounts: accountState,
    responseMode: 'native-json-schema',
    timeoutMs: config.timeoutMs,
    activeCalls: runtimeStatus.activeCalls,
    cliCheck: runtimeStatus.cliCheck,
    setup: runtimeStatus.setup,
    logs: logs.status(),
    catalog: catalog.snapshot(config),
    loginCommand: accountState.storageError ? '' : config.accountId ? accountState.accounts.find(x => x.id === config.accountId)?.loginCommand || '' : loginCommand(config, runtimeStatus.cliCheck.path),
    installationGuide: 'https://www.codebuddy.cn/docs/cli/installation',
    usage: {
      ...runtimeStatus.totals,
      lastCall: runtimeStatus.lastCall ?? null,
      recentFailures: runtimeStatus.recentFailures
    },
    balance: {
      available: false,
      officialHome: OFFICIAL_HOME
    }
  }
}

function jsonResponse(res, status, value) {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body)
  })
  res.end(body)
}

function registerStatusRoute(ctx, getConfig, catalog, signal, logs, accounts) {
  let setupPromise
  const selected = () => accounts.selected(configOf(getConfig()))
  const status = async () => {
    let config
    try { config = await selected() } catch { config = configOf(getConfig()) }
    return publicStatus(config, catalog, logs, accounts)
  }
  const releaseStatus = ctx.webServer.register({
    kind: 'exact', path: STATUS_PATH,
    handler: async (req, res) => {
      if (req.method !== 'GET') return jsonResponse(res, 405, { error: 'method-not-allowed' })
      if (!trustedLocalRequest(req)) return jsonResponse(res, 403, { error: 'request-not-trusted' })
      try {
        let config
        try { config = await selected() } catch { config = configOf(getConfig()) }
        const url = new URL(req.url ?? STATUS_PATH, 'http://localhost')
        if (url.searchParams.get('checkCli') === '1'
          && (runtimeStatus.cliCheck.checkedAt === undefined || Date.now() - runtimeStatus.cliCheck.checkedAt > 5000)) {
          await checkCli(config, signal)
        }
        await logs.ready
        jsonResponse(res, 200, await publicStatus(config, catalog, logs, accounts))
      } catch { jsonResponse(res, 500, { error: 'status-unavailable' }) }
    }
  })
  const releaseAction = ctx.webServer.register({
    kind: 'exact', path: ACTION_PATH,
    handler: async (req, res) => {
      if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'method-not-allowed' })
      if (!trustedLocalRequest(req, true)) return jsonResponse(res, 403, { error: 'request-not-trusted' })
      let action
      try { action = await readAction(req) } catch { return jsonResponse(res, 400, { error: 'invalid-action' }) }
      let config
      try { config = await selected() } catch (error) { return jsonResponse(res, 409, { error: safeErrorCode(error), message: safeMessage(error) }) }
      if (action === 'refreshModels') {
        await catalog.get(config, { force: true })
      } else if (action === 'setup') {
        if (!setupPromise) {
          setupPromise = ensureCli(config, {
            signal,
            onStage: (state) => { runtimeStatus.setup = { state } }
          }).then((result) => {
            runtimeStatus.cliCheck = { state: 'available', path: result.path, version: result.version, checkedAt: result.checkedAt }
            runtimeStatus.setup = { state: 'ready', ...result }
          }).catch((error) => {
            runtimeStatus.setup = { state: 'error', code: safeErrorCode(error), message: safeMessage(error) }
          }).finally(() => { setupPromise = undefined })
        }
        return jsonResponse(res, 202, await status())
      }
      jsonResponse(res, 200, await status())
    }
  })
  const releaseLogs = ctx.webServer.register({
    kind: 'exact', path: DIAGNOSTICS_PATH,
    handler: async (req, res) => {
      if (!['GET', 'POST'].includes(req.method)) return jsonResponse(res, 405, { error: 'method-not-allowed' })
      if (!trustedLocalRequest(req, req.method === 'POST')) return jsonResponse(res, 403, { error: 'request-not-trusted' })
      if (req.method === 'GET') return jsonResponse(res, 200, await logs.export())
      let action
      try { action = await readAction(req, ['armCapture', 'cancelCapture', 'clearLogs', 'exportLogs', 'exportDetailedLogs']) }
      catch { return jsonResponse(res, 400, { error: 'invalid-action' }) }
      if (action === 'exportLogs' || action === 'exportDetailedLogs') return jsonResponse(res, 200, await logs.export(action === 'exportDetailedLogs'))
      if (action === 'armCapture') logs.arm()
      if (action === 'cancelCapture') logs.disarm()
      if (action === 'clearLogs') await logs.clear()
      return jsonResponse(res, 200, await status())
    }
  })
  const releaseAccounts = ctx.webServer.register({
    kind: 'exact', path: ACCOUNTS_PATH,
    handler: async (req, res) => {
      if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'method-not-allowed' })
      if (!trustedLocalRequest(req, true)) return jsonResponse(res, 403, { error: 'request-not-trusted' })
      let body
      try { body = await readLocalJson(req) } catch { return jsonResponse(res, 400, { error: 'invalid-account-action' }) }
      if (!['add', 'select', 'remove', 'prepareLogin'].includes(body.action)) return jsonResponse(res, 400, { error: 'invalid-account-action' })
      try {
        if (body.action === 'add') await accounts.add(body.label)
        if (body.action === 'select') await accounts.select(body.id)
        if (body.action === 'remove') await accounts.remove(body.id)
        if (body.action === 'prepareLogin') await accounts.prepareLogin(configOf(getConfig()), body.id)
        ctx.emit('llm/adapters-updated')
        return jsonResponse(res, 200, await status())
      } catch (error) { return jsonResponse(res, 409, { error: safeErrorCode(error), message: safeMessage(error) }) }
    }
  })
  ctx.effect(() => () => { releaseAccounts(); releaseLogs(); releaseAction(); releaseStatus() }, 'dsh-codebuddy-cli-cn: local routes')
}

class CodeBuddyCliAdapter extends LlmAdapter {
  constructor(getConfig, catalog, logs, getAttachments, accounts) {
    super()
    this.getConfig = getConfig
    this.catalog = catalog
    this.logs = logs
    this.getAttachments = getAttachments
    this.accounts = accounts
  }

  providerInfo(provider) {
    return { id: provider, name: 'CodeBuddy CLI（国内版）' }
  }

  async listModels(provider) {
    const config = await this.accounts.selected(configOf(this.getConfig()))
    const catalog = await this.catalog.get(config)
    const models = catalog.models.map((model) => ({ provider, id: model.id, name: modelInfo(provider, model).name, inputModalities: modelInfo(provider, model).inputModalities }))
    if (config.model && !models.some((model) => model.id === config.model)) {
      models.push({ provider, id: config.model, name: config.model, inputModalities: ['text'] })
    }
    return config.accountId ? models.map(model => ({ ...model, id: accountModelId(config.accountId, model.id), name: `[${config.accountLabel}] ${model.name}` })) : models
  }

  async resolveModel(provider, model) {
    const target = await this.accounts.route(configOf(this.getConfig()), model, { required: true })
    const config = target.config
    const catalog = await this.catalog.get(config)
    const found = catalog.models.find((item) => item.id === target.model)
    const info = found ? modelInfo(provider, found, config.effort) : { provider, id: target.model, name: target.model, inputModalities: ['text'] }
    return config.accountId ? { ...info, id: accountModelId(config.accountId, target.model), name: `[${config.accountLabel}] ${info.name}` } : info
  }

  imageRequestTarget(provider, model, image) {
    return imageTarget(image)
  }

  async *stream(options) {
    const callId = randomUUID()
    const routed = await this.accounts.route(configOf(this.getConfig()), options.model, { required: true })
    const config = routed.config
    if (options.signal?.aborted) throw new CodeBuddyCliError('ABORTED', '请求已取消。')
    const tools = requestTools(options)
    const hasNativeImageBlocks = hasImageBlocks(options)
    const textImageDataUri = inlineImageDataUriStats(options.messages)
    const imageRequest = hasNativeImageBlocks || textImageDataUri.inlineImageDataUriCount > 0
    const selectedModel = routed.model || config.model
    const catalog = imageRequest ? await this.catalog.get(config) : this.catalog.snapshot(config)
    void this.catalog.get(config)
    const model = catalog.models.find((item) => item.id === (selectedModel || catalog.currentModelId))
    let effort = options.reasoningEffort || config.effort
    if (model && (!model.supportsReasoning || (model.efforts.length && !model.efforts.some((option) => option.id === effort)))) effort = ''
    const callConfig = { ...config, model: selectedModel || catalog.currentModelId || 'CLI default' }
    const schema = outputSchema(tools)
    const args = [
      '--print',
      '--output-format', 'json',
      '--json-schema', JSON.stringify(schema),
      '--tools', 'StructuredOutput',
      '--setting-sources', config.accountId ? '' : 'user',
      '--strict-mcp-config',
      '--mcp-config', '{"mcpServers":{}}',
      ...(selectedModel ? ['--model', selectedModel] : []),
      ...(effort ? ['--effort', effort] : []),
      '--max-turns', '4',
      '--no-session-persistence',
      '--system-prompt', MODEL_SYSTEM_PROMPT
    ]
    runtimeStatus.activeCalls += 1
    const releaseAccount = this.accounts.begin(config)
    let active = true
    const releaseActive = () => {
      if (!active) return
      active = false
      runtimeStatus.activeCalls = Math.max(0, runtimeStatus.activeCalls - 1)
    }
    let raw
    let callProcessDiagnostics
    let diagnostics
    let normalized = normalizeCliUsage({})
    const startedAt = performance.now()
    let recorded = false
    let toolCount = 0
    try {
      const accountCli = await this.accounts.assertReady(config, undefined, { signal: options.signal })
      const images = hasNativeImageBlocks ? await prepareImages(options, { attachments: this.getAttachments?.(), supportsImages: model?.supportsImages }) : undefined
      const imageDiagnostics = images?.diagnostics ?? {}
      diagnostics = { ...textImageDataUri, ...imageDiagnostics }
      assertInlineImageDataUriBudget(diagnostics)
      const request = makeRequest(images?.options ?? options, tools, schema, textImageDataUri)
      diagnostics = { ...request.diagnostics, ...imageDiagnostics }
      const command = await cliInvocation(accountCli?.path || await resolveCli(config))
      const nativeImages = images?.nativeImages ?? []
      const executionArgs = [...args]
      if (nativeImages.length) {
        executionArgs[executionArgs.indexOf('--output-format') + 1] = 'stream-json'
        executionArgs.push('--input-format', 'stream-json', '--verbose', '--allowedTools', 'StructuredOutput')
      }
      const input = nativeImages.length ? JSON.stringify({ type: 'user', session_id: '', parent_tool_use_id: null,
        message: { role: 'user', content: [{ type: 'text', text: request.prompt }, ...nativeImages] } }) + '\n' : request.prompt
      diagnostics = { ...diagnostics, ...assertCliInputBudget(input) }
      const processResult = await (nativeImages.length ? runImageProcess : runProcess)(command.command, [...command.args, ...executionArgs], {
        env: { ...cliEnv(config), CODEBUDDY_DISABLE_AUTO_MEMORY: '1', CODEBUDDY_CODE_DISABLE_BACKGROUND_TASKS: '1' },
        input,
        timeoutMs: config.timeoutMs,
        signal: options.signal
      })
      callProcessDiagnostics = processResult.processDiagnostics
      raw = collectStructuredResult(processResult.stdout, processResult)
      normalized = normalizeCliUsage(raw.usage, raw.modelUsage)
      const response = parseStructuredResponse(raw.result, tools)
      toolCount = response.calls.length
      recordCall({ id: callId, state: 'success', config: callConfig, usage: raw.usage, modelUsage: raw.modelUsage, diagnostics, durationMs: Math.round(performance.now() - startedAt), toolCalls: toolCount, processDiagnostics: processResult.processDiagnostics, responseDiagnostics: { ...raw.responseDiagnostics, ...response.responseDiagnostics } })
      recorded = true
      await this.logs.record({ ...runtimeStatus.lastCall, effort, timeoutMs: config.timeoutMs, cliVersion: runtimeStatus.cliCheck.version, processDiagnostics: processResult.processDiagnostics, ...(imageRequest ? { imageRequest: true } : {}) })
      // The CLI request is complete even if the consumer pauses or stops
      // pulling delivery blocks without closing the async iterator.
      releaseActive()

      // JSON mode delivers complete blocks. Synthetic deltas would make DSH
      // measure delivery time as model decode time and report impossible speeds.
      let index = 0
      if (response.text.length > 0) {
        yield { type: 'block-start', index, blockType: 'text' }
        yield { type: 'block-end', index, block: { type: 'text', text: response.text } }
        index += 1
      }
      for (const call of response.calls) {
        yield { type: 'block-start', index, blockType: 'tool-call' }
        yield {
          type: 'block-end',
          index,
          block: { type: 'tool-call', id: call.id, name: call.name, arguments: call.arguments }
        }
        index += 1
      }
      yield { type: 'usage', usage: normalized }
      yield { type: 'finish', reason: toolCount > 0 ? { kind: 'tool-calls' } : { kind: 'stop' } }
    } catch (error) {
      if (error instanceof CodeBuddyCliError && error.requestDiagnostics) diagnostics = { ...diagnostics, ...error.requestDiagnostics }
      const errorCode = safeErrorCode(error)
      const failedUsage = raw?.usage ?? error?.usage
      const errorMessage = safeMessage(error)
      const processDiagnostics = error instanceof CodeBuddyCliError ? error.processDiagnostics ?? callProcessDiagnostics : callProcessDiagnostics
      const responseDiagnostics = error instanceof CodeBuddyCliError ? { ...raw?.responseDiagnostics, ...error.responseDiagnostics } : undefined
      const offloadImages = error?.failure?.offloadImages
      if (!recorded && (failedUsage || raw?.modelUsage || error?.modelUsage)) recordCall({ id: callId, state: 'error', config: callConfig, usage: failedUsage, modelUsage: raw?.modelUsage ?? error?.modelUsage, diagnostics, durationMs: Math.round(performance.now() - startedAt), toolCalls: toolCount, errorCode, errorMessage, processDiagnostics, responseDiagnostics })
      else if (!recorded) {
        runtimeStatus.totals.calls += 1
        runtimeStatus.lastCall = { id: callId, state: 'error', model: callConfig.model, ...(config.accountId ? { accountId: config.accountId } : {}), at: Date.now(), errorCode, errorMessage, processDiagnostics, responseDiagnostics, diagnostics, durationMs: Math.round(performance.now() - startedAt) }
        const key = config.accountId || 'legacy', total = accountUsage.get(key) || { calls: 0, inputTokens: 0, outputTokens: 0 }
        total.calls += 1; accountUsage.set(key, total)
        rememberFailure(runtimeStatus.lastCall)
      }
      // Image frames or their echoed Base64 must never enter detailed samples.
      if (!recorded) await this.logs.record({ ...runtimeStatus.lastCall, effort, offloadImages, timeoutMs: config.timeoutMs, cliVersion: runtimeStatus.cliCheck.version, ...(imageRequest ? { imageRequest: true } : {}) }, imageRequest ? undefined : raw?.result ?? error?.rawResult)
      throw new CodeBuddyCliError(errorCode, safeMessage(error), { requestId: callId, offloadImages: error?.failure?.offloadImages })
    } finally {
      releaseAccount()
      releaseActive()
    }
  }
}

export function apply(ctx, config) {
  const getConfig = () => config
  const controller = new AbortController()
  const logs = createDiagnosticsStore()
  const accounts = createAccountStore()
  const catalog = createModelCatalog(async (current) => {
    await accounts.assertReady(current, undefined, { signal: controller.signal })
    const cli = await checkCli(current, controller.signal)
    if (cli.state !== 'available') throw new CodeBuddyCliError(cli.code, '请先完成 CLI 配置，再刷新模型。')
    return queryModelCatalog({ ...current, cliPath: cli.path }, { signal: controller.signal })
  }, {
    onRefresh: () => { if (!controller.signal.aborted) ctx.emit('llm/adapters-updated') }
  })
  const adapter = new CodeBuddyCliAdapter(getConfig, catalog, logs, () => ctx.attachments, accounts)
  const releaseAdapter = ctx.llm.registerAdapter([PROVIDER], adapter)
  ctx.effect(() => () => releaseAdapter(), 'dsh-codebuddy-cli-cn: model adapter')
  ctx.on('settings/document-updated', () => ctx.emit('llm/adapters-updated'))
  ctx.inject(['webServer'], (webCtx) => registerStatusRoute(webCtx, getConfig, catalog, controller.signal, logs, accounts))
  const refresh = async force => { try { await catalog.get(await accounts.selected(configOf(getConfig())), { force }) } catch {} }
  void refresh(false)
  const timer = setInterval(() => { void refresh(true) }, 15 * 60000)
  timer.unref?.()
  ctx.effect(() => () => { clearInterval(timer); controller.abort() }, 'dsh-codebuddy-cli-cn: catalog refresh')
}


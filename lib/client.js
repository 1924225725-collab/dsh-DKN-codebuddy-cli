window.__ModuleLoader__.load({
  id: 'dsh-codebuddy-cli-cn',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    const React = require('react')
    const h = React.createElement
    const NS = 'llm-codebuddy-cli-cn'
    const STATUS_PATH = '/plugins/dsh-codebuddy-cli-cn/status'
    const ACTION_PATH = '/plugins/dsh-codebuddy-cli-cn/actions'
    const DIAGNOSTICS_PATH = '/plugins/dsh-codebuddy-cli-cn/diagnostics'
    const ACCOUNTS_PATH = '/plugins/dsh-codebuddy-cli-cn/accounts'
    const localeZh = {
      title: 'CodeBuddy CLI（国内版）',
      accountsTitle: '多账号管理（预览）', accountNote: '每个账号分别完成官方登录；选择后，请在 DSH 模型选择器中选择带该账号备注的模型。旧会话仍绑定原账号，移除或失效时不会自动换号。',
      accountValidation: '当前仅支持 Windows / 官方 npm 版 CLI 2.174.0。路径隔离和自动测试已验证；真实双账号登录、刷新与扣费归属尚待验收。',
      accountLabel: '账号备注', accountAdd: '新增独立账号', accountUse: '使用此账号', accountSelected: '已选中', accountLegacy: '使用默认 CLI 登录',
      accountPrepare: '生成官方登录命令', accountRemove: '移出列表', accountConfirmRemove: '确认移出（保留本地登录数据）', accountCancel: '取消移出',
      accountHasCredential: '本地凭据存在（身份、有效性及额度未核验）', accountNoCredential: '尚无本地登录凭据', accountPathError: '隔离目录异常，已阻止调用',
      accountUnsupported: '当前系统未验证多账号隔离，请继续使用默认 CLI 登录。', accountStoreError: '账号列表读取失败，已阻止模型调用；请保留本地数据并查看指南。',
      accountAdded: '独立环境已创建。生成登录命令，在新的 PowerShell 窗口运行；选择 Chinese Site 并核对账号，登录后退出 CLI，再刷新模型。',
      accountRemoved: '已移出列表。本地官方登录数据保留，已有会话将明确失败，不会改用其他账号。', accountUsage: '本进程记录：请求 {calls} 次 · 输入 {input} / 输出 {output} Token；不代表官方扣费或余额。',
      accountPrivacy: '插件不导入或复制日常登录凭据。新增、选择账号不会自动发送模型问题；账号之间不自动轮换。登录命令需要手动运行。',
      accountGuide: '查看多账号使用指南', accountGuideSteps: '1. 新增独立环境；2. 生成并在新的 PowerShell 窗口运行登录命令；3. 选择 Chinese Site，核对目标身份，登录后退出；4. 选择条目并刷新模型；5. 在会话中明确选择带账号备注的模型。首次逐个授权，不要复制凭据或把令牌发到反馈中。',
      accountGuideErrors: 'ACCOUNT_LOGIN_REQUIRED：完成该环境的官方登录；ACCOUNT_MODEL_REQUIRED：重新选择带账号的模型；ACCOUNT_CLI_UNVERIFIED：CLI 版本未核查；ACCOUNT_IN_USE：先切换并等待结束。401 请在对应独立环境内 /login。环境备注不代表已核验身份。',
      intro: '使用官方 CodeBuddy CLI，把账号额度用于 DSH 中选择的模型。模型目录和积分倍率自动同步，工具由 DSH 执行。',
      quickSetup: 'CLI 自动配置', setup: '一键配置 CLI', setupBusy: '配置中…',
      setupNote: '先查找本机安装；未安装时下载并运行官方安装器。支持 Windows x64、macOS 和 Linux，无需手填用户名或安装路径。',
      detecting: '正在查找并检查 CLI…', installing: '正在安装官方 CLI，请稍候…',
      setupReady: 'CLI 已配置，版本 {version}。', actionFailed: '操作未完成，请检查网络后重试。',
      installationGuide: '官方安装指南', loginTitle: '首次登录或切换账号', copyLogin: '复制登录命令', copied: '已复制登录命令',
      loginHelp: '在 PowerShell（macOS/Linux 使用终端）中粘贴运行，按官方流程登录国内账号，然后点击“刷新模型与倍率”。若提示 401，请在 CLI 中执行 /login 重新登录。',
      loginMissing: '先完成 CLI 自动配置，再获取登录命令。',
      settings: '高级连接与默认值（可选）', cliPath: 'CLI 路径（留空自动检测）', configDir: '登录配置目录（可选）',
      model: '默认模型 ID（可选）', modelPlaceholder: '留空跟随 CLI 默认，可从下拉候选中选择',
      modelNote: '实际使用 DSH 会话中选择的模型；这里仅作为未指定模型时的默认值，也可填写未列出的模型 ID。',
      effort: '默认推理强度', followDefault: '跟随模型默认值', timeoutMs: '单次调用超时（毫秒）',
      save: '保存设置', saving: '保存中…', saved: '设置已保存', saveFailed: '保存失败，请重试',
      saveFirst: '有未保存的设置，请先保存后再执行检测或配置。',
      inspect: '检查 CLI 程序', inspectBusy: '检查中…', notChecked: '正在等待 CLI 程序检查',
      cliAvailable: 'CLI 程序可启动：{version}', cliUnavailable: 'CLI 程序检查失败（{code}），请点击“一键配置 CLI”或检查路径。',
      cliCheckNote: '此检查仅运行版本命令，不验证账号登录、网络连通性或模型响应。模型目录可刷新也不等于模型调用成功。',
      timeoutHelp: '这是启动 CLI 到整次调用结束的总时限，包含模型处理和 CLI 退出。复杂任务可设为 300000–600000（5–10 分钟）；超时后不会自动重试。',
      runtimeVersion: '插件运行版本：{version} · 当前调用超时：{seconds} 秒',
      timeoutDetail: 'CLI 进程诊断：耗时 {seconds} 秒 · 标准输出 {stdout} 字节 · 诊断输出 {stderr} 字节；这些大小不代表模型生成进度。',
      streamDetail: '图片流结构诊断：原因 {reason} · 阶段 {phase} · 帧 {index}/{total}（{bytes} 字节）· init {init} / result {final} · 最后帧 {last} · 终止发起方 {origin} · 已观察 close {closed} · 截止 {deadline}。',
      nativeDetail: '原生结果事实：structured_output 存在 {present} · 类型 {type} · 终态 type=result {valid} · subtype 类别 {subtype}。',
      noticeDetail: '固定错误类别 {kind} · 命中来源 {source}；未知类别不能确定根因。',
      controlSummary: '控制事件另计：取消 {cancelled} 次 · 图片卸载 {offloads} 次。',
      responseDetail: '结果诊断：{reason} · 返回类型 {type} · {bytes} 字节 · 兼容处理 {normalized}。基础诊断不含正文。',
      parseValid: '结构有效', parsePlainText: '纯文本答复（未执行工具）', parseEmpty: '模型结果为空', parseIncomplete: 'JSON 未闭合，可能截断', parseSyntax: 'JSON 语法不合法', parseAmbiguous: '多个结果，无法确定', parseEnvelope: '根结构不符合协议', parseText: 'text 字段缺失或类型错误', parseCalls: 'toolCalls 不是数组', parseUnknownTool: '工具未声明', parseArguments: '工具参数不合法', noNormalization: '无需处理',
      recentFailures: '最近失败记录（最多 5 条，重启后清空）',
      diagnosticId: '诊断 ID：{id}（可在导出日志中查找）',
      guideTitle: '故障处理与使用指南', guideIntro: '当前使用官方原生 JSON Schema，只开放 StructuredOutput 输出工具，业务工具仍由 DSH 执行。先确认已执行的操作，再处理失败；不要盲目重复写入或运行命令。',
      guideMultipleTitle: '原生结果缺失或多个最终结果', guideMultiple: 'CLI_STRUCTURED_OUTPUT_MISSING 表示 CLI 没有返回原生结果，普通文字不会作为替代。检查 CLI 版本、模型支持和错误日志。native-final-results 表示最终记录不唯一，插件不会选择最后一份。旧版 ambiguous-json 的文字候选提取已退出当前调用路径。',
      guideIncompleteTitle: '返回结构错误或回复过长', guideIncomplete: '原生结果仍可能缺失、截断或不符合字段要求。插件不补全结构、不解析字符串工具参数，也不偷偷回退文字协议。缩短单次回复或拆分任务，保留完整错误和诊断 ID。官方结构化处理可能包含内部多轮，均受总超时限制。',
      guideProgressTitle: '工具做完了，最后仍提示失败', guideProgress: '最终回复失败不代表之前的工具没有执行。先核对工具记录、文件内容和退出码，再决定是否重试；只让模型汇总已有结果时，明确说明不要重复已完成操作。',
      guideLiteralTitle: '路径、代码或反斜杠显示不符', guideLiteral: '正常结束也可能存在模型文字保真问题。要求只重写有差异的一小段代码块，并核对原始字符。插件不会对合法回复统一二次反转义，以免改坏正常代码或工具参数。',
      guideAccessTitle: 'CLI、网络、登录或文件权限', guideAccess: '版本检查只说明程序能启动。CLI_NETWORK_ERROR 表示已识别的连接重置或 TLS 建连失败，请检查到官方服务的网络或代理；不能仅凭任务内容认定 GitHub 等目标网站故障。插件不会自动重试。401 请走官方登录；文件或 ACL 错误先确认 DSH 工作区与路径。',
      guideSizeTitle: '长历史、图片文本过大或额度不足', guideSize: 'CLI_CONTEXT_TOO_LARGE（400）表示官方服务明确拒绝了超上下文请求；插件不会截断或删除 DSH 历史。累计超过 32,768 个字符的标准内联图片 data URI 会在提交模型请求前被 IMAGE_DATA_URI_TOO_LARGE 拦截；请改用 DSH 图片附件，或新建对话并附必要摘要。字符阈值不是 Token 估算。CLI_INSUFFICIENT_BALANCE（402）仅表示 CLI 明确返回余额不足提示，请在官方套餐与用量页核对。',
      guideCliErrorTitle: 'CLI 请求失败但原因未识别', guideCliError: 'CLI_REQUEST_FAILED 表示 CLI 返回错误，但错误文本不足以安全归入已知类别。保留诊断 ID 和普通日志，记录 CLI/插件版本、模型及是否带图片；可用短文本请求判断是否只在图片请求中出现。不要把未知错误直接当作余额或网络问题，也不要重复已执行的 DSH 工具。',
      guideLogsTitle: '如何保留有效反馈', guideLogs: '导出普通日志并记录诊断 ID、时间和复现步骤。需要原文时先开启下一次失败采集，分享前检查内容。成功调用与主动停止任务不消耗采集机会；取消采集、清空日志或重启会关闭开关。',
      guideFull: '查看完整用户指南', guideFullUrl: 'https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/blob/main/docs/使用与故障处理指南.md',
      logsTitle: '诊断日志与问题反馈', logsNote: '普通日志自动保存在本机，最多保留 100 次调用、总计 2 MiB，重启后仍可查看。包含版本、模型、耗时、用量和结构统计；不含请求正文、回复正文、登录凭据或配置路径。不会自动上传。',
      logsStatus: '已保存 {entries} 条 · 失败 {failures} 条 · 详细样本 {samples} 份',
      viewLogs: '查看普通日志', hideLogs: '收起日志', exportLogs: '导出普通日志',
      captureNotice: '为定位格式错误，可手动采集下一次失败的原始模型回复（不采集请求、CLI 标准错误或登录文件）。回复可能包含聊天、代码、文件内容和工具参数，并可能复述敏感信息。最多采集 256 KiB，超出时保留首尾并标明截断。',
      captureConsent: '我了解详细样本可能包含私人内容，会在分享前检查并删除敏感信息。',
      armCapture: '采集下一次失败回复', cancelCapture: '取消详细采集', captureArmed: '已开启：等待下一次非主动取消的失败，随后自动关闭。重启也会关闭；成功调用和主动停止任务不消耗采集机会。无法补录开启前的失败。',
      previewDetailed: '预览详细日志', exportDetailed: '导出详细日志（含原始回复）',
      clearLogs: '清空日志', confirmClear: '确认清空全部日志和详细样本', cancelClear: '取消',
      logsExported: '已生成日志下载，请确认文件已保存；分享前先检查内容。', logsFailed: '日志操作失败，请重试。',
      logsStorageError: '本机日志读写失败（{code}）；当前可见记录仍可导出，但重启后可能丢失。',
      logsHelp: '反馈时附上日志 JSON、报错截图和复现步骤。普通日志不够定位时，再开启一次详细采集并复现。清空会删除本机记录并关闭详细采集，已下载的文件需要自行删除。',
      models: '可用模型与积分倍率', refreshModels: '刷新模型与倍率', refreshing: '正在检测模型…',
      catalogReady: '检测到 {count} 个模型 · 更新于 {time}', catalogEmpty: '尚未获取模型目录，请完成 CLI 配置和登录后刷新。',
      catalogStale: '刷新未成功，暂时显示上次目录。{message}',
      catalogNote: '每 15 分钟自动同步，也可手动刷新；检测不发送模型问题，不消耗模型调用额度。上下文数值来自 CLI 模型目录，不保证等于服务端对单次输入的实际上限；以实际调用返回为准。',
      creditsNote: '倍率来自本次 CLI 返回的官方目录；×0 表示当前目录标记为免费。活动和计费可能调整，实际扣费以官方为准。',
      searchModels: '搜索模型名称或 ID', modelName: '模型 / ID', multiplier: '积分倍率', efforts: '推理强度', context: '上下文', images: '图片输入', imagesYes: '图片', imagesNo: '未声明',
      imagesHelp: '支持用户图片和 DSH 工具返回的标准图片附件，包括桌面、窗口、区域、浏览器截图。两类图片共用 5 张请求预算，每张转换后 ≤2 MiB、最长边 ≤1920；历史超预算由 DSH 记录卸载。工具只返回路径、网址或原始 Base64 时不会自动读图。累计超过 32,768 个字符的标准内联图片 data URI 会在提交模型请求前拦截，建议改用 DSH 图片附件。模型原生图片生成未适配。含图片请求不采集失败原文；图片、Base64 不进入反馈日志。',
      toolCoverage: '查看工具与返回内容适配范围', toolCoverageUrl: 'https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/blob/main/docs/工具适配范围.md',
      unknown: '官方未提供', noEffort: '模型默认', noMatches: '没有匹配的模型。',
      usage: '本次运行的累计 Token 用量', usageNote: '累计输入包含未缓存、缓存命中和缓存写入，每项只计一次；不是单条提问的字数，也不代表积分扣费。重启后清零。',
      usageTotals: '累计请求 {calls} 次 · 累计输入（含缓存）{input} · 累计输出 {output} Token',
      usageBreakdown: '输入明细：未缓存 {uncached} · 缓存命中 {read} · 缓存写入 {write} Token',
      requestSize: '最近请求：{messages} 条历史消息 · {tools} 个工具；封装文本 {total} 字节（系统 {system} / 历史 {history} / 工具 {schemas}）。字节数不是 Token 数，不含 CLI 内部开销。',
      sizeUnknown: '未记录', budgetEnvelope: '文字请求封装', budgetInput: 'CLI 编码输入',
      budgetDetail: '本地大小检查：{stage} · {actual} / {limit} 字节；本次在模型调用前拒绝。',
      requestSizeExtra: '其余尺寸：响应 Schema {schema} / 封装开销 {overhead} / CLI 编码输入 {input} 字节。图片 JSONL 的再次转义及图片块计入 CLI 编码输入，不计入封装文本。',
      guideLocalSizeTitle: '本地请求大小上限', guideLocalSize: 'REQUEST_TOO_LARGE 表示本次请求在启动模型调用前被本地大小检查拒绝：文字请求封装上限 12 MiB，最终 CLI 输入上限 20 MiB，均按 UTF-8 字节计算，不是 Token 数。图片卸载只移除图片内容，不压缩文字历史；JSONL 转义还会增加最终输入大小。配置页和普通日志可查看检查阶段与尺寸分解；旧日志缺失的尺寸无法补算。请保留原对话，在新对话中提供必要摘要或减少本轮需要的工具范围；插件不自动删历史、丢图、截断工具定义或重试。',
      requestTime: '最近调用总耗时 {seconds} 秒。当前为完整 JSON 返回，不提供模型生成速度。',
      noUsage: '尚未通过 DSH 发起模型请求。插件不会自动发送测试问题。',
      lastCall: '最近一次：{model} · {time} · 单次输入（含缓存）{input} / 输出 {output} Token',
      lastFailed: '最近一次请求失败：{code}', active: '当前正在处理 {count} 个请求',
      balance: '积分余额', balanceNote: '剩余积分请在 CodeBuddy 官网“个人主页 → 套餐与用量”查看。模型倍率和本页 Token 统计不代表剩余额度。',
      openHome: '打开 CodeBuddy 官网查看用量',
      toolNote: '模型目录以当前国内 CLI 返回结果为准，账号权限由官方判断。当前插件传递文本对话，DSH 负责执行工具。'
    }
    const localeEn = {
      title: 'CodeBuddy CLI (China)',
      accountsTitle: 'Multiple accounts (preview)', accountNote: 'Sign in separately through the official CLI. Then select a model labelled with the account in DSH. Existing labelled models remain bound to their original account; missing or expired accounts never fall back to another.',
      accountValidation: 'Windows / official npm CLI 2.174.0 only. Directory isolation and automated checks passed; real two-account sign-in, refresh and billing attribution still need acceptance testing.',
      accountLabel: 'Account label', accountAdd: 'Add isolated account', accountUse: 'Use this account', accountSelected: 'Selected', accountLegacy: 'Use default CLI sign-in',
      accountPrepare: 'Prepare official sign-in command', accountRemove: 'Remove from list', accountConfirmRemove: 'Confirm removal (keep local sign-in data)', accountCancel: 'Cancel removal',
      accountHasCredential: 'Local credential present (identity, validity and credits unverified)', accountNoCredential: 'No local sign-in credential', accountPathError: 'Invalid isolation directory; requests blocked',
      accountUnsupported: 'Multiple-account isolation is unverified on this platform. Continue using the default CLI sign-in.', accountStoreError: 'Account list could not be read. Requests are blocked; preserve local data and see the guide.',
      accountAdded: 'Isolated environment created. Prepare its sign-in command and run it in a new PowerShell window. Choose Chinese Site, verify the account, exit the CLI after sign-in, then refresh models.',
      accountRemoved: 'Removed from the list. Official local sign-in data is retained. Existing conversations fail explicitly instead of switching accounts.', accountUsage: 'This process: {calls} requests · input {input} / output {output} tokens; not official billing or remaining credits.',
      accountPrivacy: 'The plugin does not import or copy your everyday credentials. Adding or selecting an account does not send model prompts. Accounts do not rotate automatically; run sign-in commands manually.',
      accountGuide: 'Multiple-account guide', accountGuideSteps: '1. Add an environment. 2. Prepare and run its command in a new PowerShell window. 3. Choose Chinese Site, verify the identity, then exit after sign-in. 4. Select the entry and refresh models. 5. Explicitly select its labelled model in the conversation. Authorize accounts separately; never copy credentials or send tokens with feedback.',
      accountGuideErrors: 'ACCOUNT_LOGIN_REQUIRED: sign in in that environment. ACCOUNT_MODEL_REQUIRED: choose a labelled model. ACCOUNT_CLI_UNVERIFIED: unverified CLI version. ACCOUNT_IN_USE: switch and wait. For 401, use official /login in the corresponding environment. Labels do not establish verified identities.',
      intro: 'Use your official CLI credits for models selected in DSH. Models and credit multipliers refresh automatically; DSH executes tools.',
      quickSetup: 'Automatic CLI setup', setup: 'Set up CLI', setupBusy: 'Setting up…',
      setupNote: 'Find an existing installation, or download and run the official installer. Supports Windows x64, macOS and Linux without entering a user-specific path.',
      detecting: 'Finding and checking CLI…', installing: 'Installing the official CLI…',
      setupReady: 'CLI configured, version {version}.', actionFailed: 'The action failed. Check your network and retry.',
      installationGuide: 'Official installation guide', loginTitle: 'Sign in or switch account', copyLogin: 'Copy sign-in command', copied: 'Sign-in command copied',
      loginHelp: 'Paste into PowerShell (Terminal on macOS/Linux), complete official China-region sign-in, then refresh models. For a 401 error, run /login inside the CLI to sign in again.',
      loginMissing: 'Set up the CLI first to obtain its sign-in command.',
      settings: 'Connection and defaults', cliPath: 'CLI path (blank: auto-detect)', configDir: 'Login configuration directory (optional)',
      model: 'Default model ID (optional)', modelPlaceholder: 'Follow CLI default, or choose a discovered model',
      modelNote: 'The DSH conversation model takes priority. This is a fallback; unlisted model IDs can also be entered.',
      effort: 'Default reasoning effort', followDefault: 'Use model default', timeoutMs: 'Request timeout (ms)',
      save: 'Save settings', saving: 'Saving…', saved: 'Settings saved', saveFailed: 'Could not save settings. Try again.',
      saveFirst: 'Save your pending changes before checking or configuring the CLI.',
      inspect: 'Check CLI executable', inspectBusy: 'Checking…', notChecked: 'Waiting for CLI executable check',
      cliAvailable: 'CLI executable starts: {version}', cliUnavailable: 'CLI executable check failed ({code}). Run setup or check its path.',
      cliCheckNote: 'This runs the version command only. It does not verify sign-in, network connectivity or model responses. Catalog discovery is not a model-call test.',
      timeoutHelp: 'Total deadline from CLI startup to process exit, including model processing. Complex tasks may need 300000–600000 ms (5–10 minutes). Timeouts are not retried automatically.',
      runtimeVersion: 'Running plugin: {version} · Call timeout: {seconds} seconds',
      timeoutDetail: 'CLI process diagnostics: {seconds}s · stdout {stdout} bytes · stderr {stderr} bytes. Byte counts do not measure model generation progress.',
      streamDetail: 'Image stream facts: reason {reason} · phase {phase} · frame {index}/{total} ({bytes} bytes) · init {init} / result {final} · last {last} · termination {origin} · close observed {closed} · deadline {deadline}.',
      nativeDetail: 'Native result facts: structured_output present {present} · type {type} · terminal type=result {valid} · subtype class {subtype}.',
      noticeDetail: 'Fixed notice class {kind} · source {source}; unknown does not establish a root cause.',
      controlSummary: 'Separate control events: cancellations {cancelled} · image offloads {offloads}.',
      responseDetail: 'Result: {reason} · type {type} · {bytes} bytes · normalization {normalized}. Basic diagnostics contain no reply content.',
      parseValid: 'Valid protocol', parsePlainText: 'Plain-text reply (no tools executed)', parseEmpty: 'Empty result', parseIncomplete: 'Unclosed JSON, possibly truncated', parseSyntax: 'Invalid JSON syntax', parseAmbiguous: 'Multiple ambiguous results', parseEnvelope: 'Invalid root structure', parseText: 'Missing or invalid text', parseCalls: 'toolCalls is not an array', parseUnknownTool: 'Undeclared tool', parseArguments: 'Invalid tool arguments', noNormalization: 'None',
      recentFailures: 'Recent failures (up to 5, cleared on restart)',
      diagnosticId: 'Diagnostic ID: {id} (search for this in exported logs)',
      guideTitle: 'Troubleshooting and usage guide', guideIntro: 'Official native JSON Schema is active. Only the StructuredOutput output tool is enabled; DSH still executes business tools. Check completed operations before retrying.',
      guideMultipleTitle: 'Missing native output or multiple final records', guideMultiple: 'CLI_STRUCTURED_OUTPUT_MISSING means no native result was returned; prose is never substituted. Check CLI version, model support and logs. native-final-results means final records are not unique; the adapter never selects the last one. Legacy ambiguous-json text extraction is no longer used by current calls.',
      guideIncompleteTitle: 'Invalid structure or oversized replies', guideIncomplete: 'Native output can still be missing, truncated or invalid. The adapter never invents structure, decodes string tool arguments or silently falls back to the text protocol. Split tasks and retain the error and diagnostic ID. Official structured processing may involve internal turns within the total deadline.',
      guideProgressTitle: 'Tools completed but the final reply failed', guideProgress: 'A failed final reply does not undo earlier tools. Check tool records, file contents and exit codes before retrying. When requesting only a summary of completed work, explicitly ask not to repeat completed operations.',
      guideLiteralTitle: 'Paths, code or backslashes differ', guideLiteral: 'A successful turn may still contain model fidelity errors. Ask for only the affected short code block and compare literal characters. The adapter never unescapes all valid replies twice, which could corrupt code or arguments.',
      guideAccessTitle: 'CLI, network, sign-in or file permissions', guideAccess: 'A version check only proves the executable starts. CLI_NETWORK_ERROR identifies a known connection reset or TLS connection failure: check connectivity or proxy access to the official service. The task mentioning GitHub or another site does not establish that site failed. The adapter never retries automatically. Use official sign-in for 401; verify the DSH workspace/path for file or ACL errors.',
      guideSizeTitle: 'Long history, oversized image text or insufficient credits', guideSize: 'CLI_CONTEXT_TOO_LARGE (400) means the official service explicitly rejected an over-context request; the adapter never truncates or deletes DSH history. A standard inline image data URI exceeding 32,768 characters in total is blocked before the model request with IMAGE_DATA_URI_TOO_LARGE. Reattach through DSH or start a new conversation with a concise summary. This character threshold is not a token estimate. CLI_INSUFFICIENT_BALANCE (402) is used only when the CLI explicitly reports insufficient balance; check the official plan and usage page.',
      guideCliErrorTitle: 'CLI request failed with no recognized cause', guideCliError: 'CLI_REQUEST_FAILED means the CLI returned an error that cannot safely be mapped to a known category. Keep the diagnostic ID and basic logs, and record CLI/plugin versions, model and whether images were attached. A short text request can help determine whether the issue is limited to image requests. Do not assume an unknown error means a balance or network problem, and do not repeat DSH tools that already ran.',
      guideLogsTitle: 'Useful issue reports', guideLogs: 'Export basic logs with the diagnostic ID, time and reproduction steps. Arm failure capture beforehand only when raw replies are needed, and review before sharing. Successes and user-aborted tasks preserve capture; cancelling capture, clearing logs or restarting disables it.',
      guideFull: 'Read the full user guide', guideFullUrl: 'https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/blob/main/docs/USER_GUIDE.en.md',
      logsTitle: 'Diagnostic logs and feedback', logsNote: 'Basic logs stay on this computer across restarts, bounded to 100 calls and 2 MiB. They include versions, models, timing, usage and structural summaries, without request/reply bodies, login credentials or configuration paths. Nothing is uploaded automatically.',
      logsStatus: '{entries} records · {failures} failures · {samples} detailed samples',
      viewLogs: 'View basic logs', hideLogs: 'Hide logs', exportLogs: 'Export basic logs',
      captureNotice: 'For format failures, optionally capture the next failed raw model reply, excluding requests, CLI stderr and login files. Replies can contain chats, code, file contents, tool arguments and repeated sensitive information. Samples are limited to 256 KiB; larger replies retain both ends with a truncation marker.',
      captureConsent: 'I understand detailed samples may contain private content and will review and remove sensitive information before sharing.',
      armCapture: 'Capture next failed reply', cancelCapture: 'Cancel detailed capture', captureArmed: 'Waiting for the next non-user-aborted failure, then capture turns off. Restart also turns it off. Successes and user-aborted tasks preserve capture. Earlier failures cannot be recovered.',
      previewDetailed: 'Preview detailed logs', exportDetailed: 'Export detailed logs (raw replies)',
      clearLogs: 'Clear logs', confirmClear: 'Confirm clearing all logs and samples', cancelClear: 'Cancel',
      logsExported: 'Log download prepared. Check that the file was saved and review it before sharing.', logsFailed: 'Log operation failed. Try again.',
      logsStorageError: 'Local log storage failed ({code}). Available in-memory records can still be exported but may be lost after restart.',
      logsHelp: 'Report issues with the JSON log, error screenshot and reproduction steps. If basic logs are insufficient, enable one-time detailed capture and reproduce. Clearing removes local records and disables capture; downloaded files must be deleted separately.',
      models: 'Available models and credit multipliers', refreshModels: 'Refresh models and rates', refreshing: 'Discovering models…',
      catalogReady: '{count} models · Updated {time}', catalogEmpty: 'No model catalog yet. Set up and sign in to the CLI, then refresh.',
      catalogStale: 'Refresh failed; showing the previous catalog. {message}',
      catalogNote: 'Refreshes every 15 minutes or on demand. Discovery sends no model prompt and does not use model-call credits. Context values come from the CLI catalog and may differ from the service limit for a single request; trust an explicit CLI limit error.',
      creditsNote: 'Rates come from the current official CLI catalog; ×0 means the catalog currently marks it free. Promotions and billing can change; official billing is authoritative.',
      searchModels: 'Search model name or ID', modelName: 'Model / ID', multiplier: 'Credit multiplier', efforts: 'Reasoning efforts', context: 'Context', images: 'Image input', imagesYes: 'Images', imagesNo: 'Not declared',
      imagesHelp: 'User images and standard DSH tool image attachments are supported, including desktop, window, region and browser captures. Both share a 5-image request budget, each converted to ≤2 MiB and longest edge ≤1920; DSH records historical offloading. A path, URL or raw Base64 returned as text is not loaded automatically. Standard inline image data URIs exceeding 32,768 characters in total are blocked before the model request; reattach through DSH. Native model image generation is not adapted. Raw failure samples are disabled for image requests; images and Base64 are excluded from feedback logs.',
      toolCoverage: 'Tool and result compatibility', toolCoverageUrl: 'https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/blob/main/docs/TOOL_COMPATIBILITY.en.md',
      unknown: 'Not provided', noEffort: 'Model default', noMatches: 'No matching models.',
      usage: 'Cumulative token usage this run', usageNote: 'Input includes uncached, cache-read and cache-write tokens, counted once. This is not the latest question length or billed credits. Resets on restart.',
      usageTotals: '{calls} cumulative requests · {input} total input (including cache) · {output} total output tokens',
      usageBreakdown: 'Input breakdown: {uncached} uncached · {read} cache read · {write} cache write tokens',
      requestSize: 'Last request: {messages} messages · {tools} tools; envelope text {total} bytes (system {system} / history {history} / tools {schemas}). Bytes are not tokens; CLI internal overhead is excluded.',
      sizeUnknown: 'Not recorded', budgetEnvelope: 'Text envelope', budgetInput: 'Encoded CLI input',
      budgetDetail: 'Local size check: {stage} · {actual} / {limit} bytes; refused before this model invocation.',
      requestSizeExtra: 'Other sizes: response schema {schema} / envelope overhead {overhead} / encoded CLI input {input} bytes. JSONL escaping and native image blocks count toward CLI input, not envelope text.',
      guideLocalSizeTitle: 'Local request size limits', guideLocalSize: 'REQUEST_TOO_LARGE refuses this request before the model invocation: the text envelope is limited to 12 MiB and final CLI input to 20 MiB, measured in UTF-8 bytes rather than tokens. Image offloading removes image content without compressing text history. JSONL escaping also increases final input size. Settings and basic logs show the check stage and size breakdown; missing sizes in old logs cannot be reconstructed. Keep the original conversation and provide a necessary summary in a new one, or reduce the tools needed for the task. The adapter never automatically deletes history, drops images, truncates tool definitions or retries.',
      requestTime: 'Last call took {seconds} seconds. Complete JSON responses do not expose model decoding speed.',
      noUsage: 'No DSH model request yet. The plugin does not send test prompts automatically.',
      lastCall: 'Last: {model} · {time} · {input} input (including cache) / {output} output tokens for this call',
      lastFailed: 'Last request failed: {code}', active: '{count} request(s) active',
      balance: 'Credits', balanceNote: 'Check remaining credits under “Profile → Plan and Usage” on the CodeBuddy website. Model rates and token counters are not remaining credits.',
      openHome: 'Open CodeBuddy usage page', toolNote: 'Models come from the current China CLI; account permissions are enforced by the official service. This plugin sends text conversations and DSH executes tools.'
    }

    function useFormSnapshot(form) {
      return React.useSyncExternalStore(
        (listener) => typeof form?.subscribe === 'function' ? form.subscribe(listener) : () => {},
        () => typeof form?.getSnapshot === 'function' ? form.getSnapshot() : form?.state,
        () => typeof form?.getSnapshot === 'function' ? form.getSnapshot() : form?.state
      )
    }
    function translate(t, key, values = {}) {
      return t(key).replace(/\{(\w+)\}/gu, (_, name) => String(values[name] ?? ''))
    }
    function formatTime(value) {
      try { return new Date(value).toLocaleString() } catch { return String(value) }
    }
    function isStatus(value) {
      return !!value && typeof value === 'object' && typeof value.activeCalls === 'number'
        && !!value.usage && typeof value.usage.calls === 'number' && !!value.cliCheck && typeof value.cliCheck.state === 'string'
    }
    const sectionStyle = () => ({ border: '1px solid var(--dsw-alias-border-primary, rgba(127,127,127,.25))', borderRadius: 12, padding: 16, display: 'grid', gap: 12 })
    const inputStyle = () => ({ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--dsw-alias-border-primary, rgba(127,127,127,.35))', background: 'var(--dsw-alias-background-primary, transparent)', color: 'inherit' })
    const rowStyle = { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }
    const buttonStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(127,127,127,.4)', background: 'transparent', color: 'inherit', cursor: 'pointer' }
    function Notice({ children }) {
      return h('p', { style: { margin: 0, color: 'var(--dsw-alias-label-secondary, inherit)', lineHeight: 1.5 } }, children)
    }

    function CodeBuddySettingsPage(props) {
      const { t, statusUrl } = props
      const actionUrl = props.actionUrl ?? ACTION_PATH
      const form = props.form ?? props.legacyForm
      const snapshot = useFormSnapshot(form)
      const value = snapshot?.value ?? {}
      const [draft, setDraft] = React.useState(() => ({ ...value }))
      const [dirty, setDirty] = React.useState(false)
      const [busy, setBusy] = React.useState(false)
      const [notice, setNotice] = React.useState('')
      const [status, setStatus] = React.useState()
      const [checking, setChecking] = React.useState(false)
      const [action, setAction] = React.useState('')
      const [search, setSearch] = React.useState('')
      const [logBusy, setLogBusy] = React.useState(false)
      const [logReport, setLogReport] = React.useState(null)
      const [logConsent, setLogConsent] = React.useState(false)
      const [confirmClear, setConfirmClear] = React.useState(false)
      const [accountLabel, setAccountLabel] = React.useState('')
      const [confirmAccountRemoval, setConfirmAccountRemoval] = React.useState('')
      React.useEffect(() => {
        if (!dirty && snapshot?.status === 'ready') setDraft({ ...snapshot.value })
      }, [snapshot?.status, snapshot?.revision, dirty])
      React.useEffect(() => {
        const controller = new AbortController()
        const refresh = () => fetch(statusUrl, { signal: controller.signal, cache: 'no-store' })
          .then((response) => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
          .then((result) => { if (isStatus(result)) setStatus(result) }).catch(() => {})
        refresh()
        const timer = setInterval(refresh, action ? 1500 : 10000)
        return () => { clearInterval(timer); controller.abort() }
      }, [statusUrl, action])
      if (props.view === 'summary') return t('intro')

      const edit = (key, next) => {
        setDirty(true); setNotice(''); setDraft((old) => ({ ...old, [key]: next }))
      }
      const commit = async (patch) => {
        const current = typeof form?.getSnapshot === 'function' ? form.getSnapshot() : snapshot
        if (typeof form?.mutate === 'function') {
          await form.mutate(Object.entries(patch).map(([key, next]) => ({ op: 'set', path: [key], value: next })), current?.revision)
        } else {
          for (const [key, next] of Object.entries(patch)) if (!await form.set(key, next)) throw new Error('rejected')
        }
      }
      const save = async () => {
        if (busy || snapshot?.writable === false) return
        setBusy(true); setNotice('')
        try {
          const changed = Object.fromEntries(['cliPath', 'configDir', 'model', 'effort', 'timeoutMs']
            .filter((key) => draft[key] !== undefined && draft[key] !== value[key]).map((key) => [key, draft[key]]))
          if (Object.keys(changed).length) await commit(changed)
          setDirty(false); setNotice(t('saved'))
        } catch { setNotice(t('saveFailed')) } finally { setBusy(false) }
      }
      const postAction = async (name) => {
        const response = await fetch(actionUrl, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DSH-CodeBuddy-Action': '1' },
          body: JSON.stringify({ action: name }), cache: 'no-store'
        })
        const result = await response.json()
        if (!response.ok || !isStatus(result)) throw new Error('action unavailable')
        setStatus(result)
        return result
      }
      const refreshModels = async () => {
        if (action || dirty) return
        setAction('refreshModels'); setNotice('')
        try {
          const result = await postAction('refreshModels')
          setNotice(result.catalog?.errorMessage || translate(t, 'catalogReady', { count: result.catalog?.models?.length ?? 0, time: formatTime(result.catalog?.fetchedAt) }))
        } catch { setNotice(t('actionFailed')) } finally { setAction('') }
      }
      const setup = async () => {
        if (action || dirty || snapshot?.writable !== true) return
        setAction('setup'); setNotice('')
        try {
          let result = await postAction('setup')
          let attempts = 0
          while (['detecting', 'installing'].includes(result.setup?.state) && attempts++ < 400) {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            const response = await fetch(statusUrl, { cache: 'no-store' })
            result = await response.json()
            if (!response.ok || !isStatus(result)) throw new Error('status unavailable')
            setStatus(result)
          }
          if (result.setup?.state !== 'ready' || !result.setup.path) {
            setNotice(result.setup?.message || t('actionFailed')); return
          }
          try {
            await commit({ cliPath: result.setup.path })
            setDraft((old) => ({ ...old, cliPath: result.setup.path }))
          } catch { setNotice(t('saveFailed')); return }
          const refreshed = await postAction('refreshModels')
          setNotice(refreshed.catalog?.errorMessage || translate(t, 'setupReady', { version: result.setup.version }))
        } catch { setNotice(t('actionFailed')) } finally { setAction('') }
      }
      const checkCli = async () => {
        if (checking || action || dirty) return
        setChecking(true)
        try {
          const response = await fetch(`${statusUrl}?checkCli=1`, { cache: 'no-store' })
          const result = await response.json()
          if (!response.ok || !isStatus(result)) throw new Error('status unavailable')
          setStatus(result)
        } catch { setNotice(t('actionFailed')) } finally { setChecking(false) }
      }
      const copyLogin = async () => {
        try { await navigator.clipboard.writeText(status.loginCommand); setNotice(t('copied')) }
        catch { setNotice(t('loginHelp')) }
      }
      const accountAction = async (name, id) => {
        if (action || dirty || snapshot?.writable !== true) return
        setAction('accounts'); setNotice('')
        try {
          const response = await fetch(ACCOUNTS_PATH, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DSH-CodeBuddy-Action': '1' },
            body: JSON.stringify({ action: name, ...(name === 'add' ? { label: accountLabel } : { id }) }), cache: 'no-store'
          })
          const result = await response.json()
          if (!response.ok || !isStatus(result)) { setNotice(typeof result.message === 'string' ? result.message : t('actionFailed')); return }
          setStatus(result); setConfirmAccountRemoval('')
          if (name === 'add') { setAccountLabel(''); setNotice(t('accountAdded')) }
          if (name === 'remove') setNotice(t('accountRemoved'))
          if (name === 'prepareLogin') setNotice(t('accountAdded'))
        } catch { setNotice(t('actionFailed')) } finally { setAction('') }
      }
      const logRequest = async (name) => {
        const response = await fetch(props.diagnosticsUrl ?? DIAGNOSTICS_PATH, name ? {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DSH-CodeBuddy-Action': '1' },
          body: JSON.stringify({ action: name }), cache: 'no-store'
        } : { cache: 'no-store' })
        const result = await response.json()
        if (!response.ok) throw new Error('logs unavailable')
        return result
      }
      const logAction = async (name) => {
        setLogBusy(true); setNotice('')
        try {
          if (name === 'view') setLogReport(await logRequest())
          else if (name === 'preview') setLogReport(await logRequest('exportDetailedLogs'))
          else if (name === 'exportLogs' || name === 'exportDetailedLogs') {
            const report = await logRequest(name)
            const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' }))
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = `dsh-codebuddy-${name === 'exportLogs' ? 'basic' : 'detailed'}-${Date.now()}.json`
            document.body.appendChild(anchor); anchor.click(); anchor.remove()
            setTimeout(() => URL.revokeObjectURL(url), 1000)
            setNotice(t('logsExported'))
          } else {
            const result = await logRequest(name)
            if (!isStatus(result)) throw new Error('invalid status')
            setStatus(result)
            if (name === 'clearLogs') { setLogReport(null); setConfirmClear(false); setLogConsent(false) }
          }
        } catch { setNotice(t('logsFailed')) } finally { setLogBusy(false) }
      }
      const label = (key, control) => h('label', { key, style: { display: 'grid', gap: 6 } }, h('span', null, t(key)), control)
      const textInput = (key, valueType = 'text', extra = {}) => label(key, h('input', {
        type: valueType, value: draft[key] ?? '',
        onChange: (event) => edit(key, valueType === 'number' ? Number(event.target.value) : event.target.value),
        min: valueType === 'number' ? 15000 : undefined, max: valueType === 'number' ? 600000 : undefined,
        step: valueType === 'number' ? 1000 : undefined, spellCheck: false, style: inputStyle(), ...extra
      }))
      const catalog = status?.catalog
      const models = Array.isArray(catalog?.models) ? catalog.models : []
      const selectedModel = models.find((item) => item.id === (draft.model || catalog?.currentModelId))
      const efforts = selectedModel?.efforts ?? []
      const shown = models.filter((item) => `${item.name} ${item.id}`.toLowerCase().includes(search.toLowerCase()))
      const lastCall = status?.usage?.lastCall
      const streamNote = details => translate(t, 'streamDetail', {
        reason: details.streamReason ?? t('unknown'), phase: details.streamPhase ?? t('unknown'), index: details.frameIndex ?? t('unknown'),
        total: details.totalFrames ?? t('unknown'), bytes: details.frameBytes ?? t('unknown'), init: details.initCount ?? t('unknown'),
        final: details.finalResultCount ?? t('unknown'), last: details.lastFrameClass ?? t('unknown'), origin: details.terminationInitiator ?? t('unknown'),
        closed: details.closeObserved ?? t('unknown'), deadline: details.deadlineReached ?? t('unknown')
      })
      const nativeNote = details => translate(t, 'nativeDetail', { present: details.hasStructuredOutput ?? t('unknown'), type: details.structuredOutputType ?? t('unknown'), valid: details.resultTypeValid ?? t('unknown'), subtype: details.finalSubtypeClass ?? t('unknown') })
      const sizeValue = value => Number.isSafeInteger(value) && value >= 0 ? value : t('sizeUnknown')
      const budgetNote = details => ['envelope', 'cli-input'].includes(details?.requestLimitStage) ? translate(t, 'budgetDetail', {
        stage: t(details.requestLimitStage === 'envelope' ? 'budgetEnvelope' : 'budgetInput'), actual: sizeValue(details.requestBytes), limit: sizeValue(details.requestLimitBytes)
      }) : null
      const responseNote = (details) => {
        const reasons = { valid: 'parseValid', 'plain-text-fallback': 'parsePlainText', 'empty-result': 'parseEmpty', 'empty-content': 'parseEmpty', 'possibly-truncated-json': 'parseIncomplete', 'invalid-json': 'parseSyntax', 'ambiguous-json': 'parseAmbiguous', 'invalid-envelope': 'parseEnvelope', 'invalid-text-field': 'parseText', 'invalid-tool-calls-field': 'parseCalls', 'unknown-tool': 'parseUnknownTool', 'invalid-tool-arguments': 'parseArguments', 'invalid-tool-arguments-json': 'parseArguments' }
        return translate(t, 'responseDetail', {
          reason: reasons[details.reason] ? t(reasons[details.reason]) : details.reason,
          type: details.inputType, bytes: details.bytes ?? t('unknown'),
          normalized: details.normalizations?.length ? details.normalizations.join(', ') : t('noNormalization')
        })
      }
      const cliState = status?.cliCheck?.state === 'available'
        ? translate(t, 'cliAvailable', { version: status.cliCheck.version })
        : status?.cliCheck?.state === 'unavailable' ? translate(t, 'cliUnavailable', { code: status.cliCheck.code }) : t('notChecked')
      const readOnly = snapshot?.status !== 'ready' || snapshot?.writable !== true
      const setupState = status?.setup?.state
      const cellStyle = { padding: '10px 8px', borderBottom: '1px solid rgba(127,127,127,.2)', textAlign: 'left', verticalAlign: 'top' }

      return h('div', { style: { display: 'grid', gap: 16, padding: 18, color: 'var(--dsw-alias-label-primary, inherit)' } },
        h('header', { style: { display: 'grid', gap: 6 } }, h('h2', { style: { margin: 0 } }, t('title')), h(Notice, null, t('intro')),
          status?.pluginVersion ? h(Notice, null, translate(t, 'runtimeVersion', { version: status.pluginVersion, seconds: status.timeoutMs / 1000 })) : null),
        h('section', { style: sectionStyle(), 'aria-label': t('quickSetup') },
          h('h3', { style: { margin: 0 } }, t('quickSetup')),
          h('div', { style: rowStyle },
            h('button', { type: 'button', disabled: !!action || dirty || readOnly, onClick: setup, style: { ...buttonStyle, background: '#2563eb', color: '#fff' } }, action === 'setup' ? t('setupBusy') : t('setup')),
            h('button', { type: 'button', disabled: checking || !!action || dirty || snapshot?.status !== 'ready', onClick: checkCli, style: buttonStyle }, checking ? t('inspectBusy') : t('inspect')),
            h('span', { role: 'status' }, setupState === 'installing' ? t('installing') : setupState === 'detecting' ? t('detecting') : cliState)),
          h(Notice, null, t('setupNote')),
          h(Notice, null, t('cliCheckNote')),
          h('a', { href: 'https://www.codebuddy.cn/docs/cli/installation', target: '_blank', rel: 'noreferrer' }, t('installationGuide')),
          h('details', { open: catalog?.errorCode === 'CLI_LOGIN_REQUIRED' || lastCall?.errorCode === 'CLI_AUTH_REQUIRED' || undefined },
            h('summary', { style: { cursor: 'pointer' } }, t('loginTitle')),
            h('div', { style: { display: 'grid', gap: 10, marginTop: 12 } },
              h(Notice, null, status?.loginCommand ? t('loginHelp') : t('loginMissing')),
              status?.loginCommand ? h(React.Fragment, null,
                h('code', { style: { ...inputStyle(), display: 'block', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' } }, status.loginCommand),
                h('button', { type: 'button', onClick: copyLogin, style: buttonStyle }, t('copyLogin'))) : null))),
        notice ? h('div', { role: 'status', 'aria-live': 'polite', style: { padding: '0 4px', lineHeight: 1.5, overflowWrap: 'anywhere' } }, notice) : null,
        status?.accounts ? h('section', { style: sectionStyle(), 'aria-label': t('accountsTitle') },
          h('h3', { style: { margin: 0 } }, t('accountsTitle')),
          h(Notice, null, t('accountNote')), h(Notice, null, t('accountValidation')),
          status.accounts.storageError ? h('p', { role: 'alert' }, t('accountStoreError')) : null,
          !status.accounts.supported ? h(Notice, null, t('accountUnsupported')) : h(React.Fragment, null,
            h('label', null, t('accountLabel'), h('input', { value: accountLabel, maxLength: 40, style: inputStyle(), onChange: event => setAccountLabel(event.target.value), 'aria-label': t('accountLabel') })),
            h('div', { style: rowStyle },
              h('button', { type: 'button', style: buttonStyle, disabled: !!action || dirty || readOnly || !accountLabel.trim() || !!status.accounts.storageError, onClick: () => accountAction('add') }, t('accountAdd')),
              h('button', { type: 'button', style: buttonStyle, disabled: !!action || dirty || readOnly || status.accounts.selectedId === null || !!status.accounts.storageError, onClick: () => accountAction('select', null) }, t('accountLegacy'))),
            ...(status.accounts.accounts || []).map(account => h('div', { key: account.id, style: sectionStyle() },
              h('strong', null, account.label, account.selected ? ` · ${t('accountSelected')}` : ''),
              h(Notice, null, t(account.pathError ? 'accountPathError' : account.credentialsPresent ? 'accountHasCredential' : 'accountNoCredential')),
              h(Notice, null, translate(t, 'accountUsage', { calls: account.usage?.calls || 0, input: account.usage?.inputTokens || 0, output: account.usage?.outputTokens || 0 })),
              h('div', { style: rowStyle },
                h('button', { type: 'button', style: buttonStyle, disabled: !!action || dirty || readOnly || account.selected || account.pathError, onClick: () => accountAction('select', account.id) }, t('accountUse')),
                h('button', { type: 'button', style: buttonStyle, disabled: !!action || dirty || readOnly || account.pathError, onClick: () => accountAction('prepareLogin', account.id) }, t('accountPrepare')),
                h('button', { type: 'button', style: buttonStyle, disabled: !!action || dirty || readOnly || account.selected || account.activeCalls > 0, onClick: () => setConfirmAccountRemoval(account.id) }, t('accountRemove'))),
              account.loginCommand ? h('div', { style: { display: 'grid', gap: 8 } },
                h('code', { style: { overflowWrap: 'anywhere' } }, account.loginCommand),
                h('button', { type: 'button', style: buttonStyle, onClick: async () => { try { await navigator.clipboard.writeText(account.loginCommand); setNotice(t('copied')) } catch { setNotice(t('loginHelp')) } } }, t('copyLogin'))) : null,
              confirmAccountRemoval === account.id ? h('div', { style: rowStyle },
                h('button', { type: 'button', style: buttonStyle, disabled: !!action || readOnly, onClick: () => accountAction('remove', account.id) }, t('accountConfirmRemove')),
                h('button', { type: 'button', style: buttonStyle, onClick: () => setConfirmAccountRemoval('') }, t('accountCancel'))) : null))),
          h(Notice, null, t('accountPrivacy')),
          h('details', null, h('summary', { style: { cursor: 'pointer' } }, t('accountGuide')),
            h(Notice, null, t('accountGuideSteps')), h(Notice, null, t('accountGuideErrors')), h(Notice, null, t('accountRemoved')))) : null,
        h('details', { style: { ...sectionStyle(), display: 'block' }, 'aria-label': t('settings') },
          h('summary', { style: { cursor: 'pointer', fontWeight: 600 } }, t('settings')),
          h('div', { style: { display: 'grid', gap: 12, marginTop: 14 } },
          textInput('cliPath'), textInput('configDir'),
          textInput('model', 'text', { list: 'dsh-codebuddy-models', placeholder: t('modelPlaceholder') }),
          h('datalist', { id: 'dsh-codebuddy-models' }, ...models.map((item) => h('option', { key: item.id, value: item.id }, `${item.name}${item.multiplier !== null ? ` · ×${item.multiplier}` : ''}`))),
          h(Notice, null, t('modelNote')),
          label('effort', h('select', { value: draft.effort ?? '', onChange: (event) => edit('effort', event.target.value), style: inputStyle() },
            h('option', { value: '' }, t('followDefault')),
            ...efforts.map((item) => h('option', { key: item.id, value: item.id }, item.name)),
            draft.effort && !efforts.some((item) => item.id === draft.effort) ? h('option', { value: draft.effort }, draft.effort) : null)),
          textInput('timeoutMs', 'number'),
          h(Notice, null, t('timeoutHelp')),
          h('div', { style: rowStyle }, h('button', { type: 'button', disabled: busy || !!action || !dirty || readOnly, onClick: save, style: buttonStyle }, busy ? t('saving') : t('save'))),
          dirty ? h(Notice, null, t('saveFirst')) : null)),
        h('section', { style: sectionStyle(), 'aria-label': t('models') },
          h('div', { style: { ...rowStyle, justifyContent: 'space-between' } },
            h('h3', { style: { margin: 0 } }, t('models')),
            h('button', { type: 'button', disabled: !!action || dirty || snapshot?.status !== 'ready', onClick: refreshModels, style: buttonStyle }, action === 'refreshModels' || catalog?.state === 'checking' ? t('refreshing') : t('refreshModels'))),
          h(Notice, null, models.length ? translate(t, 'catalogReady', { count: models.length, time: formatTime(catalog.fetchedAt) }) : catalog?.errorMessage || t('catalogEmpty')),
          catalog?.state === 'stale' ? h(Notice, null, translate(t, 'catalogStale', { message: catalog.errorMessage })) : null,
          h(Notice, null, t('catalogNote')),
          h(Notice, null, t('imagesHelp')),
          h('a', { href: t('toolCoverageUrl'), target: '_blank', rel: 'noreferrer' }, t('toolCoverage')),
          models.length ? h(React.Fragment, null,
            h('input', { type: 'search', value: search, onChange: (event) => setSearch(event.target.value), placeholder: t('searchModels'), 'aria-label': t('searchModels'), style: inputStyle() }),
            h('div', { style: { overflowX: 'auto' } }, h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 14 } },
              h('thead', null, h('tr', null, ...['modelName', 'multiplier', 'efforts', 'context', 'images'].map((key) => h('th', { key, scope: 'col', style: { ...cellStyle, whiteSpace: 'nowrap' } }, t(key))))),
              h('tbody', null, ...shown.map((item) => h('tr', { key: item.id },
                h('td', { style: cellStyle }, h('div', { style: { fontWeight: 600 } }, item.name), h('code', { style: { opacity: .75, fontSize: 12, overflowWrap: 'anywhere' } }, item.id)),
                h('td', { style: { ...cellStyle, whiteSpace: 'nowrap' } }, item.multiplier !== null ? `×${item.multiplier}` : item.credits || t('unknown')),
                h('td', { style: cellStyle }, item.efforts?.map((option) => option.id).join(' / ') || t('noEffort')),
                h('td', { style: { ...cellStyle, whiteSpace: 'nowrap' } }, item.contextWindow ? item.contextWindow.toLocaleString() : t('unknown')),
                h('td', { style: cellStyle }, t(item.supportsImages === true ? 'imagesYes' : 'imagesNo')))),
              !shown.length ? h('tr', null, h('td', { colSpan: 5, style: cellStyle }, t('noMatches'))) : null)))) : null,
          h(Notice, null, t('creditsNote'))),
        h('section', { style: sectionStyle(), 'aria-label': t('usage') },
          h('h3', { style: { margin: 0 } }, t('usage')),
          status?.usage ? h(React.Fragment, null,
            h('div', null, translate(t, 'usageTotals', { calls: status.usage.calls, input: status.usage.inputTokens, output: status.usage.outputTokens })),
            status.usage.uncachedInputTokens !== undefined ? h(Notice, null, translate(t, 'usageBreakdown', { uncached: status.usage.uncachedInputTokens, read: status.usage.cacheReadTokens, write: status.usage.cacheWriteTokens })) : null,
            lastCall ? h(Notice, null, lastCall.state === 'error' ? translate(t, 'lastFailed', { code: lastCall.errorCode ?? 'CLI_ERROR' })
              : translate(t, 'lastCall', { model: lastCall.model, time: formatTime(lastCall.at), input: lastCall.inputTokens ?? 0, output: lastCall.outputTokens ?? 0 })) : h(Notice, null, t('noUsage')),
            lastCall?.state === 'error' && lastCall.errorMessage ? h(Notice, null, lastCall.errorMessage) : null,
            lastCall?.id ? h(Notice, null, translate(t, 'diagnosticId', { id: lastCall.id })) : null,
            lastCall?.processDiagnostics ? h(Notice, null, translate(t, 'timeoutDetail', { seconds: (lastCall.processDiagnostics.elapsedMs / 1000).toFixed(2), stdout: lastCall.processDiagnostics.stdoutBytes, stderr: lastCall.processDiagnostics.stderrBytes })) : null,
            lastCall?.processDiagnostics?.channel === 'image-jsonl' ? h(Notice, null, streamNote(lastCall.processDiagnostics)) : null,
            lastCall?.responseDiagnostics?.structuredOutputType ? h(Notice, null, nativeNote(lastCall.responseDiagnostics)) : null,
            lastCall?.responseDiagnostics?.noticeClass ? h(Notice, null, translate(t, 'noticeDetail', { kind: lastCall.responseDiagnostics.noticeClass, source: lastCall.responseDiagnostics.noticeSource ?? t('unknown') })) : null,
            lastCall?.responseDiagnostics ? h(Notice, null, responseNote(lastCall.responseDiagnostics)) : null,
            lastCall?.uncachedInputTokens !== undefined ? h(Notice, null, translate(t, 'usageBreakdown', { uncached: lastCall.uncachedInputTokens, read: lastCall.cacheReadTokens, write: lastCall.cacheWriteTokens })) : null,
            lastCall?.diagnostics?.promptBytes !== undefined ? h(Notice, null, translate(t, 'requestSize', { messages: sizeValue(lastCall.diagnostics.messageCount), tools: sizeValue(lastCall.diagnostics.toolCount), total: sizeValue(lastCall.diagnostics.promptBytes), system: sizeValue(lastCall.diagnostics.systemBytes), history: sizeValue(lastCall.diagnostics.messagesBytes), schemas: sizeValue(lastCall.diagnostics.toolsBytes) })) : null,
            lastCall?.diagnostics?.schemaBytes !== undefined ? h(Notice, null, translate(t, 'requestSizeExtra', { schema: sizeValue(lastCall.diagnostics.schemaBytes), overhead: sizeValue(lastCall.diagnostics.envelopeOverheadBytes), input: sizeValue(lastCall.diagnostics.cliInputBytes) })) : null,
            budgetNote(lastCall?.diagnostics) ? h(Notice, null, budgetNote(lastCall.diagnostics)) : null,
            Number.isFinite(lastCall?.durationMs) ? h(Notice, null, translate(t, 'requestTime', { seconds: (lastCall.durationMs / 1000).toFixed(2) })) : null,
            status.activeCalls > 0 ? h(Notice, null, translate(t, 'active', { count: status.activeCalls })) : null) : h(Notice, null, t('noUsage')),
          h(Notice, null, t('usageNote')),
          status?.usage?.recentFailures?.length ? h('details', null,
            h('summary', { style: { cursor: 'pointer' } }, t('recentFailures')),
            ...status.usage.recentFailures.map((failure, index) => h('div', { key: index, style: { display: 'grid', gap: 6, marginTop: 12 } },
              h(Notice, null, `${formatTime(failure.at)} · ${failure.model} · ${failure.errorCode}`),
              h(Notice, null, failure.errorMessage),
              failure.id ? h(Notice, null, translate(t, 'diagnosticId', { id: failure.id })) : null,
              budgetNote(failure.diagnostics) ? h(Notice, null, budgetNote(failure.diagnostics)) : null,
              failure.processDiagnostics?.channel === 'image-jsonl' ? h(Notice, null, streamNote(failure.processDiagnostics)) : null,
              failure.responseDiagnostics?.structuredOutputType ? h(Notice, null, nativeNote(failure.responseDiagnostics)) : null,
              failure.responseDiagnostics ? h(Notice, null, responseNote(failure.responseDiagnostics)) : null))) : null),
        h('details', { style: { ...sectionStyle(), display: 'block' }, 'aria-label': t('guideTitle'), open: lastCall?.state === 'error' || undefined },
          h('summary', { style: { cursor: 'pointer', fontWeight: 600 } }, t('guideTitle')),
          h('div', { style: { display: 'grid', gap: 12, marginTop: 14 } },
            h(Notice, null, t('guideIntro')),
            ...['guideMultiple', 'guideIncomplete', 'guideProgress', 'guideLiteral', 'guideAccess', 'guideLocalSize', 'guideSize', 'guideCliError', 'guideLogs'].map(key => h('div', { key },
              h('h4', { style: { margin: '0 0 6px' } }, t(`${key}Title`)), h(Notice, null, t(key)))),
            h('a', { href: t('guideFullUrl'), target: '_blank', rel: 'noreferrer' }, t('guideFull')))),
        h('section', { style: sectionStyle(), 'aria-label': t('logsTitle') },
          h('h3', { style: { margin: 0 } }, t('logsTitle')), h(Notice, null, t('logsNote')),
          h(Notice, null, translate(t, 'logsStatus', { entries: status?.logs?.entries ?? 0, failures: status?.logs?.failures ?? 0, samples: status?.logs?.samples ?? 0 })),
          status?.logs?.cancellations !== undefined ? h(Notice, null, translate(t, 'controlSummary', { cancelled: status.logs.cancellations, offloads: status.logs.offloads ?? 0 })) : null,
          status?.logs?.storageError ? h('div', { role: 'alert' }, translate(t, 'logsStorageError', { code: status.logs.storageError })) : null,
          h('div', { style: rowStyle },
            h('button', { type: 'button', disabled: logBusy, style: buttonStyle, onClick: () => logReport ? setLogReport(null) : logAction('view') }, logReport ? t('hideLogs') : t('viewLogs')),
            h('button', { type: 'button', disabled: logBusy, style: buttonStyle, onClick: () => logAction('exportLogs') }, t('exportLogs')),
            h('button', { type: 'button', disabled: logBusy, style: buttonStyle, onClick: () => setConfirmClear(true) }, t('clearLogs'))),
          confirmClear ? h('div', { style: rowStyle },
            h('button', { type: 'button', disabled: logBusy, style: buttonStyle, onClick: () => logAction('clearLogs') }, t('confirmClear')),
            h('button', { type: 'button', style: buttonStyle, onClick: () => setConfirmClear(false) }, t('cancelClear'))) : null,
          h(Notice, null, t('captureNotice')),
          h('label', { style: { display: 'flex', gap: 8, alignItems: 'flex-start' } },
            h('input', { type: 'checkbox', checked: logConsent, onChange: event => { setLogConsent(event.target.checked); if (!event.target.checked) setLogReport(null) } }), t('captureConsent')),
          h('div', { style: rowStyle },
            status?.logs?.captureArmed
              ? h('button', { type: 'button', disabled: logBusy, style: buttonStyle, onClick: () => logAction('cancelCapture') }, t('cancelCapture'))
              : h('button', { type: 'button', disabled: logBusy || !logConsent || !status?.logs, style: buttonStyle, onClick: () => logAction('armCapture') }, t('armCapture')),
            h('button', { type: 'button', disabled: logBusy || !logConsent || !status?.logs?.samples, style: buttonStyle, onClick: () => logAction('preview') }, t('previewDetailed')),
            h('button', { type: 'button', disabled: logBusy || !logConsent || !status?.logs?.samples, style: buttonStyle, onClick: () => logAction('exportDetailedLogs') }, t('exportDetailed'))),
          status?.logs?.captureArmed ? h('div', { role: 'status' }, t('captureArmed')) : null,
          logReport ? h('pre', { 'aria-label': t('logsTitle'), style: { ...inputStyle(), maxHeight: 360, overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12 } }, JSON.stringify(logReport, null, 2)) : null,
          h(Notice, null, t('logsHelp'))),
        h('section', { style: sectionStyle(), 'aria-label': t('balance') },
          h('h3', { style: { margin: 0 } }, t('balance')), h(Notice, null, t('balanceNote')),
          h('a', { href: status?.balance?.officialHome ?? 'https://www.codebuddy.cn', target: '_blank', rel: 'noreferrer' }, t('openHome'))),
        h(Notice, null, t('toolNote')))
    }

    const name = 'dsh-codebuddy-cli-cn-client'
    const BUNDLE_NAME = 'dsh-codebuddy-cli-cn'
    const inject = ['slots', 'locale', 'configForms']
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register('settings.codebuddy-cli-cn', { zh: localeZh, en: localeEn }), 'dsh-codebuddy-cli-cn: locales')
      const t = ctx.locale.bind('settings.codebuddy-cli-cn')
      const form = ctx.configForms.get(NS)
      ctx.effect(() => ctx.configForms.whileServed([NS], () => ctx.slots.inject('plugins.row.config', () => ctx.slots.register({
        name: 'plugins.row.config', key: `${BUNDLE_NAME}#${NS}`, locale: 'settings.codebuddy-cli-cn',
        inject: () => ({ legacyForm: form, statusUrl: STATUS_PATH, actionUrl: ACTION_PATH, t })
      }, CodeBuddySettingsPage))), 'dsh-codebuddy-cli-cn: settings page')
    }
    Object.assign(exports, { BUNDLE_NAME, apply, inject, name })
    return module.exports
  }
})

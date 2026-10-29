window.__ModuleLoader__.load({
  id: 'dsh-dkn-codebuddy-cli',
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
      sidebarEntry: "CodeBuddy",
      pageEntryHint: "配置已移至左侧栏的 CodeBuddy 独立页面。",
      openPage: "打开 CodeBuddy 配置",
      pageSections: "配置板块",
      navconnection: "连接配置",
      metricmodels: '目录模型数', metricusage: '本进程调用次数',
      navmodels: "模型目录",
      navaccounts: "账号管理",
      navusage: "用量与额度",
      navdiagnostics: "诊断日志",
      navhelp: "使用指南",

      title: 'dsh-DKN-codebuddy cli（国内版）',
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
      guideFull: '查看完整用户指南', guideFullUrl: 'https://github.com/1924225725-collab/dsh-DKN-codebuddy-cli/blob/main/docs/cn/使用与故障处理指南.md',
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
      toolCoverage: '查看工具与返回内容适配范围', toolCoverageUrl: 'https://github.com/1924225725-collab/dsh-DKN-codebuddy-cli/blob/main/docs/cn/工具适配范围.md',
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
      toolNote: '模型目录以当前国内 CLI 返回结果为准，账号权限由官方判断。插件传递文本和标准图片附件，工具由 DSH 执行。'
    }
    const localeEn = {
      sidebarEntry: "CodeBuddy",
      pageEntryHint: "Settings now have a dedicated CodeBuddy page in the left sidebar.",
      openPage: "Open CodeBuddy settings",
      pageSections: "Settings sections",
      navconnection: "Connection",
      metricmodels: 'Models in catalog', metricusage: 'Calls this process',
      navmodels: "Models",
      navaccounts: "Accounts",
      navusage: "Usage and credits",
      navdiagnostics: "Diagnostics",
      navhelp: "Help",

      title: 'dsh-DKN-codebuddy cli (China)',
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
      guideFull: 'Read the full user guide', guideFullUrl: 'https://github.com/1924225725-collab/dsh-DKN-codebuddy-cli/blob/main/docs/cn/USER_GUIDE.en.md',
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
      toolCoverage: 'Tool and result compatibility', toolCoverageUrl: 'https://github.com/1924225725-collab/dsh-DKN-codebuddy-cli/blob/main/docs/cn/TOOL_COMPATIBILITY.en.md',
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
      openHome: 'Open CodeBuddy usage page', toolNote: 'Models come from the current China CLI; account permissions are enforced by the official service. This plugin sends text and standard image attachments; DSH executes tools.'
    }

    const intlLocaleZh = {
      title: 'dsh-DKN-codebuddy cli（国际版）',
      intro: '通过官方 CodeBuddy CLI 原生 JSON Schema 输出接入国际版模型。模型目录和积分倍率自动同步；DSH 继续管理对话与工具执行。',
      quickSetup: 'CLI 自动配置', setup: '一键配置 CLI', setupBusy: '配置中…',
      setupNote: '先查找本机安装；未安装时下载并运行官方安装器。支持 Windows x64、macOS 和 Linux，无需手填用户名或安装路径。',
      detecting: '正在查找并检查 CLI…', installing: '正在安装官方 CLI，请稍候…',
      setupReady: 'CLI 已配置，版本 {version}。', actionFailed: '操作未完成，请检查网络后重试。',
      installationGuide: '官方安装指南', loginTitle: '首次登录或切换账号', copyLogin: '复制登录命令', copied: '已复制登录命令',
      loginHelp: '在 PowerShell（macOS/Linux 使用终端）中粘贴运行，输入 /login，选择 International Site 并完成登录，然后点击“刷新模型与倍率”。若提示 401，请重新执行官方登录流程。',
      loginMissing: '先完成 CLI 自动配置，再获取登录命令。',
      accountsTitle: '独立账号环境', accountNote: '每个环境使用单独的配置目录和 Windows 用户目录。切换环境后请在 DSH 模型列表中选择带备注的模型；已有会话仍固定使用原账号。不会自动轮换或在失败后切回其他账号。',
      accountValidation: '多账号范围：Windows、官方 npm/Node CLI 2.174.0。实际双账号登录、刷新与官方扣费归属尚未实测。',
      accountLabel: '环境备注', accountAdd: '新增环境', accountUse: '设为当前环境', accountLegacy: '使用默认单账号', accountPrepare: '生成官方登录命令', accountRemove: '从列表移除',
      accountSelected: '当前环境', accountHasCredential: '检测到本环境有登录文件；未读取其内容。', accountNoCredential: '尚未检测到本环境的登录文件。', accountPathError: '隔离目录异常，已阻止请求。',
      accountUnsupported: '当前系统尚未验证多账号隔离；默认单账号仍可使用。', accountStoreError: '账号列表不可读或损坏；请求已阻止，请保留本机数据并查看指南。',
      accountAdded: '环境已建立。请生成命令，在新的 PowerShell 窗口运行，并选择 International Site 完成官方登录。',
      accountPrepared: '已生成该隔离环境的官方登录命令。请在新的 PowerShell 窗口运行，并选择 International Site。',
      accountRemoved: '已从列表移除；官方登录文件会保留。不会退出登录或清除凭据。旧会话不会改用其他账号。',
      accountUsage: '本地统计：{calls} 次请求 · 输入 {input} / 输出 {output} tokens · 取消 {cancelled} 次 · DSH 卸载请求 {offloads} 次（建议卸载 {images} 张） · 历史已卸载图片 {history} 张；卸载请求不代表 DSH 已执行。',
      accountPrivacy: '插件不会导入或复制日常使用的登录凭据。添加和切换环境不发送模型问题；账号不会自动轮换。请分别通过官方流程登录。',
      accountGuide: '多账号使用说明', accountGuideSteps: '1. 新增隔离环境并填写本地备注。2. 生成命令并在新 PowerShell 窗口运行。3. 选择 International Site，核对登录身份后退出 CLI。4. 在设置页选择环境并刷新模型。5. 在 DSH 会话中选带该环境备注的模型。',
      accountGuideErrors: '登录文件缺失时请在对应环境重新运行官方登录命令。旧模型 ID 不会自动沿用当前账号。401、网络或额度错误不会触发账号轮换；移出列表也不会注销或删除官方登录文件。',
      accountGuideLink: '打开完整的多账号指南', accountGuideUrl: 'https://github.com/1924225725-collab/dsh-DKN-codebuddy-cli/blob/main/docs/intl/多账号使用指南.md',
      accountConfirmRemove: '确认移出列表', accountCancel: '取消', accountStoreScope: '备注仅用于本机区分环境，不代表已核验的官方账号身份。',
      settings: '高级连接与默认值（可选）', cliPath: 'CLI 路径（留空自动检测）', configDir: '配置目录（留空使用 ~/.dsh-codebuddy-cli-intl）',
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
      streamDetail: '流诊断：{reason} · 阶段 {phase} · 解析 {stage} · 帧 {index}/{count}（{bytes} 字节）· init/result {inits}/{results} · 最近帧 {frame} · 终止 {terminator} · close 已观察 {closed} · 到达时限 {deadline}。',
      responseDetail: '结果诊断：{mode} · {reason} · 最终记录 {finals} 条 · 返回类型 {type} · 兼容处理 {normalized}。{facts} {notice}基础诊断不含正文。',
      nativeOutput: '原生 JSON Schema', parseValid: '结构有效', parsePlainText: '纯文本答复（未执行工具）', parseEmpty: '模型结果为空', parseIncomplete: 'JSON 未闭合，可能被截断', parseSyntax: 'CLI 输出不是有效 JSON', parseAmbiguous: '多个协议片段存在歧义', parseFinalCount: '最终结果记录不是唯一一条', parseEnvelope: '根结构不符合协议', parseText: 'text 字段缺失或类型错误', parseCalls: 'toolCalls 结构错误', parseUnknownTool: '工具未声明', parseArguments: '工具参数必须是对象', parseOutputMissing: '缺少 structured_output', noNormalization: '无需处理',
      parseNativeResult: '收到原生最终结果', parseNotice: 'CLI 错误提示', parseOutputInvalid: 'CLI 输出无有效结果', parseDeadline: '调用到达总时限', parseStreamError: 'CLI 返回错误帧', parsePermissionFrame: 'CLI 请求交互权限', parseResultBeforeInit: '最终结果早于初始化帧', parsePostResult: '最终结果后出现额外帧',
      structuredFacts: 'structured_output：{present}（{type}）；result 类型{resultType}；终态 subtype：{subtype}。', noticeDetail: '提示分类：{classification} · 来源：{source}。',
      streamReasonNone: '无流错误', streamReasonJson: 'JSON 解析失败', streamReasonShape: '帧结构无效', streamReasonDuplicateInit: '重复初始化帧', streamReasonPostResult: '最终结果后序列冲突', streamReasonResultBeforeInit: '结果早于初始化', streamReasonMultiple: '出现多个最终结果', streamReasonError: '收到错误帧', streamReasonPermission: '收到权限控制帧', streamReasonMissingInit: '关闭前缺少初始化帧', streamReasonMissingResult: '关闭前缺少最终结果', streamReasonExit: 'CLI 非零退出', streamReasonDeadline: '达到总时限', streamReasonCancelled: '请求被取消', streamReasonTooLarge: '输出超出上限', streamReasonSpawn: 'CLI 启动失败',
      streamPhaseAwait: '等待初始化', streamPhaseInit: '已初始化', streamPhaseResult: '已收到最终结果', streamPhaseDrain: '终态排空', streamPhaseClosed: '进程已关闭', parseStageLine: '换行帧', parseStageTail: '无换行尾帧', parseStageNone: '无',
      frameNone: '无', frameInit: '初始化', frameSystem: '系统帧', frameAssistant: 'assistant 帧', frameResult: 'result 帧', frameError: 'error 帧', frameControl: '权限控制帧', frameOther: '其他帧', frameMalformed: '无法解析帧',
      terminatorNone: '尚未终止', terminatorAdapter: '解析器主动停止', terminatorDrain: '终态排空停止', terminatorDeadline: '总时限停止', terminatorCancel: '外部取消', terminatorChildError: '子进程错误', terminatorClose: '自然关闭', terminatorSpawn: '启动失败',
      noticeNone: '无匹配提示', noticeUnknown: '未分类提示', noticeContext: '上下文限制', noticeBalance: '余额不足', noticeAuth: '鉴权', noticeAccess: '服务拒绝访问', noticeRate: '频率限制', noticeLocalPermission: '本地权限', noticeNetwork: '网络连接', noticeSourceStderr: '标准错误', noticeSourceStdout: '标准输出', noticeSourceAssistant: 'assistant 文本帧', noticeSourceError: 'error 帧', noticeSourceResult: 'result 帧', noticeSourceMixed: '多个输出通道',
      factReported: '已返回', factMissing: '缺失', factObject: '对象', factArray: '数组', factString: '字符串', factNumber: '数字', factBoolean: '布尔值', factNull: 'null', factUndefined: 'undefined', factYes: '有效', factNo: '无效', subtypeSuccess: '成功', subtypeError: '错误', subtypeOther: '其他', subtypeMissing: '未提供',
      recentFailures: '最近失败记录（最多 5 条，重启后清空）',
      diagnosticId: '诊断 ID：{id}（可在导出日志中查找）',
      guideTitle: '故障处理与使用指南', guideIntro: '格式错误不一定能自动恢复。先确认已执行的操作，再按对应情况处理；不要盲目重复写入或运行命令。',
      guideMultipleTitle: '最终结果记录不唯一', guideMultiple: '原生输出模式要求 CLI 只返回一条最终结果记录；缺少或出现多条记录（即使内容看起来相同）都会失败。插件不会挑选最后一条、合并结果或执行部分工具。先查看 DSH 已完成的工具和文件状态，再发起简短的新请求。',
      guideIncompleteTitle: 'CLI 没有返回有效结构结果', guideIncomplete: '插件只接受官方 structured_output 中的 JSON 对象，不会从普通文本提取协议字段、补齐缺失内容或自动请求模型修复。缩小任务并重试前，先核对已完成的工具操作。',
      guideProgressTitle: '工具做完了，最后仍提示失败', guideProgress: '最终回复失败不代表之前的工具没有执行。先核对工具记录、文件内容和退出码，再决定是否重试；只让模型汇总已有结果时，明确说明不要重复已完成操作。',
      guideLiteralTitle: '路径、代码或反斜杠显示不符', guideLiteral: '插件按原样传递结构结果中的 text，不会再解析或反转义其中的内容。若文字本身有差异，只要求重写相关的小片段并逐字符核对。',
      guideAccessTitle: 'CLI、登录、超时或文件权限', guideAccess: '版本检查只说明程序能启动。401 请走官方登录；模型权限或额度由官方判断。超时可拆分任务并按需增加时限。文件或 ACL 错误先确认 DSH 工作区与路径，不要为修复格式错误更改权限。',
      guideRequestSizeTitle: '本机请求尺寸上限', guideRequestSize: 'REQUEST_TOO_LARGE 表示本机大小检查拒绝了本轮请求：国际版文字请求封装上限为 12 MiB，图片模式最终 stream-json CLI 输入上限为 24 MiB，均按 UTF-8 字节计算，不是 Token 数。图片卸载不会压缩文字历史，JSONL 编码和图片块会计入最终图片输入。配置页和普通日志会显示已测得的阶段、实际字节、上限及尺寸分解；旧日志没有保存的尺寸无法补算。插件不会自动删除历史、丢弃图片、截断 Schema、切换模型或重试。',
      guideLimitsTitle: '上下文上限或余额错误（400 / 402）', guideLimits: '400 表示服务明确报告输入超过上下文上限，缩短历史或新建会话后再试；402 表示官方服务报告余额不足，请查看官方用量页面。插件不会自动换模型、换账号或重试。',
      guideNetworkTitle: 'CLI_NETWORK_ERROR：连接中断或 TLS 错误', guideNetwork: '该分类表示官方 CLI 报告连接被重置或 TLS 握手未完成。请检查当前网络到官方国际服务的连通性及代理设置。插件只识别错误文本，不能修复网络或确认具体原因，也不会自动重试；核对已完成的 DSH 操作后，再自行决定是否重试。',
      guideLogsTitle: '如何保留有效反馈', guideLogs: '导出普通日志并记录诊断 ID、时间和复现步骤。需要原文时先开启下一次失败采集，分享前检查内容。成功调用与主动停止任务不消耗采集机会；取消采集、清空日志或重启会关闭开关。',
      guideFull: '查看完整用户指南', guideFullUrl: 'https://github.com/1924225725-collab/dsh-DKN-codebuddy-cli/blob/main/docs/intl/使用与故障处理指南.md',
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
      catalogNote: '每 15 分钟自动同步，也可手动刷新；检测不发送模型问题，不消耗模型调用额度。',
      imageInput: '图片输入', imagesSupported: '官方目录声明支持', imagesUnknown: '目录未声明',
      imageNote: '仅对官方动态模型目录明确标记 supportsImages 的模型开放图片。插件通过 DSH 附件服务读取图片，并以官方 CLI 的原生 stream-json 图片块发送；模型未声明支持时会明确报错，不会静默丢图。每次请求历史最多 5 张、单张最大 2 MiB、总图片 Base64 最大 8 MiB，最长边按需缩至 1920 像素。历史中的内联图片 data URI 总长超过 32,768 字符时会在发起模型请求前拒绝；图片内容不会写入诊断日志。',
      creditsNote: '倍率来自本次 CLI 返回的官方目录；×0 表示当前目录标记为免费。活动和计费可能调整，实际扣费以官方为准。',
      searchModels: '搜索模型名称或 ID', modelName: '模型 / ID', multiplier: '积分倍率', efforts: '推理强度', context: '上下文',
      unknown: '官方未提供', noEffort: '模型默认', noMatches: '没有匹配的模型。',
      usage: '本次运行的累计 Token 用量', usageNote: '累计输入包含未缓存、缓存命中和缓存写入，每项只计一次；不是单条提问的字数，也不代表积分扣费。适配器每次启动一个 CLI 进程，但 CLI 内部结构化处理可能包含多轮，实际用量以官方明细为准。重启后清零。',
      usageTotals: '累计请求 {calls} 次 · 累计输入（含缓存）{input} · 累计输出 {output} Token',
      outcomeTotals: '本地事件统计（重启后清零）：取消 {cancelled} 次 · DSH 图片卸载请求 {offloads} 次（建议卸载 {images} 张） · 请求历史中已卸载图片 {history} 张。卸载请求不代表 DSH 已执行。',
      usageBreakdown: '输入明细：未缓存 {uncached} · 缓存命中 {read} · 缓存写入 {write} Token',
      requestSize: '最近请求封装：{messages} 条历史消息 · {tools} 个工具；提示封装 {total} UTF-8 字节（系统 {system} / 历史 {history} / 工具 {schemas}）。这表示本机组装的请求大小，不等于 Token 数或已发送内容。',
      sizeUnknown: '未记录', budgetEnvelope: '文字封装', budgetInput: 'CLI 编码输入',
      budgetDetail: '本机大小检查：{stage} · {actual} / {limit} 字节；请求在启动 CLI 模型调用前被拒绝，未提交给模型。',
      requestSizeExtra: '其他尺寸：响应 Schema {schema} / 封装固定指令与结构 {overhead} / 计算后的 CLI 输入 {input} 字节。图片模式包含最终 JSONL 编码和原生图片块；本机拒绝时该值不是已发送证明。',
      requestTime: '最近调用总耗时 {seconds} 秒。当前为完整 JSON 返回，不提供模型生成速度。',
      noUsage: '尚未通过 DSH 发起模型请求。插件不会自动发送测试问题。',
      lastCall: '最近一次：{model} · {time} · 单次输入（含缓存）{input} / 输出 {output} Token',
      lastFailed: '最近一次请求失败：{code}', active: '当前正在处理 {count} 个请求',
      balance: '积分余额', balanceNote: '剩余积分请在 CodeBuddy 官网“个人主页 → 套餐与用量”查看。模型倍率和本页 Token 统计不代表剩余额度。',
      openHome: '打开 CodeBuddy 官网查看用量',
      toolNote: '模型目录和图片能力以当前国际 CLI 返回结果为准，账号权限由官方判断。图片请求经 CLI 原生图片输入；CLI 业务工具仍关闭，DSH 负责执行工具。'
    }
    const intlLocaleEn = {
      title: 'dsh-DKN-codebuddy cli (International)',
      intro: 'Connect international models through the official CodeBuddy CLI native JSON Schema output. Models and credit multipliers refresh automatically; DSH manages conversations and tool execution.',
      quickSetup: 'Automatic CLI setup', setup: 'Set up CLI', setupBusy: 'Setting up…',
      setupNote: 'Find an existing installation, or download and run the official installer. Supports Windows x64, macOS and Linux without entering a user-specific path.',
      detecting: 'Finding and checking CLI…', installing: 'Installing the official CLI…',
      setupReady: 'CLI configured, version {version}.', actionFailed: 'The action failed. Check your network and retry.',
      installationGuide: 'Official installation guide', loginTitle: 'Sign in or switch account', copyLogin: 'Copy sign-in command', copied: 'Sign-in command copied',
      loginHelp: 'Paste into PowerShell (Terminal on macOS/Linux), run /login, choose International Site and complete sign-in, then refresh models. Repeat official sign-in for a 401 error.',
      loginMissing: 'Set up the CLI first to obtain its sign-in command.',
      accountsTitle: 'Isolated account environments', accountNote: 'Each environment has its own CLI configuration and Windows user directories. After switching, choose a model labelled with that environment in DSH; existing conversations remain bound to their original account. There is no automatic rotation or fallback.',
      accountValidation: 'Scope: Windows with the official npm/Node CLI 2.174.0. Real dual-account sign-in, refresh and official billing attribution have not been tested.',
      accountLabel: 'Local label', accountAdd: 'Add environment', accountUse: 'Use this environment', accountLegacy: 'Use default single account', accountPrepare: 'Prepare official sign-in command', accountRemove: 'Remove from list',
      accountSelected: 'Current environment', accountHasCredential: 'A sign-in file is present in this environment; its contents were not read.', accountNoCredential: 'No sign-in file detected in this environment.', accountPathError: 'Invalid isolation directory; requests are blocked.',
      accountUnsupported: 'Multiple-account isolation is not verified on this system. The default single-account mode remains available.', accountStoreError: 'The account list is unreadable or corrupt. Requests are blocked; preserve local data and see the guide.',
      accountAdded: 'Environment created. Prepare its command, run it in a new PowerShell window, and choose International Site for official sign-in.',
      accountPrepared: 'The official sign-in command is ready for this isolated environment. Run it in a new PowerShell window and choose International Site.',
      accountRemoved: 'Removed from the list; official sign-in files are retained. This does not sign out or clear credentials. Existing conversations will not switch accounts.',
      accountUsage: 'Local counters: {calls} requests · input {input} / output {output} tokens · {cancelled} cancellations · {offloads} DSH image-offload requests ({images} images requested) · {history} already-offloaded images in history. A request does not confirm DSH completed it.',
      accountPrivacy: 'The plugin does not import or copy your everyday sign-in credentials. Adding or selecting an environment sends no model prompt. Accounts never rotate automatically; sign in separately through the official flow.',
      accountGuide: 'Multiple-account guide', accountGuideSteps: '1. Add an isolated environment and a local label. 2. Prepare its command and run it in a new PowerShell window. 3. Choose International Site, verify the identity, then exit the CLI. 4. Select the environment and refresh models. 5. Choose its labelled model in a DSH conversation.',
      accountGuideErrors: 'If sign-in is missing, rerun the official command for that environment. Old model IDs never inherit the current account. A 401, network or credit error never rotates accounts; removing an entry does not sign out or delete official sign-in files.',
      accountGuideLink: 'Open the full account guide', accountGuideUrl: 'https://github.com/1924225725-collab/dsh-DKN-codebuddy-cli/blob/main/docs/intl/ACCOUNT_GUIDE.en.md',
      accountConfirmRemove: 'Confirm removal from list', accountCancel: 'Cancel', accountStoreScope: 'Labels are local hints and do not verify the official account identity.',
      settings: 'Connection and defaults', cliPath: 'CLI path (blank: auto-detect)', configDir: 'Configuration directory (default: ~/.dsh-codebuddy-cli-intl)',
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
      streamDetail: 'Stream diagnostics: {reason} · phase {phase} · parse {stage} · frame {index}/{count} ({bytes} bytes) · init/results {inits}/{results} · last frame {frame} · termination {terminator} · close observed {closed} · deadline reached {deadline}.',
      responseDetail: 'Result: {mode} · {reason} · {finals} final record(s) · type {type} · normalization {normalized}. {facts} {notice}Basic diagnostics contain no reply content.',
      nativeOutput: 'Native JSON Schema', parseValid: 'Valid structure', parsePlainText: 'Plain-text reply (no tools executed)', parseEmpty: 'Empty result', parseIncomplete: 'Unclosed JSON, possibly truncated', parseSyntax: 'CLI output is not valid JSON', parseAmbiguous: 'Ambiguous protocol fragments', parseFinalCount: 'Final result record is not unique', parseEnvelope: 'Invalid root structure', parseText: 'Missing or invalid text', parseCalls: 'Invalid toolCalls structure', parseUnknownTool: 'Undeclared tool', parseArguments: 'Tool arguments must be an object', parseOutputMissing: 'Missing structured_output', noNormalization: 'None',
      parseNativeResult: 'Native final result received', parseNotice: 'CLI notice', parseOutputInvalid: 'CLI output has no valid result', parseDeadline: 'Request deadline reached', parseStreamError: 'CLI error frame', parsePermissionFrame: 'CLI requested interactive permission', parseResultBeforeInit: 'Result before init frame', parsePostResult: 'Extra frame after final result',
      structuredFacts: 'structured_output: {present} ({type}); result type {resultType}; final subtype: {subtype}.', noticeDetail: 'Notice class: {classification} · source: {source}.',
      streamReasonNone: 'No stream error', streamReasonJson: 'JSON parse failed', streamReasonShape: 'Invalid frame shape', streamReasonDuplicateInit: 'Duplicate init frame', streamReasonPostResult: 'Conflicting sequence after result', streamReasonResultBeforeInit: 'Result before init', streamReasonMultiple: 'Multiple final results', streamReasonError: 'Error frame received', streamReasonPermission: 'Permission control frame received', streamReasonMissingInit: 'Init frame missing at close', streamReasonMissingResult: 'Final result missing at close', streamReasonExit: 'CLI exited nonzero', streamReasonDeadline: 'Request deadline reached', streamReasonCancelled: 'Request cancelled', streamReasonTooLarge: 'Output limit exceeded', streamReasonSpawn: 'CLI failed to start',
      streamPhaseAwait: 'Waiting for init', streamPhaseInit: 'Initialized', streamPhaseResult: 'Final result received', streamPhaseDrain: 'Draining terminal output', streamPhaseClosed: 'Process closed', parseStageLine: 'Newline frame', parseStageTail: 'Unterminated tail frame', parseStageNone: 'None',
      frameNone: 'None', frameInit: 'Init', frameSystem: 'System frame', frameAssistant: 'Assistant frame', frameResult: 'Result frame', frameError: 'Error frame', frameControl: 'Permission control frame', frameOther: 'Other frame', frameMalformed: 'Unparseable frame',
      terminatorNone: 'Not terminated', terminatorAdapter: 'Adapter stopped process', terminatorDrain: 'Terminal drain stopped process', terminatorDeadline: 'Deadline stopped process', terminatorCancel: 'External cancellation', terminatorChildError: 'Child process error', terminatorClose: 'Natural close', terminatorSpawn: 'Spawn failure',
      noticeNone: 'No matching notice', noticeUnknown: 'Unclassified notice', noticeContext: 'Context limit', noticeBalance: 'Insufficient balance', noticeAuth: 'Authentication', noticeAccess: 'Service access denied', noticeRate: 'Rate limit', noticeLocalPermission: 'Local permission', noticeNetwork: 'Network connection', noticeSourceStderr: 'stderr', noticeSourceStdout: 'stdout', noticeSourceAssistant: 'assistant text frame', noticeSourceError: 'error frame', noticeSourceResult: 'result frame', noticeSourceMixed: 'multiple output channels',
      factReported: 'present', factMissing: 'missing', factObject: 'object', factArray: 'array', factString: 'string', factNumber: 'number', factBoolean: 'boolean', factNull: 'null', factUndefined: 'undefined', factYes: 'valid', factNo: 'invalid', subtypeSuccess: 'success', subtypeError: 'error', subtypeOther: 'other', subtypeMissing: 'not provided',
      recentFailures: 'Recent failures (up to 5, cleared on restart)',
      diagnosticId: 'Diagnostic ID: {id} (search for this in exported logs)',
      guideTitle: 'Troubleshooting and usage guide', guideIntro: 'Some format failures cannot be recovered automatically. Check completed operations before retrying a write or command.',
      guideMultipleTitle: 'Final result record is not unique', guideMultiple: 'Native output requires exactly one final CLI result record. Missing or multiple records fail, even if their contents appear identical. The adapter does not choose the last record, merge results or execute partial tools. Check completed DSH tools and file state before sending a short new request.',
      guideIncompleteTitle: 'No valid structured result from the CLI', guideIncomplete: 'The adapter accepts only the official structured_output JSON object. It does not extract protocol fields from prose, invent missing content or request an automatic model repair. Check completed tools before retrying a smaller task.',
      guideProgressTitle: 'Tools completed but the final reply failed', guideProgress: 'A failed final reply does not undo earlier tools. Check tool records, file contents and exit codes before retrying. When requesting only a summary of completed work, explicitly ask not to repeat completed operations.',
      guideLiteralTitle: 'Paths, code or backslashes differ', guideLiteral: 'The adapter passes the structured text field through as-is and does not parse or unescape its contents again. If the text itself differs, request only the affected short section and compare literal characters.',
      guideAccessTitle: 'CLI, sign-in, deadlines or file permissions', guideAccess: 'A version check only proves the executable starts. Use official sign-in for 401 errors; model access and credits are controlled by the service. Split slow tasks or adjust the deadline. For file or ACL failures, confirm the DSH workspace and path rather than changing permissions to fix response formatting.',
      guideRequestSizeTitle: 'Local request size limits', guideRequestSize: 'REQUEST_TOO_LARGE means a local size check refused this request: the international text envelope is limited to 12 MiB, and the final stream-json CLI input in image mode to 24 MiB. Both use UTF-8 bytes, not tokens. Image offloading does not compress text history; JSONL encoding and image blocks count toward final image input. Settings and basic logs show the measured stage, actual bytes, limit and size breakdown; sizes absent from older logs cannot be reconstructed. The adapter never automatically deletes history, drops images, truncates schemas, switches models or retries.',
      guideLimitsTitle: 'Context or credit errors (400 / 402)', guideLimits: '400 means the service explicitly reported that the input exceeded the model context limit; shorten history or start a new session before retrying. 402 means the official service reported insufficient balance; check the official usage page. The plugin does not switch models or accounts or retry automatically.',
      guideNetworkTitle: 'CLI_NETWORK_ERROR: connection reset or TLS failure', guideNetwork: 'This classification means the official CLI reported a reset connection or an incomplete TLS handshake. Check connectivity to the official International service and your proxy settings. The adapter only classifies the CLI message; it cannot repair connectivity or confirm the exact cause, and it does not retry automatically. Check completed DSH actions before you decide whether to retry.',
      guideLogsTitle: 'Useful issue reports', guideLogs: 'Export basic logs with the diagnostic ID, time and reproduction steps. Arm failure capture beforehand only when raw replies are needed, and review before sharing. Successes and user-aborted tasks preserve capture; cancelling capture, clearing logs or restarting disables it.',
      guideFull: 'Read the full user guide', guideFullUrl: 'https://github.com/1924225725-collab/dsh-DKN-codebuddy-cli/blob/main/docs/intl/USER_GUIDE.en.md',
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
      catalogNote: 'Refreshes every 15 minutes or on demand. Discovery sends no model prompt and does not use model-call credits.',
      imageInput: 'Image input', imagesSupported: 'Declared by catalog', imagesUnknown: 'Not declared',
      imageNote: 'Image input is enabled only for models explicitly marked supportsImages in the live official catalog. DSH attachment service reads the images and the plugin sends native image blocks through the official CLI stream-json input; an undeclared model fails explicitly instead of silently dropping images. Per request history: up to 5 images, 2 MiB per image, 8 MiB total Base64; the longest edge is capped at 1920 pixels when resized. Inline image data URIs over 32,768 total characters are rejected before a model request. Images already offloaded by DSH are not reread, and image content is excluded from diagnostics.',
      creditsNote: 'Rates come from the current official CLI catalog; ×0 means the catalog currently marks it free. Promotions and billing can change; official billing is authoritative.',
      searchModels: 'Search model name or ID', modelName: 'Model / ID', multiplier: 'Credit multiplier', efforts: 'Reasoning efforts', context: 'Context',
      unknown: 'Not provided', noEffort: 'Model default', noMatches: 'No matching models.',
      usage: 'Cumulative token usage this run', usageNote: 'Input includes uncached, cache-read and cache-write tokens, counted once. This is not the latest question length or billed credits. The adapter starts one CLI process per request, while structured processing inside the CLI may involve multiple rounds; official usage details are authoritative. Resets on restart.',
      usageTotals: '{calls} cumulative requests · {input} total input (including cache) · {output} total output tokens',
      outcomeTotals: 'Local event counts (reset on restart): {cancelled} cancellations · {offloads} DSH image-offload requests ({images} images requested) · {history} already-offloaded images in request history. A request does not confirm DSH completed it.',
      usageBreakdown: 'Input breakdown: {uncached} uncached · {read} cache read · {write} cache write tokens',
      requestSize: 'Last request envelope: {messages} messages · {tools} tools; prompt envelope {total} UTF-8 bytes (system {system} / history {history} / tools {schemas}). This is the locally assembled request size, not tokens or proof that it was sent.',
      sizeUnknown: 'Not recorded', budgetEnvelope: 'Text envelope', budgetInput: 'Encoded CLI input',
      budgetDetail: 'Local size check: {stage} · {actual} / {limit} bytes; the request was refused before starting the CLI model invocation and was not submitted to the model.',
      requestSizeExtra: 'Other sizes: response schema {schema} / fixed instructions and envelope structure {overhead} / computed CLI input {input} bytes. Image mode includes final stream-json encoding and native image blocks; a local refusal does not mean the input was sent.',
      requestTime: 'Last call took {seconds} seconds. Complete JSON responses do not expose model decoding speed.',
      noUsage: 'No DSH model request yet. The plugin does not send test prompts automatically.',
      lastCall: 'Last: {model} · {time} · {input} input (including cache) / {output} output tokens for this call',
      lastFailed: 'Last request failed: {code}', active: '{count} request(s) active',
      balance: 'Credits', balanceNote: 'Check remaining credits under “Profile → Plan and Usage” on the CodeBuddy website. Model rates and token counters are not remaining credits.',
      openHome: 'Open CodeBuddy usage page', toolNote: 'Models and image capabilities come from the current international CLI catalog; account permissions are enforced by the official service. Image requests use the CLI native image input. CLI business tools remain disabled and DSH executes tools.'
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

    const PANEL_ID = 'codebuddy-cli'
    // Self-contained browser helpers: no filesystem scan, model request or external upload.
    function createFeedbackKit() {
      const encoder = new TextEncoder()
      const MAX_ARCHIVE = 32 * 1024 * 1024
      const textKeys = ['title', 'occurredAt', 'dshVersion', 'model', 'sessionId', 'diagnosticId', 'missingReason', 'steps', 'expected', 'actual', 'errorText', 'tool', 'context', 'frequency', 'network', 'workaround']
      const limits = { title: 160, context: 16000, steps: 8000, expected: 4000, actual: 8000, errorText: 16000 }
      const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/iu
      const clean = (v, max = 2000) => typeof v === 'string' ? v.slice(0, max) : ''
      function inspectImage(bytes, type) {
        // Bound decoded dimensions before asking the browser to allocate a bitmap.
        let width, height
        const text = (at, length) => String.fromCharCode(...bytes.subarray(at, at + length))
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
        if (type === 'image/png' && bytes.length >= 24 && bytes[0] === 137 && text(1, 7) === 'PNG\r\n\x1a\n' && text(12, 4) === 'IHDR') {
          width = view.getUint32(16); height = view.getUint32(20)
        } else if (type === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216) {
          let at = 2
          while (at + 3 < bytes.length) {
            if (bytes[at++] !== 255) throw Error('jpeg marker')
            while (bytes[at] === 255) at++
            const marker = bytes[at++]
            if (marker === 217 || marker === 218) break
            if (marker === 1 || marker >= 208 && marker <= 215) continue
            if (at + 2 > bytes.length) break
            const length = view.getUint16(at)
            if (length < 2 || at + length > bytes.length) throw Error('jpeg segment')
            if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker) && length >= 8) {
              height = view.getUint16(at + 3); width = view.getUint16(at + 5); break
            }
            at += length
          }
        } else if (type === 'image/webp' && bytes.length >= 30 && text(0, 4) === 'RIFF' && text(8, 4) === 'WEBP') {
          const chunk = text(12, 4)
          if (chunk === 'VP8X') {
            width = 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16); height = 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16)
          } else if (chunk === 'VP8L' && bytes[20] === 47) {
            width = 1 + bytes[21] + ((bytes[22] & 63) << 8); height = 1 + (bytes[22] >> 6) + (bytes[23] << 2) + ((bytes[24] & 15) << 10)
          } else if (chunk === 'VP8 ' && bytes[23] === 157 && bytes[24] === 1 && bytes[25] === 42) {
            width = view.getUint16(26, true) & 16383; height = view.getUint16(28, true) & 16383
          }
        }
        if (!(width > 0 && height > 0) || width * height > 16000000 || Math.max(width, height) > 8192) throw Error('image dimensions or format')
        return { width, height }
      }
      function redact(text) {
        return text.replace(/\b(Bearer\s+)[a-zA-Z0-9._~+\/-]+=*/giu, '$1[REDACTED]')
          .replace(/((?:["']?(?:api[_-]?key|access[_-]?token|refresh[_-]?token|authorization|cookie|password|secret|token)["']?)\s*[:=]\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s,;}]+)/giu, '$1[REDACTED]')
          .replace(/\b(?:gh[pousr]_[a-zA-Z0-9_]{16,}|github_pat_[a-zA-Z0-9_]{16,}|sk-[a-zA-Z0-9_-]{16,})\b/gu, '[REDACTED]')
      }
      const redactObject = value => typeof value === 'string' ? redact(value) : Array.isArray(value) ? value.map(redactObject) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactObject(item)])) : value
      const strings = (obj, keys, max = 128) => Object.fromEntries(keys.filter(k => typeof obj?.[k] === 'string').map(k => [k, clean(obj[k], max)]))
      function facts(obj) {
        if (!obj || typeof obj !== 'object') return {}
        // Only numbers, booleans and named diagnostic labels; never copy arbitrary nested strings.
        const labels = new Set(['channel', 'exitSignal', 'requestLimitStage', 'streamReason', 'streamPhase', 'parseStage', 'lastFrameClass', 'terminationInitiator', 'structuredOutputType', 'finalSubtypeClass', 'noticeClass', 'noticeSource', 'outputMode', 'inputType', 'valueType', 'textType', 'toolCallsType', 'reason'])
        const result = {}
        const numbers = new Set(('messageCount toolCount promptBytes systemBytes messagesBytes toolsBytes schemaBytes envelopeOverheadBytes cliInputBytes requestLimitBytes requestActualBytes requestBytes streamInputBytes timeoutMs totalFrames imageCount offloadedImageCount imageBytes imageBase64Bytes inlineImageDataUriCount inlineImageDataUriChars stdoutBytes stderrBytes durationMs frameIndex frameCount frameBytes initCount resultCount exitCode characters bytes completeContainers validProtocolCandidates ignoredContainers duplicateProtocolCandidates openContainerDepth finalResultCount elapsedMs firstByteMs firstFrameMs lastFrameMs').split(' '))
        const flags = new Set(('firstFinalSeen closeObserved deadlineReached tailFrame resultTypePresent hasText hasToolCalls hasStructuredOutput resultTypeValid containerSummariesTruncated scanIncomplete scanBroken insideString incompleteTailIgnored').split(' '))
        for (const [key, value] of Object.entries(obj)) {
          if (numbers.has(key) && Number.isSafeInteger(value) && value >= 0) result[key] = value
          if (key === 'exitCode' && Number.isSafeInteger(value) && value >= -2147483648 && value <= 4294967295) result[key] = value
          if (flags.has(key) && typeof value === 'boolean') result[key] = value
          if (labels.has(key) && typeof value === 'string') result[key] = clean(value, 128).replace(/[^a-zA-Z0-9_.:/ -]/gu, '_')
        }
        if (Array.isArray(obj.normalizations)) result.normalizations = obj.normalizations.slice(0, 16).filter(x => typeof x === 'string').map(x => clean(x, 128).replace(/[^a-zA-Z0-9_.:/ -]/gu, '_'))
        if (Array.isArray(obj.containerSummaries)) result.containerSummaries = obj.containerSummaries.slice(0, 12).map(facts)
        return result
      }
      function logs(report, detailed) {
        const entries = (Array.isArray(report?.entries) ? report.entries : []).slice(-100).map(entry => {
          const result = { ...strings(entry, ['state', 'model', 'effort', 'errorCode', 'cliVersion', 'pluginVersion', 'controlClass']), diagnostics: facts(entry.diagnostics), processDiagnostics: facts(entry.processDiagnostics), responseDiagnostics: facts(entry.responseDiagnostics) }
          if (uuid.test(entry.id)) result.id = entry.id
          if (uuid.test(entry.accountId)) result.accountId = entry.accountId
          for (const key of ['at', 'durationMs', 'timeoutMs', 'inputTokens', 'outputTokens', 'uncachedInputTokens', 'cacheReadTokens', 'cacheWriteTokens', 'toolCalls', 'offloadImages', 'offloadImagesRequested', 'historyOffloadedImages']) if (Number.isSafeInteger(entry[key]) && entry[key] >= 0) result[key] = entry[key]
          for (const key of ['imageRequest', 'captureAttempted', 'sampleAvailable', 'cancelled']) if (typeof entry[key] === 'boolean') result[key] = entry[key]
          if (detailed && entry.imageRequest !== true && entry.state === 'error' && typeof entry.sample?.head === 'string') result.sample = { ...strings(entry.sample, ['head', 'tail'], 262144), truncated: entry.sample.truncated === true, originalBytes: Number.isSafeInteger(entry.sample.originalBytes) ? entry.sample.originalBytes : null }
          return result
        })
        return { schemaVersion: 1, ...strings(report, ['pluginVersion', 'storageError']), exportedAt: Number.isSafeInteger(report?.exportedAt) ? report.exportedAt : null, environment: strings(report?.environment, ['platform', 'arch', 'nodeVersion']), entries }
      }
      function validate(form, pictures) {
        for (const [key, minimum] of Object.entries({ title: 6, actual: 5 })) if ((form[key] || '').trim().length < minimum) return key
        if (!pictures.length || pictures.length > 6) return 'screenshots'
        if (pictures.some(x => !(x.bytes instanceof Uint8Array) || x.bytes.length > 5 * 1024 * 1024) || pictures.reduce((sum, x) => sum + x.bytes.length, 0) > 20 * 1024 * 1024) return 'screenshots'
        return null
      }
      function importLogs(text, region) {
        if (encoder.encode(text).length > 4 * 1024 * 1024) throw Error('log-size')
        const data = JSON.parse(text)
        if (data?.schemaVersion !== 1 || !Array.isArray(data.entries) || data.entries.length > 100 || data.entries.some(x => !x || Array.isArray(x) || typeof x !== 'object' || !uuid.test(x.id))) throw Error('log-shape')
        if (new Set(data.entries.map(x => x.id.toLowerCase())).size !== data.entries.length) throw Error('log-duplicate-id')
        if (data.region !== undefined && data.region !== region || data.provider !== undefined && data.provider !== 'codebuddy-cli-' + region) throw Error('log-region')
        return { report: logs(data, true), regionVerified: data.region === region || data.provider === 'codebuddy-cli-' + region }
      }
      function safeStatus(status, config) {
        return { ...strings(status, ['provider', 'pluginVersion', 'responseMode', 'model', 'effort']),
          timeoutMs: Number.isSafeInteger(status?.timeoutMs) ? status.timeoutMs : null,
          activeCalls: Number.isSafeInteger(status?.activeCalls) ? status.activeCalls : null,
          cliCheck: { ...strings(status?.cliCheck, ['state', 'version', 'code']), checkedAt: Number.isSafeInteger(status?.cliCheck?.checkedAt) ? status.cliCheck.checkedAt : null },
          configuration: { ...strings(config, ['model', 'effort']), explicitCliPath: !!config?.cliPath, explicitConfigDirectory: !!config?.configDir, timeoutMs: Number.isSafeInteger(config?.timeoutMs) ? config.timeoutMs : null },
          accounts: { independentAccountSelected: !!status?.accounts?.selectedId, count: Array.isArray(status?.accounts?.accounts) ? status.accounts.accounts.length : null, supported: status?.accounts?.supported === true },
          catalog: { ...strings(status?.catalog, ['state']), modelCount: Array.isArray(status?.catalog?.models) ? status.catalog.models.length : null } }
      }
      async function archive(files) {
        const chunks = [], central = []
        let offset = 0, centralBytes = 0
        const crc = bytes => { let n = 0xffffffff; for (const b of bytes) { n ^= b; for (let j = 0; j < 8; j++) n = (n >>> 1) ^ (n & 1 ? 0xedb88320 : 0) } return (n ^ 0xffffffff) >>> 0 }
        for (const file of files) {
          if (!/^[a-zA-Z0-9_./-]+$/u.test(file.name) || file.name.includes('..') || file.name.startsWith('/')) throw Error('unsafe archive path')
          const name = encoder.encode(file.name), bytes = typeof file.data === 'string' ? encoder.encode(file.data) : file.data
          const checksum = crc(bytes), local = new Uint8Array(30 + name.length), a = new DataView(local.buffer)
          a.setUint32(0, 0x04034b50, true); a.setUint16(4, 20, true); a.setUint16(6, 0x800, true); a.setUint16(12, 33, true)
          a.setUint32(14, checksum, true); a.setUint32(18, bytes.length, true); a.setUint32(22, bytes.length, true); a.setUint16(26, name.length, true); local.set(name, 30)
          const dir = new Uint8Array(46 + name.length), b = new DataView(dir.buffer)
          b.setUint32(0, 0x02014b50, true); b.setUint16(4, 20, true); b.setUint16(6, 20, true); b.setUint16(8, 0x800, true); b.setUint16(14, 33, true)
          b.setUint32(16, checksum, true); b.setUint32(20, bytes.length, true); b.setUint32(24, bytes.length, true); b.setUint16(28, name.length, true); b.setUint32(42, offset, true); dir.set(name, 46)
          chunks.push(local, bytes); central.push(dir); offset += local.length + bytes.length; centralBytes += dir.length
          if (offset + centralBytes > MAX_ARCHIVE) throw Error('archive too large')
        }
        const end = new Uint8Array(22), d = new DataView(end.buffer)
        d.setUint32(0, 0x06054b50, true); d.setUint16(8, files.length, true); d.setUint16(10, files.length, true); d.setUint32(12, centralBytes, true); d.setUint32(16, offset, true)
        return new Blob([...chunks, ...central, end], { type: 'application/zip' })
      }
      async function prepare({ form, pictures, report, region, status, config, browser, detailed = false, attachments = [], logSource = 'automatic', localRegionConfirmed = false, logRegionEvidence = 'none' }) {
        const invalid = validate(form, pictures)
        if (invalid) throw Error(invalid)
        if (!['cn', 'intl'].includes(region)) throw Error('region')
        const user = Object.fromEntries(textKeys.map(key => [key, clean(form[key], limits[key] || 2000).trim()]))
        const diagnostics = logs(report, false)
        const target = user.diagnosticId ? diagnostics.entries.find(x => x.id?.toLowerCase() === user.diagnosticId.toLowerCase()) : null
        if (detailed && target) {
          const captured = logs(report, true).entries.find(x => x.id?.toLowerCase() === user.diagnosticId.toLowerCase())
          if (captured?.sample) target.sample = captured.sample
        }
        const gaps = ['普通诊断仅保留有限近期调用，不是完整会话或全部历史。Basic diagnostics retain only bounded recent calls, not the full conversation or history.']
        if (status?.pluginVersion && status.pluginVersion !== '1.0.1') gaps.push('配置页和运行端版本不同。Settings UI and runtime versions differ.')
        if (!status) gaps.push('运行状态不可读取，配置或版本信息可能缺失。Runtime status was unavailable; configuration and version facts may be incomplete.')
        if (!target) gaps.push('未找到完全匹配的诊断事件，其他调用只供参考。No matching diagnostic event. Nearby calls are context only; do not infer a matching request from their order.')
        for (const key of ['steps', 'errorText', 'occurredAt', 'dshVersion', 'model']) if (!user[key]) gaps.push('最好填写的材料未提供 / Recommended evidence not provided: ' + key)
        if (!user.sessionId) gaps.push('未提供 DSH 会话 ID。DSH session ID not provided.')
        if (!report) gaps.push('诊断服务不可用，没有采集到本次日志事实。Diagnostic service was unavailable; no diagnostic facts were collected.')
        if (diagnostics.storageError) gaps.push('诊断日志存储异常 / Diagnostic storage error: ' + diagnostics.storageError)
        if (!detailed || !diagnostics.entries.some(x => x.sample)) gaps.push('未附原始 CLI 回复；必要时可在诊断日志中主动开启一次失败采集后安全复现，含图请求不采集原始回复。Raw CLI reply not included. Enable existing one-failure capture before a safe reproduction only if needed; image replies are excluded.')
        if (!attachments.length) gaps.push('未附对话导出或额外工具/CLI 日志，现有材料未必能证明根因。No DSH conversation export or additional tool/CLI log was supplied. Screenshots and the user description may not prove a root cause.')
        if (status?.activeCalls > 0) gaps.push('取证时仍有请求在运行，其最终结果可能尚未记录。There were active requests during collection; their final results may not yet be recorded.')
        if (target?.pluginVersion && status?.pluginVersion && target.pluginVersion !== status.pluginVersion) gaps.push('所选故障记录与当前运行版本不同，不应假定使用同一版本代码。Selected event and current runtime versions differ; do not assume they used the same code.')
        const id = crypto.randomUUID(), at = new Date().toISOString()
        const document = { schemaVersion: 1, reportId: id, exportedAt: at, region, support: { qqGroup: '1095591284', recipient: '群主 / group owner', automaticUpload: false },
          userProvided: user, automatic: { uiVersion: '1.0.1', logSource: { kind: logSource === 'local-file' ? 'local-file' : 'automatic', localRegionConfirmed: logSource === 'local-file' && localRegionConfirmed, regionEvidence: ['file-metadata', 'user-confirmed'].includes(logRegionEvidence) ? logRegionEvidence : 'none' }, diagnosticCoverage: { retainedCalls: diagnostics.entries.length, earliestAt: diagnostics.entries.length ? Math.min(...diagnostics.entries.map(x => x.at).filter(Number.isFinite)) : null, latestAt: diagnostics.entries.length ? Math.max(...diagnostics.entries.map(x => x.at).filter(Number.isFinite)) : null }, browser: strings(browser, ['userAgent', 'language', 'timezone', 'utcOffset']), status: safeStatus(status, config), diagnosticMatch: target ? 'exact-id' : 'not-found', selectedEvent: target || null },
          evidenceGaps: gaps, privacy: { rawRepliesRequested: detailed, includesRawReplies: diagnostics.entries.some(x => x.sample), screenshotMetadataRemoved: true, automaticSecretRedaction: 'best-effort text patterns only; pixels require manual review', includesCredentialsByDesign: false, userReviewRequired: true } }
        const files = [{ name: 'report.json', data: JSON.stringify(redactObject(document), null, 2) }, { name: 'diagnostics.json', data: JSON.stringify(redactObject(diagnostics), null, 2) }]
        if (attachments.length > 3 || attachments.reduce((sum, x) => sum + encoder.encode(x.text).length, 0) > 4 * 1024 * 1024) throw Error('attachments')
        attachments.forEach((item, i) => files.push({ name: `supplements/context-${i + 1}.txt`, data: redact(item.text) }))
        pictures.forEach((item, i) => files.push({ name: `screenshots/context-${i + 1}.png`, data: item.bytes }))
        const headings = { title: '问题 / Issue', occurredAt: '发生时间（用户本地时间）/ Local time', dshVersion: 'DSH 版本 / Version', model: '用户确认的会话模型 / Model', sessionId: '会话 ID / Session', diagnosticId: '诊断 ID / Diagnostic', missingReason: '缺失原因 / Missing evidence', steps: '复现步骤 / Steps', expected: '预期 / Expected', actual: '实际 / Actual', errorText: '完整报错 / Error', tool: '相关工具和执行状态 / Tools', context: '上下文补充 / Context', frequency: '复现频率 / Frequency', network: '网络及代理情况 / Network', workaround: '已尝试的方法 / Attempts' }
        files.push({ name: 'README.md', data: redact(`# DKN CodeBuddy 问题反馈 / Issue report\n\n报告 ${id} · ${at} · ${region}\n\n加入 QQ 群 **1095591284**，联系**群主**发送本 ZIP；不要在公开群聊发送未脱敏的截图或对话。\nJoin QQ group **1095591284** and send this ZIP to the **group owner** privately. Nothing is automatically uploaded.\n\n` + textKeys.map(key => `## ${headings[key]}\n\n${user[key] || '未提供 / Not provided'}\n`).join('\n') + '\n## 证据边界 / Evidence limits\n\n' + gaps.map(x => '- ' + x).join('\n') + '\n\nThe diagnostic event is matched only by the exact ID. Other calls are not proof of the same failure. Cancellation and image offload are control events, not necessarily product failures. No login credentials, account labels, login commands, proxy configuration or original image paths are read. Text redaction is limited; inspect every file and screenshot before sharing. Screenshot pixels and manually supplied conversation exports may contain private content. This report does not guarantee a root cause or a complete historical record.\n') })
        const manifest = { schemaVersion: 1, reportId: id, exportedAt: at, region, files: [] }
        for (const file of files) {
          const bytes = typeof file.data === 'string' ? encoder.encode(file.data) : file.data
          const hash = await crypto.subtle.digest('SHA-256', bytes)
          manifest.files.push({ path: file.name, bytes: bytes.length, sha256: Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('') })
        }
        files.push({ name: 'manifest.json', data: JSON.stringify(manifest, null, 2) })
        return { name: `dsh-dkn-codebuddy-feedback-${region}-${at.slice(0, 10)}-${id}.zip`, files, manifest, gaps, document }
      }
      return { validate, prepare, archive, redact, logs, safeStatus, inspectImage, importLogs }
    }

    const feedbackZh = {
      feedbackTierrequired: '必填', feedbackTierrecommended: '最好填（可展开补充）', feedbackTieroptional: '可选（可展开补充）', feedbackLogSource: '日志与诊断（自动获取）', feedbackAutoLoading: '正在自动读取当前区域日志，不影响填写问题…', feedbackAutoReady: '已自动获取当前区域日志；生成时会再读取最新快照，不需要选择本地日志。', feedbackReplaceLogs: '使用本地诊断 JSON 替换（可选）', feedbackLocalNote: '仅接受插件导出的诊断 JSON，最大 4 MiB。不会合并到自动日志；替换前会检查内容及区域。普通对话导出或工具日志请放在文字补充附件中。', feedbackLocalConfirm: '此旧日志未记录区域；我确认它来自当前所选区域。', feedbackLocalPreview: '待替换的诊断记录数：', feedbackApplyLocal: '应用本地日志替换', feedbackLocalActive: '当前使用手动替换的本地日志，不会混入自动日志。', feedbackUseAuto: '恢复自动获取日志', feedbackLocalFailed: '无法读取此文件：请选择有效的插件诊断 JSON（最大 4 MiB），不接受凭据文件。原日志来源保持不变。', feedbackLocalWrongRegion: '这份日志标记的区域与当前页面不一致，已拒绝替换。', feedbackEventSearch: '搜索时间、模型、错误或诊断 ID', feedbackShowAll: '显示成功、取消与其他记录', feedbackNoEvents: '没有符合条件的诊断记录。', feedbackLogTools: '日志工具：查看、导出与失败采集（可选）', feedbackLogToolsNote: '这些工具操作当前区域正在运行的插件日志，不会修改导入的本地文件。',
      navfeedback: '问题反馈', feedbackTitle: '问题反馈与取证包', feedbackIntro: '填写问题经过并附上错误前后的上下文截图，生成 ZIP 后加入 QQ 群 1095591284，联系群主私发反馈包。不会自动上传或发送消息；本页草稿只在当前页面内存中保留。',
      feedbackPrivacy: '请先遮挡截图中的密钥、手机号、私人消息等内容。导出时会移除截图文件元数据并尝试遮盖常见文本密钥，但无法自动识别所有隐私，尤其是图片中的文字。不要上传登录二维码、验证码、恢复码或凭据文件。',
      feedbackRefresh: '刷新自动日志', feedbackEvent: '选择对应调用（请核对时间、模型和诊断 ID）', feedbackEventNone: '手动填写诊断 ID / 无对应记录', feedbackReady: '诊断快照已获取。其他调用仅为上下文，不会当作同一次故障。', feedbackNoLogs: '未能读取诊断服务，可继续反馈；包内将注明证据缺失。',
      feedbacktitle: '问题简述（至少 6 个字）', feedbackoccurredAt: '问题发生时间（本地时间）', feedbackdshVersion: 'DSH 版本（在“关于”中查看；无法查看请写未知）', feedbackmodel: '出错会话选择的模型与区域', feedbacksessionId: 'DSH 会话 ID（如果有）', feedbackdiagnosticId: '报错中的 diagnostic-id（如果有）', feedbackmissingReason: '缺少 ID 或其他材料的原因',
      feedbacksteps: '复现步骤（从什么状态，做了什么）', feedbackexpected: '预期结果', feedbackactual: '实际结果（至少 5 个字）', feedbackerrorText: '完整报错原文（无报错请注明；不要只写“失败”）', feedbacktool: '涉及的工具/插件名称，以及是否已执行（不涉及请写无）', feedbackcontext: '前后文补充：长历史/图片数量与来源、工作区、是否换模型或账号等；不要粘贴密钥', feedbackfrequency: '出现频率及同样操作能否复现', feedbacknetwork: '网络/代理使用情况（不知道请写未知，不要提供代理密码）', feedbackworkaround: '已尝试的方法及其结果（可选）',
      feedbackRequired: '红色 # 必填：简述、实际结果和截图。黄色 # 最好填，普通 # 可选；后两类留空也能生成。日志会自动获取，无需先选本地文件。', feedbackBasics: '1. 定位问题', feedbackStory: '2. 经过与上下文', feedbackEvidence: '3. 截图与补充材料', feedbackReviewStep: '4. 预览并生成反馈包',
      feedbackScreenshots: '上下文截图（必需，1–6 张；错误位置及前后消息）', feedbackScreenshotNote: 'PNG / JPEG / WebP，每张原文件及转换后的 PNG 均不超过 5 MiB，合计不超过 20 MiB，单张不超过 1600 万像素。请在上传前自行打码。', feedbackRemove: '移除', feedbackImageFailed: '截图无效或超过限制。请裁剪、缩小或另存为 PNG/JPEG/WebP 后重新选择。',
      feedbackAttachments: '追加已脱敏的 DSH 对话导出 / 工具日志（可选）', feedbackAttachmentNote: '最多 3 个 txt/md/json/log 文本文件，合计 4 MiB。请仅选择相关片段；不得选择认证配置或凭据文件。它们不会被当作插件自动验证的事实。', feedbackAttachmentFailed: '补充文件无效、不是 UTF-8 文本或超过限制，请重新选择。',
      feedbackDetail: '附加此前主动采集的原始失败回复（可能包含私人内容）', feedbackDetailNote: '默认只含普通诊断。不自动开启采集；如需原始回复，在本页展开“日志工具”阅读说明并开启一次失败采集，再安全复现。含图片请求的原始回复始终不采集。',
      feedbackPrepare: '检查材料并预览反馈包', feedbackBusy: '正在整理材料…', feedbackInvalid: '请补全或检查：', feedbackFailure: '反馈包生成失败；草稿仍保留。请检查材料大小后重试，或手动导出普通日志并联系群主。', feedbackPreview: '反馈包预览（用户补充与自动证据分开保存）', feedbackGaps: '仍缺少的证据 / 注意事项', feedbackConsent: '我已检查以下文本内容、全部截图及补充文件，确认可向群主分享；自动脱敏不保证覆盖所有隐私。', feedbackDownload: '生成并下载反馈 ZIP', feedbackDownloaded: '已发起 ZIP 下载（保存位置由浏览器或 DSH 决定）。请确认文件已保存，加入 QQ 群 1095591284，联系群主私发。', feedbackNoMatch: '此诊断 ID 未匹配到当前区域日志；不会用其他记录替代。', feedbackReadOnly: '运行配置尚未就绪，反馈仍可填写；自动配置证据可能缺失。', feedbackPreviewNote: '下载使用此次预览时冻结的证据。修改描述、材料或采集选项会要求重新预览。截图与补充文件请逐一检查。', feedbackFileList: '包内文件与 SHA-256 校验', feedbackRegion: '反馈区域：', feedbackGroup: 'QQ 群：1095591284 · 联系群主', feedbackDraftConfig: '有未保存的配置草稿。反馈包只记录运行配置，不会把草稿当成实际配置。'
    }
    const feedbackEn = {
      feedbackTierrequired: 'Required', feedbackTierrecommended: 'Recommended (expand to add)', feedbackTieroptional: 'Optional (expand to add)', feedbackLogSource: 'Logs and diagnostics (automatic)', feedbackAutoLoading: 'Reading this region’s logs automatically. You can keep writing…', feedbackAutoReady: 'Current-region logs loaded automatically; a fresh snapshot is read at export. No local file is needed.', feedbackReplaceLogs: 'Replace with local diagnostic JSON (optional)', feedbackLocalNote: 'Plugin diagnostic exports only, up to 4 MiB. The replacement is validated and never merged with automatic logs. Add conversation exports or tool logs as text supplements instead.', feedbackLocalConfirm: 'This legacy file has no region metadata. I confirm it belongs to the selected region.', feedbackLocalPreview: 'Diagnostic entries ready to replace: ', feedbackApplyLocal: 'Apply local log replacement', feedbackLocalActive: 'Using manually replaced local logs; automatic logs are not mixed in.', feedbackUseAuto: 'Restore automatic logs', feedbackLocalFailed: 'Invalid plugin diagnostic JSON, credential file or size over 4 MiB. The previous log source is unchanged.', feedbackLocalWrongRegion: 'This log declares a different region; replacement was rejected.', feedbackEventSearch: 'Search time, model, error or diagnostic ID', feedbackShowAll: 'Show successes, cancellations and other records', feedbackNoEvents: 'No matching diagnostic records.', feedbackLogTools: 'Log tools: view, export and failure capture (optional)', feedbackLogToolsNote: 'These tools operate on the running region’s diagnostics, not on imported files.',
      navfeedback: 'Report an issue', feedbackTitle: 'Issue report and evidence bundle', feedbackIntro: 'Describe the issue and attach screenshots showing the error and surrounding messages. Download the ZIP, join QQ group 1095591284 and privately send it to the group owner. Nothing is uploaded or messaged automatically. Drafts exist only in this page’s memory.',
      feedbackPrivacy: 'Mask secrets and private information in screenshots first. Screenshot metadata is removed and common text secrets are masked on a best-effort basis. Image pixels are not automatically redacted. Never attach login QR codes, verification or recovery codes, or credential files.',
      feedbackRefresh: 'Refresh automatic logs', feedbackEvent: 'Select the matching call (check time, model and ID)', feedbackEventNone: 'Enter diagnostic ID manually / no matching record', feedbackReady: 'Diagnostic snapshot loaded. Other calls are context only, not the same incident.', feedbackNoLogs: 'Diagnostics are unavailable. You can still report; the bundle will record the evidence gap.',
      feedbacktitle: 'Issue summary (at least 6 characters)', feedbackoccurredAt: 'When it happened (local time)', feedbackdshVersion: 'DSH version (About; enter unknown if unavailable)', feedbackmodel: 'Model and region selected in the failed conversation', feedbacksessionId: 'DSH session ID, if available', feedbackdiagnosticId: 'Diagnostic ID from the error, if available', feedbackmissingReason: 'Why an ID or other evidence is unavailable', feedbacksteps: 'Reproduction steps', feedbackexpected: 'Expected result', feedbackactual: 'Actual result (at least 5 characters)', feedbackerrorText: 'Full error text (state no error if none)', feedbacktool: 'Tool/plugin names and whether they already executed (or none)', feedbackcontext: 'Context: long history, image count and sources, workspace, model/account changes. Do not paste secrets.', feedbackfrequency: 'Frequency and reproducibility', feedbacknetwork: 'Network/proxy use (or unknown; no proxy passwords)', feedbackworkaround: 'Attempts and results (optional)',
      feedbackRequired: 'Red # required: summary, actual result and screenshots. Yellow # recommended; normal # optional. Only required fields block export. Logs are collected automatically.', feedbackBasics: '1. Identify the incident', feedbackStory: '2. Steps and context', feedbackEvidence: '3. Screenshots and supplements', feedbackReviewStep: '4. Review and create the bundle',
      feedbackScreenshots: 'Context screenshots (required, 1–6)', feedbackScreenshotNote: 'PNG/JPEG/WebP. Each source and converted PNG: at most 5 MiB; total: 20 MiB; at most 16 million pixels per image. Mask private pixels before attaching.', feedbackRemove: 'Remove', feedbackImageFailed: 'Invalid or oversized image. Resize/crop or save as PNG/JPEG/WebP and select again.',
      feedbackAttachments: 'Attach redacted DSH conversation exports / tool logs (optional)', feedbackAttachmentNote: 'Up to 3 UTF-8 txt/md/json/log files, 4 MiB total. Related excerpts only; no credential files. These are user-supplied evidence, not automatically verified facts.', feedbackAttachmentFailed: 'Invalid, oversized or non-UTF-8 text attachment. Please select again.', feedbackDetail: 'Include previously captured raw failure replies (may contain private content)', feedbackDetailNote: 'Basic diagnostics only by default. Capture is never enabled automatically. Use this page’s Log tools to arm a single failure capture before a safe reproduction if needed. Raw replies for image requests remain excluded.',
      feedbackPrepare: 'Check materials and preview bundle', feedbackBusy: 'Preparing evidence…', feedbackInvalid: 'Complete or check: ', feedbackFailure: 'Could not create the bundle. Your draft remains. Check sizes and retry, or export basic logs and contact the group owner.', feedbackPreview: 'Bundle preview (user descriptions and automatic evidence are separated)', feedbackGaps: 'Evidence gaps / limitations', feedbackConsent: 'I reviewed all text, screenshots and supplements and agree to share them with the group owner. Automatic redaction may miss private content.', feedbackDownload: 'Create and download feedback ZIP', feedbackDownloaded: 'ZIP download requested; the browser or DSH controls where it is saved. Confirm it was saved, join QQ group 1095591284 and send it privately to the group owner.', feedbackNoMatch: 'This ID is not in this region’s logs. Other calls will not be substituted.', feedbackReadOnly: 'Runtime configuration is not ready. You can still report; configuration evidence may be missing.', feedbackPreviewNote: 'The download uses the evidence frozen for this preview. Editing the description, materials or capture option requires a new preview. Inspect all screenshots and supplements.', feedbackFileList: 'Included files and SHA-256 checksums', feedbackRegion: 'Report region: ', feedbackGroup: 'QQ group: 1095591284 · Contact the group owner', feedbackDraftConfig: 'Unsaved configuration draft exists. The bundle records the runtime configuration, not the draft.'
    }
    const feedbackKit = createFeedbackKit()
    function IssueFeedback({ t, region, statusUrl, diagnosticsUrl, config, dirty, active = true, logTools }) {
      const [form, setForm] = React.useState({})
      const [pictures, setPictures] = React.useState([])
      const [attachments, setAttachments] = React.useState([])
      const [detailed, setDetailed] = React.useState(false)
      const [busy, setBusy] = React.useState(false)
      const [message, setMessage] = React.useState('')
      const [available, setAvailable] = React.useState(null)
      const [logLoading, setLogLoading] = React.useState(false)
      const [localReport, setLocalReport] = React.useState(null)
      const [localCandidate, setLocalCandidate] = React.useState(null)
      const [localConfirmed, setLocalConfirmed] = React.useState(false)
      const [eventSearch, setEventSearch] = React.useState('')
      const [showAllEvents, setShowAllEvents] = React.useState(false)
      const logSequence = React.useRef(0)
      const [prepared, setPrepared] = React.useState(null)
      const [consent, setConsent] = React.useState(false)
      const lock = React.useRef(false)
      const urls = React.useRef(new Set())
      React.useEffect(() => () => { for (const url of urls.current) URL.revokeObjectURL(url) }, [])
      const invalidate = () => { setPrepared(null); setConsent(false); setMessage('') }
      const edit = (key, value) => { invalidate(); setForm(old => ({ ...old, [key]: value })) }
      const getJson = async (url, detail = false) => {
        const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000)
        try {
          const response = await fetch(url, { signal: controller.signal, cache: 'no-store', ...(detail ? { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DSH-CodeBuddy-Action': '1' }, body: JSON.stringify({ action: 'exportDetailedLogs' }) } : {}) })
          if (!response.ok) throw Error('unavailable')
          return await response.json()
        } finally { clearTimeout(timeout) }
      }
      const refresh = async (manual = true) => {
        const sequence = ++logSequence.current
        setLogLoading(true)
        if (manual) invalidate()
        try {
          const result = await getJson(diagnosticsUrl)
          if (!Array.isArray(result?.entries)) throw Error('invalid diagnostic report')
          if (sequence !== logSequence.current) return
          setAvailable(feedbackKit.logs(result, false)); setMessage(t('feedbackReady'))
        } catch { if (sequence === logSequence.current) { setAvailable(null); setMessage(t('feedbackNoLogs')) } }
        finally { if (sequence === logSequence.current) setLogLoading(false) }
      }
      React.useEffect(() => {
        if (active && !localReport) void refresh(false)
        return () => { logSequence.current++ }
      }, [active, localReport, diagnosticsUrl])
      const chooseLocalLog = async event => {
        const file = event.target.files?.[0]; event.target.value = ''
        if (!file || lock.current) return
        lock.current = true; setBusy(true); invalidate(); setLocalCandidate(null); setLocalConfirmed(false)
        try {
          if (!/\.json$/iu.test(file.name) || /^(?:auth|credentials?|tokens?|cookies?|secrets?)(?:[._-]|$)/iu.test(file.name) || file.size > 4 * 1024 * 1024) throw Error('log-file')
          const text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer())
          setLocalCandidate(feedbackKit.importLogs(text, region))
        } catch (error) { setMessage(t(error.message === 'log-region' ? 'feedbackLocalWrongRegion' : 'feedbackLocalFailed')) }
        finally { lock.current = false; setBusy(false) }
      }
      const useLocalLog = () => {
        if (!localCandidate || !localCandidate.regionVerified && !localConfirmed) return
        logSequence.current++; setLogLoading(false); invalidate()
        setLocalReport(localCandidate); setAvailable(feedbackKit.logs(localCandidate.report, false)); setLocalCandidate(null)
      }
      const useAutomaticLog = () => {
        invalidate(); setLocalCandidate(null)
        if (localReport) setLocalReport(null)
        else void refresh()
      }
      const choosePictures = async event => {
        const files = Array.from(event.target.files || []); event.target.value = ''
        if (!files.length || lock.current) return
        invalidate(); lock.current = true; setBusy(true)
        const added = []
        try {
          if (pictures.length + files.length > 6 || files.reduce((s, f) => s + f.size, 0) > 20 * 1024 * 1024) throw Error('size')
          for (const file of files) {
            if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw Error('image')
            feedbackKit.inspectImage(new Uint8Array(await file.arrayBuffer()), file.type)
            const bitmap = await createImageBitmap(file)
            let png
            try {
              if (bitmap.width * bitmap.height > 16000000 || Math.max(bitmap.width, bitmap.height) > 8192) throw Error('dimensions')
              const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height
              const context = canvas.getContext('2d'); if (!context) throw Error('canvas')
              context.drawImage(bitmap, 0, 0)
              png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
            } finally { bitmap.close() }
            if (!png || png.size > 5 * 1024 * 1024) throw Error('converted size')
            const bytes = new Uint8Array(await png.arrayBuffer()), url = URL.createObjectURL(png)
            urls.current.add(url); added.push({ bytes, url })
          }
          if ([...pictures, ...added].reduce((s, f) => s + f.bytes.length, 0) > 20 * 1024 * 1024) throw Error('total')
          setPictures(old => [...old, ...added])
        } catch { for (const item of added) { URL.revokeObjectURL(item.url); urls.current.delete(item.url) } setMessage(t('feedbackImageFailed')) }
        finally { lock.current = false; setBusy(false) }
      }
      const chooseAttachments = async event => {
        const files = Array.from(event.target.files || []); event.target.value = ''
        if (!files.length || lock.current) return
        invalidate(); lock.current = true; setBusy(true)
        try {
          if (attachments.length + files.length > 3 || files.reduce((s, f) => s + f.size, 0) > 4 * 1024 * 1024) throw Error('size')
          const added = []
          for (const file of files) {
            if (!/\.(txt|md|json|log)$/iu.test(file.name) || /^(?:auth|credentials?|tokens?|cookies?|secrets?)(?:[._-]|$)/iu.test(file.name) || file.size > 4 * 1024 * 1024) throw Error('type')
            const text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer())
            if (text.includes('\0')) throw Error('binary')
            added.push({ text })
          }
          if ([...attachments, ...added].reduce((s, x) => s + new TextEncoder().encode(x.text).length, 0) > 4 * 1024 * 1024) throw Error('total')
          setAttachments(old => [...old, ...added])
        } catch { setMessage(t('feedbackAttachmentFailed')) }
        finally { lock.current = false; setBusy(false) }
      }
      const prepare = async () => {
        if (lock.current) return
        const invalid = feedbackKit.validate(form, pictures)
        if (invalid) { setMessage(t('feedbackInvalid') + t(invalid === 'screenshots' ? 'feedbackScreenshots' : 'feedback' + invalid)); return }
        lock.current = true; setBusy(true); invalidate()
        try {
          const [logResult, statusResult] = await Promise.allSettled([localReport ? Promise.resolve(localReport.report) : getJson(diagnosticsUrl, detailed), getJson(statusUrl)])
          const report = logResult.status === 'fulfilled' && Array.isArray(logResult.value?.entries) ? logResult.value : null
          if (report) setAvailable(feedbackKit.logs(report, false))
          const next = await feedbackKit.prepare({ form, pictures, attachments, detailed, report, region, config, logSource: localReport ? 'local-file' : 'automatic', localRegionConfirmed: !!localReport, logRegionEvidence: localReport ? localReport.regionVerified ? 'file-metadata' : 'user-confirmed' : 'none', status: statusResult.status === 'fulfilled' ? statusResult.value : null,
            browser: { userAgent: navigator.userAgent, language: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, utcOffset: String(new Date().getTimezoneOffset()) } })
          setPrepared(next)
          if (!report) setMessage(t('feedbackNoLogs'))
          else if (form.diagnosticId && next.document.automatic.diagnosticMatch !== 'exact-id') setMessage(t('feedbackNoMatch'))
        } catch { setMessage(t('feedbackFailure')) }
        finally { lock.current = false; setBusy(false) }
      }
      const download = async () => {
        if (lock.current || !prepared || !consent) return
        lock.current = true; setBusy(true)
        try {
          const blob = await feedbackKit.archive(prepared.files), url = URL.createObjectURL(blob)
          urls.current.add(url)
          const anchor = document.createElement('a'); anchor.href = url; anchor.download = prepared.name
          document.body.appendChild(anchor); anchor.click(); anchor.remove()
          setTimeout(() => { URL.revokeObjectURL(url); urls.current.delete(url) }, 60000)
          setMessage(t('feedbackDownloaded'))
        } catch { setMessage(t('feedbackFailure')) }
        finally { lock.current = false; setBusy(false) }
      }
      const required = new Set(['title', 'actual'])
      const recommended = new Set(['steps', 'expected', 'errorText', 'occurredAt', 'dshVersion', 'model', 'sessionId', 'diagnosticId', 'tool', 'context', 'frequency'])
      const mark = tier => h('span', { 'data-feedback-priority': tier, 'aria-hidden': true, style: { color: tier === 'required' ? '#d84444' : tier === 'recommended' ? '#b77900' : 'inherit', fontSize: 20, fontWeight: 750, lineHeight: 1, marginRight: 7 } }, '#')
      const field = (key, multiline = false) => h('label', { key, style: { display: 'grid', gap: 6 } },
        h('span', null, mark(required.has(key) ? 'required' : recommended.has(key) ? 'recommended' : 'optional'), t('feedback' + key)),
        h(multiline ? 'textarea' : 'input', { 'aria-label': t('feedback' + key), value: form[key] || '', disabled: busy, type: key === 'occurredAt' ? 'datetime-local' : 'text', rows: multiline ? 3 : undefined, required: required.has(key), maxLength: key === 'context' || key === 'errorText' ? 16000 : key === 'steps' || key === 'actual' ? 8000 : key === 'title' ? 160 : key === 'expected' ? 4000 : 2000, onChange: e => edit(key, e.target.value), style: { ...inputStyle(), resize: 'vertical', width: '100%', minWidth: 0 } }))
      const selectedEvent = form.diagnosticId ? available?.entries?.find(x => x.id?.toLowerCase() === form.diagnosticId.toLowerCase()) : null
      const events = (available?.entries || []).slice().reverse().filter(x => x.id)
      const failures = events.filter(x => x.state === 'error' && !x.controlClass && !x.cancelled && !x.offloadImagesRequested)
      const visibleEvents = (showAllEvents || !failures.length ? events : failures).filter(x => `${x.id} ${x.model} ${x.errorCode} ${x.at ? new Date(x.at).toLocaleString() : ''}`.toLowerCase().includes(eventSearch.toLowerCase()))
      const selectEvent = entry => {
        invalidate(); setForm(old => ({ ...old, diagnosticId: entry?.id || '', ...(entry?.model ? { model: entry.model } : {}), ...(Number.isSafeInteger(entry?.at) ? { occurredAt: new Date(entry.at - new Date(entry.at).getTimezoneOffset() * 60000).toISOString().slice(0, 16) } : {}) }))
      }
      return h('div', { style: { display: 'grid', gap: 16, color: 'var(--dsw-alias-label-primary, inherit)' } },
        h(SectionHeading, { kind: 'feedback' }, t('feedbackTitle')), h(Notice, null, t('feedbackIntro')), h('strong', null, t('feedbackGroup')),
        h('div', { style: rowStyle }, ...['required', 'recommended', 'optional'].map(tier => h('span', { key: tier }, mark(tier), t('feedbackTier' + tier)))),
        h(Notice, null, t('feedbackRequired')), h(Notice, null, t('feedbackRegion') + t(region)), dirty ? h(Notice, null, t('feedbackDraftConfig')) : null,
        h('section', { 'aria-label': t('feedbackLogSource'), style: sectionStyle() }, h('strong', null, t('feedbackLogSource')),
          h('div', { role: 'status' }, localReport ? t('feedbackLocalActive') : logLoading ? t('feedbackAutoLoading') : available ? t('feedbackAutoReady') : t('feedbackNoLogs')),
          h('div', { style: rowStyle }, h('button', { type: 'button', disabled: busy || logLoading, style: buttonStyle, onClick: useAutomaticLog }, t(localReport ? 'feedbackUseAuto' : 'feedbackRefresh'))),
          h('details', null, h('summary', { style: { cursor: 'pointer' } }, mark('optional'), t('feedbackReplaceLogs')),
            h(Notice, null, t('feedbackLocalNote')), h('input', { type: 'file', accept: '.json', disabled: busy, 'aria-label': t('feedbackReplaceLogs'), onChange: chooseLocalLog, style: { maxWidth: '100%', marginTop: 8 } }),
            localCandidate ? h('div', { style: { display: 'grid', gap: 8, marginTop: 12 } }, h(Notice, null, t('feedbackLocalPreview') + localCandidate.report.entries.length),
              h('pre', { style: { ...inputStyle(), maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' } }, feedbackKit.redact(JSON.stringify(feedbackKit.logs(localCandidate.report, false), null, 2))),
              !localCandidate.regionVerified ? h('label', { style: rowStyle }, h('input', { type: 'checkbox', checked: localConfirmed, onChange: e => setLocalConfirmed(e.target.checked) }), t('feedbackLocalConfirm')) : null,
              h('button', { type: 'button', disabled: busy || !localCandidate.regionVerified && !localConfirmed, style: buttonStyle, onClick: useLocalLog }, t('feedbackApplyLocal'))) : null),
          h('details', null, h('summary', { style: { cursor: 'pointer', overflowWrap: 'anywhere' } }, mark('recommended'), t('feedbackEvent'), ' · ', selectedEvent ? `${selectedEvent.model || '?'} / ${selectedEvent.errorCode || selectedEvent.state}` : t('feedbackEventNone')),
            h('div', { style: { display: 'grid', gap: 10, marginTop: 12 } },
              h('input', { type: 'search', value: eventSearch, 'aria-label': t('feedbackEventSearch'), placeholder: t('feedbackEventSearch'), onChange: e => setEventSearch(e.target.value), style: inputStyle() }),
              h('label', { style: rowStyle }, h('input', { type: 'checkbox', checked: showAllEvents, onChange: e => setShowAllEvents(e.target.checked) }), t('feedbackShowAll')),
              h('button', { type: 'button', disabled: busy, style: buttonStyle, onClick: () => selectEvent(null) }, t('feedbackEventNone')),
              h('ul', { 'aria-label': t('feedbackEvent'), style: { margin: 0, padding: 0, listStyle: 'none', maxHeight: 280, overflowY: 'auto', border: '1px solid var(--dsw-alias-border-primary, rgba(127,127,127,.4))', borderRadius: 8, background: 'var(--dsw-alias-background-primary, transparent)', color: 'var(--dsw-alias-label-primary, inherit)' } },
                ...visibleEvents.map(entry => h('li', { key: entry.id }, h('button', { type: 'button', disabled: busy, 'aria-pressed': selectedEvent?.id === entry.id, onClick: () => selectEvent(entry), style: { ...buttonStyle, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--dsw-alias-border-primary, rgba(127,127,127,.2))', width: '100%', textAlign: 'left', display: 'grid', gap: 4, whiteSpace: 'normal', overflowWrap: 'anywhere', color: 'var(--dsw-alias-label-primary, inherit)', background: selectedEvent?.id === entry.id ? 'rgba(59,130,246,.18)' : 'transparent' } },
                  h('span', null, `${entry.at ? new Date(entry.at).toLocaleString() : '?'} · ${entry.model || '?'} · ${entry.errorCode || entry.state}`), h('code', { style: { fontSize: 12 } }, entry.id)))),
                !visibleEvents.length ? h('li', { style: { padding: 12 } }, t('feedbackNoEvents')) : null))),
          logTools ? h('details', null, h('summary', { style: { cursor: 'pointer' } }, mark('optional'), t('feedbackLogTools')), h('div', { style: { display: 'grid', gap: 12, marginTop: 12 } }, h(Notice, null, t('feedbackLogToolsNote')), logTools)) : null),
        h('h4', { style: { margin: '12px 0 0' } }, mark('required'), t('feedbackTierrequired')),
        field('title'), field('actual', true),
        h('label', null, mark('required'), t('feedbackScreenshots'), h('input', { type: 'file', multiple: true, required: true, accept: 'image/png,image/jpeg,image/webp', disabled: busy, onChange: choosePictures, 'aria-label': t('feedbackScreenshots'), style: { display: 'block', maxWidth: '100%', marginTop: 8 } })), h(Notice, null, t('feedbackScreenshotNote')), h(Notice, null, t('feedbackPrivacy')),

        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 12 } }, ...pictures.map((item, i) => h('div', { key: item.url, style: sectionStyle() }, h('a', { href: item.url, target: '_blank', rel: 'noreferrer' }, h('img', { src: item.url, alt: `Context ${i + 1}`, style: { width: '100%', maxHeight: 260, objectFit: 'contain' } })), h('button', { type: 'button', disabled: busy, style: buttonStyle, onClick: () => { invalidate(); setPictures(old => old.filter(x => x !== item)); URL.revokeObjectURL(item.url); urls.current.delete(item.url) } }, t('feedbackRemove'))))),
        h('details', { style: sectionStyle() }, h('summary', { style: { cursor: 'pointer', fontWeight: 650 } }, mark('recommended'), t('feedbackTierrecommended')),
          h('div', { style: { display: 'grid', gap: 14, marginTop: 12 } }, ...['steps', 'expected', 'errorText', 'occurredAt', 'dshVersion', 'model', 'sessionId', 'diagnosticId', 'tool', 'context', 'frequency'].map(key => field(key, ['steps', 'expected', 'errorText', 'tool', 'context'].includes(key))))),
        h('details', { style: sectionStyle() }, h('summary', { style: { cursor: 'pointer', fontWeight: 650 } }, mark('optional'), t('feedbackTieroptional')),
          h('div', { style: { display: 'grid', gap: 14, marginTop: 12 } }, ...['missingReason', 'network', 'workaround'].map(key => field(key, true)),
        h('label', null, mark('optional'), t('feedbackAttachments'), h('input', { type: 'file', multiple: true, accept: '.txt,.md,.json,.log', disabled: busy, onChange: chooseAttachments, 'aria-label': t('feedbackAttachments'), style: { display: 'block', maxWidth: '100%', marginTop: 8 } })), h(Notice, null, t('feedbackAttachmentNote')),
        ...attachments.map((item, i) => h('div', { key: i }, h('details', null, h('summary', null, `context-${i + 1}.txt`), h('pre', { style: { ...inputStyle(), whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 240, overflow: 'auto' } }, feedbackKit.redact(item.text))), h('button', { type: 'button', disabled: busy, style: buttonStyle, onClick: () => { invalidate(); setAttachments(old => old.filter((_, j) => j !== i)) } }, t('feedbackRemove')))),
        mark('optional'), h(Notice, null, t('feedbackDetailNote')), h('label', { style: rowStyle }, h('input', { type: 'checkbox', checked: detailed, disabled: busy, onChange: e => { invalidate(); setDetailed(e.target.checked) } }), t('feedbackDetail')))),
        h('h4', { style: { margin: '12px 0 0' } }, t('feedbackReviewStep')),
        h('button', { type: 'button', disabled: busy, style: buttonStyle, onClick: prepare }, t(busy ? 'feedbackBusy' : 'feedbackPrepare')),
        message ? h('div', { role: 'status', 'aria-live': 'polite', style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' } }, message) : null,
        prepared ? h('section', { 'aria-label': t('feedbackPreview'), style: { ...sectionStyle(), minWidth: 0 } }, h('h4', null, t('feedbackPreview')), h(Notice, null, t('feedbackPreviewNote')),
          h('h4', null, t('feedbackGaps')), h('ul', null, ...prepared.gaps.map((gap, i) => h('li', { key: i, style: { overflowWrap: 'anywhere' } }, gap))),
          h('details', { open: true }, h('summary', null, t('feedbackFileList')), h('ul', { style: { paddingLeft: 20 } }, ...prepared.manifest.files.map(file => h('li', { key: file.path, style: { overflowWrap: 'anywhere', fontSize: 12 } }, `${file.path} · ${file.bytes} bytes · SHA256 ${file.sha256}`)))),
          ...prepared.files.filter(file => typeof file.data === 'string').map(file => h('details', { key: file.name }, h('summary', null, file.name), h('pre', { style: { ...inputStyle(), whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', overflow: 'auto', maxHeight: 320, fontSize: 12 } }, file.data))),
          h('label', { style: { display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 12 } }, h('input', { type: 'checkbox', checked: consent, disabled: busy, onChange: e => setConsent(e.target.checked) }), t('feedbackConsent')),
          h('button', { type: 'button', disabled: busy || !consent, style: { ...buttonStyle, marginTop: 12 }, onClick: download }, t('feedbackDownload'))) : null)
    }

    const groups = ['connection', 'models', 'accounts', 'usage', 'feedback', 'help']
    const iconPaths = {
      connection: 'M8 3v4m8-4v4M6 7h12v3a6 6 0 0 1-12 0V7m6 9v5',
      models: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
      accounts: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m8 .13a4 4 0 0 1 0 7.75',
      usage: 'M4 20h16M7 16V9m5 7V4m5 12v-5',
      feedback: 'M21 11a8 8 0 0 1-8 8H7l-4 3V9a7 7 0 0 1 7-7h3a8 8 0 0 1 8 9ZM8 8h8M8 12h5',
      diagnostics: 'M8 3h8l4 4v14H4V3h4m8 0v5h4M8 12h8m-8 4h5',
      help: 'M12 17h.01M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20'
    }
    function Icon({ kind = 'connection', size = 18 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }, h('path', { d: iconPaths[kind] }))
    }
    function SectionHeading({ kind, children }) {
      return h('h3', { style: { margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontSize: 16 } }, h(Icon, { kind }), children)
    }
    function SettingsSection({ active, group, children, style, ...props }) {
      return h('section', { ...props, hidden: active !== group, 'data-settings-group': group, style: { ...style, minWidth: 0, ...(active !== group ? { display: 'none' } : {}) } }, children)
    }
    function SettingsDetails({ active, group, ...props }) {
      return h('div', { hidden: active !== group, style: { display: active === group ? 'block' : 'none', minWidth: 0 } }, h('details', props))
    }
    function SettingsLauncher({ t, openPage, view }) {
      if (view === 'summary') return t('intro')
      return h('div', { style: { ...sectionStyle(), margin: 16 } }, h(Notice, null, t('pageEntryHint')),
        h('button', { type: 'button', style: buttonStyle, onClick: openPage }, t('openPage')))
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
      const [activeSection, setActiveSection] = React.useState('connection')
      React.useEffect(() => {
        if (!dirty && snapshot?.status === 'ready') setDraft({ ...snapshot.value })
      }, [snapshot?.status, snapshot?.revision, dirty])
      React.useEffect(() => {
        if (snapshot?.status !== 'ready') return
        const controller = new AbortController()
        const refresh = () => fetch(statusUrl, { signal: controller.signal, cache: 'no-store' })
          .then((response) => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
          .then((result) => { if (isStatus(result)) setStatus(result) }).catch(() => {})
        refresh()
        const timer = setInterval(refresh, action ? 1500 : 10000)
        return () => { clearInterval(timer); controller.abort() }
      }, [statusUrl, action, snapshot?.status])
      if (props.view === 'summary') return t('intro')
      if (snapshot?.status !== 'ready') return h('div', { style: { padding: 24, overflowY: 'auto', height: '100%', boxSizing: 'border-box' } }, h(Notice, null, t('feedbackReadOnly')), h(IssueFeedback, { t, region: props.region ?? 'cn', statusUrl, diagnosticsUrl: props.diagnosticsUrl ?? DIAGNOSTICS_PATH, config: {}, active: props.activeRegion !== false }))

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
          const response = await fetch(props.accountsUrl ?? ACCOUNTS_PATH, {
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
            anchor.download = `dsh-codebuddy-${props.region ?? 'cn'}-${name === 'exportLogs' ? 'basic' : 'detailed'}-${Date.now()}.json`
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
      const domesticResponseNote = (details) => {
        const reasons = { valid: 'parseValid', 'plain-text-fallback': 'parsePlainText', 'empty-result': 'parseEmpty', 'empty-content': 'parseEmpty', 'possibly-truncated-json': 'parseIncomplete', 'invalid-json': 'parseSyntax', 'ambiguous-json': 'parseAmbiguous', 'invalid-envelope': 'parseEnvelope', 'invalid-text-field': 'parseText', 'invalid-tool-calls-field': 'parseCalls', 'unknown-tool': 'parseUnknownTool', 'invalid-tool-arguments': 'parseArguments', 'invalid-tool-arguments-json': 'parseArguments' }
        return translate(t, 'responseDetail', {
          reason: reasons[details.reason] ? t(reasons[details.reason]) : details.reason,
          type: details.inputType, bytes: details.bytes ?? t('unknown'),
          normalized: details.normalizations?.length ? details.normalizations.join(', ') : t('noNormalization')
        })
      }
      const intlResponseNote = (details) => {
        const reasons = { valid: 'parseValid', 'plain-text-fallback': 'parsePlainText', 'empty-result': 'parseEmpty', 'empty-content': 'parseEmpty', 'possibly-truncated-json': 'parseIncomplete', 'native-structured-output-missing': 'parseOutputMissing', 'native-final-results': 'parseFinalCount', 'invalid-json': 'parseSyntax', 'ambiguous-json': 'parseAmbiguous', 'invalid-envelope': 'parseEnvelope', 'native-envelope': 'parseEnvelope', 'native-tool-envelope': 'parseCalls', 'invalid-text-field': 'parseText', 'invalid-tool-calls-field': 'parseCalls', 'unknown-tool': 'parseUnknownTool', 'invalid-tool-arguments': 'parseArguments', 'invalid-tool-arguments-json': 'parseArguments', 'native-result': 'parseNativeResult', 'cli-notice': 'parseNotice', 'cli-output-invalid': 'parseOutputInvalid', deadline: 'parseDeadline', 'error-frame': 'parseStreamError', 'permission-frame': 'parsePermissionFrame', 'result-before-init': 'parseResultBeforeInit', 'post-result-sequence': 'parsePostResult' }
        const valueTypes = { missing: 'factMissing', null: 'factNull', object: 'factObject', array: 'factArray', string: 'factString', number: 'factNumber', boolean: 'factBoolean', undefined: 'factUndefined' }
        const subtypeTypes = { missing: 'subtypeMissing', success: 'subtypeSuccess', error: 'subtypeError', other: 'subtypeOther' }
        const noticeClasses = { none: 'noticeNone', unclassified: 'noticeUnknown', 'context-limit': 'noticeContext', 'insufficient-balance': 'noticeBalance', authentication: 'noticeAuth', 'access-denied': 'noticeAccess', 'rate-limit': 'noticeRate', 'local-permission': 'noticeLocalPermission', network: 'noticeNetwork' }
        const noticeSources = { none: 'noticeNone', stderr: 'noticeSourceStderr', stdout: 'noticeSourceStdout', 'assistant-text': 'noticeSourceAssistant', 'error-frame': 'noticeSourceError', 'result-frame': 'noticeSourceResult', mixed: 'noticeSourceMixed' }
        const facts = details.hasStructuredOutput === undefined ? '' : translate(t, 'structuredFacts', {
          present: t(details.hasStructuredOutput ? 'factReported' : 'factMissing'),
          type: t(valueTypes[details.structuredOutputType] ?? 'unknown'),
          resultType: t(details.resultTypeValid ? 'factYes' : 'factNo'),
          subtype: t(subtypeTypes[details.finalSubtypeClass] ?? 'unknown')
        })
        const notice = details.noticeClass && details.noticeClass !== 'none' ? translate(t, 'noticeDetail', {
          classification: t(noticeClasses[details.noticeClass] ?? 'noticeUnknown'),
          source: t(noticeSources[details.noticeSource] ?? 'unknown')
        }) : ''
        return translate(t, 'responseDetail', {
          mode: details.outputMode === 'native-json-schema' ? t('nativeOutput') : t('unknown'),
          reason: reasons[details.reason] ? t(reasons[details.reason]) : details.reason,
          finals: details.finalResultCount ?? t('unknown'),
          type: details.inputType, bytes: details.bytes ?? t('unknown'),
          normalized: details.normalizations?.length ? details.normalizations.join(', ') : t('noNormalization'), facts, notice
        })
      }
      const intlProcessNote = (details) => {
        if (!details?.streamReason) return null
        const reasons = { none: 'streamReasonNone', 'json-parse': 'streamReasonJson', 'frame-shape': 'streamReasonShape', 'duplicate-init': 'streamReasonDuplicateInit', 'post-result-sequence': 'streamReasonPostResult', 'result-before-init': 'streamReasonResultBeforeInit', 'multiple-results': 'streamReasonMultiple', 'error-frame': 'streamReasonError', 'permission-frame': 'streamReasonPermission', 'missing-init': 'streamReasonMissingInit', 'missing-result': 'streamReasonMissingResult', 'nonzero-exit': 'streamReasonExit', deadline: 'streamReasonDeadline', cancelled: 'streamReasonCancelled', 'output-too-large': 'streamReasonTooLarge', 'spawn-error': 'streamReasonSpawn' }
        const phases = { 'await-init': 'streamPhaseAwait', 'after-init': 'streamPhaseInit', 'after-result': 'streamPhaseResult', draining: 'streamPhaseDrain', closed: 'streamPhaseClosed' }
        const stages = { none: 'parseStageNone', line: 'parseStageLine', tail: 'parseStageTail' }
        const frames = { none: 'frameNone', 'system-init': 'frameInit', system: 'frameSystem', assistant: 'frameAssistant', result: 'frameResult', error: 'frameError', 'control-request': 'frameControl', other: 'frameOther', malformed: 'frameMalformed' }
        const terminators = { none: 'terminatorNone', 'adapter-error': 'terminatorAdapter', 'adapter-drain': 'terminatorDrain', deadline: 'terminatorDeadline', 'external-cancel': 'terminatorCancel', 'child-error': 'terminatorChildError', 'natural-close': 'terminatorClose', 'spawn-error': 'terminatorSpawn' }
        return translate(t, 'streamDetail', {
          reason: t(reasons[details.streamReason] ?? 'unknown'), phase: t(phases[details.streamPhase] ?? 'unknown'),
          stage: t(stages[details.parseStage] ?? 'unknown'), index: details.frameIndex ?? 0, count: details.frameCount ?? 0,
          bytes: details.frameBytes ?? 0, inits: details.initCount ?? 0, results: details.resultCount ?? 0,
          frame: t(frames[details.lastFrameClass] ?? 'unknown'), terminator: t(terminators[details.terminationInitiator] ?? 'unknown'),
          closed: t(details.closeObserved ? 'factYes' : 'factNo'), deadline: t(details.deadlineReached ? 'factYes' : 'factNo')
        })
      }
      const responseNote = details => props.region === 'intl' ? intlResponseNote(details) : domesticResponseNote(details)
      const regionProcessNote = details => props.region === 'intl' ? intlProcessNote(details) : streamNote(details)
      const cliState = status?.cliCheck?.state === 'available'
        ? translate(t, 'cliAvailable', { version: status.cliCheck.version })
        : status?.cliCheck?.state === 'unavailable' ? translate(t, 'cliUnavailable', { code: status.cliCheck.code }) : t('notChecked')
      const readOnly = snapshot?.status !== 'ready' || snapshot?.writable !== true
      const setupState = status?.setup?.state
      const cellStyle = { padding: '10px 8px', borderBottom: '1px solid rgba(127,127,127,.2)', textAlign: 'left', verticalAlign: 'top' }

      return h('div', { style: { height: '100%', boxSizing: 'border-box', overflowY: 'auto', padding: 'var(--dsh-frame-top-clearance, 20px) clamp(16px, 3vw, 40px) 32px', color: 'var(--dsw-alias-label-primary, inherit)' } },
        h('div', { style: { display: 'grid', gap: 20, maxWidth: 1120, margin: '0 auto', minWidth: 0 } },
        h('header', { style: { display: 'grid', gap: 6 } }, h('h2', { style: { margin: 0 } }, t('title')), h(Notice, null, t('intro')),
          status?.pluginVersion ? h(Notice, null, translate(t, 'runtimeVersion', { version: status.pluginVersion, seconds: status.timeoutMs / 1000 })) : null),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 } },
          ...[['connection', cliState], ['models', String(models.length)], ['usage', String(status?.usage?.calls ?? 0)]].map(([group, value]) =>
            h('button', { key: group, type: 'button', onClick: () => setActiveSection(group), style: { ...buttonStyle, padding: 16, textAlign: 'left', display: 'grid', gap: 10, background: 'var(--dsw-alias-background-secondary, rgba(127,127,127,.06))' } },
              h('span', { style: { ...rowStyle, opacity: .8 } }, h(Icon, { kind: group }), t(group === 'connection' ? 'navconnection' : 'metric' + group)),
              h('strong', { style: { fontSize: group === 'connection' ? 14 : 24, overflowWrap: 'anywhere' } }, value)))),
        h('nav', { 'aria-label': t('pageSections'), style: { ...rowStyle, gap: 6, paddingBottom: 8, borderBottom: '1px solid rgba(127,127,127,.2)' } },
          ...groups.map(group => h('button', { key: group, type: 'button', 'aria-pressed': activeSection === group, onClick: () => setActiveSection(group), style: { ...buttonStyle, display: 'flex', alignItems: 'center', gap: 8, borderColor: activeSection === group ? '#3b82f6' : 'transparent', background: activeSection === group ? 'rgba(59,130,246,.12)' : 'transparent', fontWeight: activeSection === group ? 600 : 400 } }, h(Icon, { kind: group, size: 16 }), t('nav' + group)))),
        h(SettingsSection, { active: activeSection, group: 'connection', style: sectionStyle(), 'aria-label': t('quickSetup') },
          h(SectionHeading, { kind: 'connection' }, t('quickSetup')),
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
        status?.accounts ? h(SettingsSection, { active: activeSection, group: 'accounts', style: sectionStyle(), 'aria-label': t('accountsTitle') },
          h(SectionHeading, { kind: 'accounts' }, t('accountsTitle')),
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
              h(Notice, null, translate(t, 'accountUsage', { calls: account.usage?.calls || 0, input: account.usage?.inputTokens || 0, output: account.usage?.outputTokens || 0, cancelled: account.usage?.cancelledRequests || 0, offloads: account.usage?.imageOffloadRequests || 0, images: account.usage?.offloadImagesRequested || 0, history: account.usage?.historyOffloadedImages || 0 })),
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
        h(SettingsDetails, { active: activeSection, group: 'connection', style: { ...sectionStyle(), display: 'block' }, 'aria-label': t('settings') },
          h('summary', { style: { cursor: 'pointer', fontWeight: 600 } }, t('settings')),
          h('div', { style: { display: 'grid', gap: 12, marginTop: 14 } },
          textInput('cliPath'), textInput('configDir'),
          textInput('model', 'text', { list: `dsh-codebuddy-${props.region ?? 'cn'}-models`, placeholder: t('modelPlaceholder') }),
          h('datalist', { id: `dsh-codebuddy-${props.region ?? 'cn'}-models` }, ...models.map((item) => h('option', { key: item.id, value: item.id }, `${item.name}${item.multiplier !== null ? ` · ×${item.multiplier}` : ''}`))),
          h(Notice, null, t('modelNote')),
          label('effort', h('select', { value: draft.effort ?? '', onChange: (event) => edit('effort', event.target.value), style: inputStyle() },
            h('option', { value: '' }, t('followDefault')),
            ...efforts.map((item) => h('option', { key: item.id, value: item.id }, item.name)),
            draft.effort && !efforts.some((item) => item.id === draft.effort) ? h('option', { value: draft.effort }, draft.effort) : null)),
          textInput('timeoutMs', 'number'),
          h(Notice, null, t('timeoutHelp')),
          h('div', { style: rowStyle }, h('button', { type: 'button', disabled: busy || !!action || !dirty || readOnly, onClick: save, style: buttonStyle }, busy ? t('saving') : t('save'))),
          dirty ? h(Notice, null, t('saveFirst')) : null)),
        h(SettingsSection, { active: activeSection, group: 'models', style: sectionStyle(), 'aria-label': t('models') },
          h('div', { style: { ...rowStyle, justifyContent: 'space-between' } },
            h(SectionHeading, { kind: 'models' }, t('models')),
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
        h(SettingsSection, { active: activeSection, group: 'usage', style: sectionStyle(), 'aria-label': t('usage') },
          h(SectionHeading, { kind: 'usage' }, t('usage')),
          status?.usage ? h(React.Fragment, null,
            h('div', null, translate(t, 'usageTotals', { calls: status.usage.calls, input: status.usage.inputTokens, output: status.usage.outputTokens })),
            status.usage.uncachedInputTokens !== undefined ? h(Notice, null, translate(t, 'usageBreakdown', { uncached: status.usage.uncachedInputTokens, read: status.usage.cacheReadTokens, write: status.usage.cacheWriteTokens })) : null,
            lastCall ? h(Notice, null, lastCall.state === 'error' ? translate(t, 'lastFailed', { code: lastCall.errorCode ?? 'CLI_ERROR' })
              : translate(t, 'lastCall', { model: lastCall.model, time: formatTime(lastCall.at), input: lastCall.inputTokens ?? 0, output: lastCall.outputTokens ?? 0 })) : h(Notice, null, t('noUsage')),
            lastCall?.state === 'error' && lastCall.errorMessage ? h(Notice, null, lastCall.errorMessage) : null,
            lastCall?.id ? h(Notice, null, translate(t, 'diagnosticId', { id: lastCall.id })) : null,
            lastCall?.processDiagnostics ? h(Notice, null, translate(t, 'timeoutDetail', { seconds: Number.isFinite(lastCall.processDiagnostics.elapsedMs) ? (lastCall.processDiagnostics.elapsedMs / 1000).toFixed(2) : t('sizeUnknown'), stdout: sizeValue(lastCall.processDiagnostics.stdoutBytes), stderr: sizeValue(lastCall.processDiagnostics.stderrBytes) })) : null,
            (lastCall?.processDiagnostics?.channel === 'image-jsonl' || props.region === 'intl' && lastCall?.processDiagnostics?.streamReason) ? h(Notice, null, regionProcessNote(lastCall.processDiagnostics)) : null,
            lastCall?.responseDiagnostics?.structuredOutputType ? h(Notice, null, nativeNote(lastCall.responseDiagnostics)) : null,
            props.region !== 'intl' && lastCall?.responseDiagnostics?.noticeClass ? h(Notice, null, translate(t, 'noticeDetail', { kind: lastCall.responseDiagnostics.noticeClass, source: lastCall.responseDiagnostics.noticeSource ?? t('unknown') })) : null,
            lastCall?.responseDiagnostics ? h(Notice, null, responseNote(lastCall.responseDiagnostics)) : null,
            lastCall?.uncachedInputTokens !== undefined ? h(Notice, null, translate(t, 'usageBreakdown', { uncached: lastCall.uncachedInputTokens, read: lastCall.cacheReadTokens, write: lastCall.cacheWriteTokens })) : null,
            lastCall?.diagnostics?.promptBytes !== undefined ? h(Notice, null, translate(t, 'requestSize', { messages: sizeValue(lastCall.diagnostics.messageCount), tools: sizeValue(lastCall.diagnostics.toolCount), total: sizeValue(lastCall.diagnostics.promptBytes), system: sizeValue(lastCall.diagnostics.systemBytes), history: sizeValue(lastCall.diagnostics.messagesBytes), schemas: sizeValue(lastCall.diagnostics.toolsBytes) })) : null,
            lastCall?.diagnostics?.schemaBytes !== undefined ? h(Notice, null, translate(t, 'requestSizeExtra', { schema: sizeValue(lastCall.diagnostics.schemaBytes), overhead: sizeValue(lastCall.diagnostics.envelopeOverheadBytes), input: sizeValue(lastCall.diagnostics.cliInputBytes) })) : null,
            budgetNote(lastCall?.diagnostics) ? h(Notice, null, budgetNote(lastCall.diagnostics)) : null,
            Number.isFinite(lastCall?.durationMs) ? h(Notice, null, translate(t, 'requestTime', { seconds: (lastCall.durationMs / 1000).toFixed(2) })) : null,
            status.activeCalls > 0 ? h(Notice, null, translate(t, 'active', { count: status.activeCalls })) : null) : h(Notice, null, t('noUsage')),
          h(Notice, null, t('usageNote')),
          props.region === 'intl' && status?.usage ? h(Notice, null, translate(t, 'outcomeTotals', { cancelled: status.usage.cancelledRequests ?? 0, offloads: status.usage.imageOffloadRequests ?? 0, images: status.usage.offloadImagesRequested ?? 0, history: status.usage.historyOffloadedImages ?? 0 })) : null,
          status?.usage?.recentFailures?.length ? h('details', null,
            h('summary', { style: { cursor: 'pointer' } }, t('recentFailures')),
            ...status.usage.recentFailures.map((failure, index) => h('div', { key: index, style: { display: 'grid', gap: 6, marginTop: 12 } },
              h(Notice, null, `${formatTime(failure.at)} · ${failure.model} · ${failure.errorCode}`),
              h(Notice, null, failure.errorMessage),
              failure.id ? h(Notice, null, translate(t, 'diagnosticId', { id: failure.id })) : null,
              budgetNote(failure.diagnostics) ? h(Notice, null, budgetNote(failure.diagnostics)) : null,
              (failure.processDiagnostics?.channel === 'image-jsonl' || props.region === 'intl' && failure.processDiagnostics?.streamReason) ? h(Notice, null, regionProcessNote(failure.processDiagnostics)) : null,
              failure.responseDiagnostics?.structuredOutputType ? h(Notice, null, nativeNote(failure.responseDiagnostics)) : null,
              failure.responseDiagnostics ? h(Notice, null, responseNote(failure.responseDiagnostics)) : null))) : null),
        h(SettingsDetails, { active: activeSection, group: 'help', style: { ...sectionStyle(), display: 'block' }, 'aria-label': t('guideTitle'), open: lastCall?.state === 'error' || undefined },
          h('summary', { style: { cursor: 'pointer', fontWeight: 600 } }, t('guideTitle')),
          h('div', { style: { display: 'grid', gap: 12, marginTop: 14 } },
            h(Notice, null, t('guideIntro')),
            ...['guideMultiple', 'guideIncomplete', 'guideProgress', 'guideLiteral', 'guideAccess', 'guideLocalSize', 'guideSize', 'guideCliError', 'guideLogs'].map(key => h('div', { key },
              h('h4', { style: { margin: '0 0 6px' } }, t(`${key}Title`)), h(Notice, null, t(key)))),
            h('a', { href: t('guideFullUrl'), target: '_blank', rel: 'noreferrer' }, t('guideFull')))),
        h(SettingsSection, { active: activeSection, group: 'feedback', style: sectionStyle(), 'aria-label': t('feedbackTitle') },
          h(IssueFeedback, { t, region: props.region ?? 'cn', statusUrl, diagnosticsUrl: props.diagnosticsUrl ?? DIAGNOSTICS_PATH, config: value, dirty, active: activeSection === 'feedback' && props.activeRegion !== false, logTools: h(React.Fragment, null,
          h(SectionHeading, { kind: 'diagnostics' }, t('logsTitle')), h(Notice, null, t('logsNote')),
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
          h(Notice, null, t('logsHelp'))
          ) })),
        h(SettingsSection, { active: activeSection, group: 'usage', style: sectionStyle(), 'aria-label': t('balance') },
          h(SectionHeading, { kind: 'usage' }, t('balance')), h(Notice, null, t('balanceNote')),
          h('a', { href: status?.balance?.officialHome ?? props.officialHome ?? 'https://www.codebuddy.cn', target: '_blank', rel: 'noreferrer' }, t('openHome'))),
        h(Notice, null, t('toolNote'))))
    }

    const name = 'dsh-dkn-codebuddy-cli-client'
    const BUNDLE_NAME = 'dsh-dkn-codebuddy-cli'
    const inject = ['slots', 'locale', 'configForms', 'layout']
    function UnifiedSettingsPage({ regions, t }) {
      const [activeRegion, setActiveRegion] = React.useState('cn')
      return h('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 } },
        h('header', { style: { padding: '16px 24px', borderBottom: '1px solid rgba(127,127,127,.2)', display: 'grid', gap: 8 } },
          h('nav', { 'aria-label': t('regionPicker'), style: rowStyle },
            ...regions.map(region => h('button', { key: region.id, type: 'button', 'aria-pressed': activeRegion === region.id, onClick: () => setActiveRegion(region.id), style: { ...buttonStyle, background: activeRegion === region.id ? 'rgba(59,130,246,.15)' : 'transparent', borderColor: activeRegion === region.id ? '#3b82f6' : 'rgba(127,127,127,.3)' } }, t(region.id)))),
          h(Notice, null, t('regionNote'))),
        ...regions.map(region => h('div', { key: region.id, hidden: activeRegion !== region.id, 'data-region': region.id, style: { display: activeRegion === region.id ? 'block' : 'none', flex: 1, minHeight: 0 } }, h(CodeBuddySettingsPage, { ...region.props, activeRegion: activeRegion === region.id }))))
    }
    function apply(ctx) {
      const commonZh = { ...localeZh, ...feedbackZh, sidebarEntry: 'DKN CodeBuddy', pageEntryHint: '从左侧 CodeBuddy 打开统一配置页，在页内分别配置国内和国际通道。', channelUnavailable: '此通道配置尚未就绪或未启用，请检查插件组件状态。', regionPicker: '配置区域', cn: '国内版', intl: '国际版', regionNote: '此处切换只改变配置页面。对话使用哪个区域，取决于会话中选择的提供方；两侧分别登录和统计。' }
      const commonEn = { ...localeEn, ...feedbackEn, sidebarEntry: 'DKN CodeBuddy', pageEntryHint: 'Open CodeBuddy in the sidebar to configure China and International separately.', channelUnavailable: 'This channel is not ready or enabled. Check its plugin component.', regionPicker: 'Configuration region', cn: 'China', intl: 'International', regionNote: 'This changes the settings view only. Conversation providers determine routing. Each region has separate sign-in and usage.' }
      ctx.effect(() => ctx.locale.register('settings.codebuddy-cli', { zh: commonZh, en: commonEn }), 'codebuddy: common locales')
      const actionLabels = common => Object.fromEntries(['accountLabel', 'accountAdd', 'accountUse', 'accountLegacy', 'accountRemove', 'accountConfirmRemove', 'accountCancel', 'accountSelected', 'accountPrepare', 'accountsTitle'].map(key => [key, common[key]]))
      ctx.effect(() => ctx.locale.register('settings.codebuddy-cli-intl-unified', { zh: { ...commonZh, ...intlLocaleZh, ...actionLabels(commonZh), guideLocalSize: commonZh.guideLocalSize.replace('20 MiB', '24 MiB'), toolCoverageUrl: commonZh.toolCoverageUrl.replace('/docs/cn/', '/docs/intl/') }, en: { ...commonEn, ...intlLocaleEn, ...actionLabels(commonEn), guideLocalSize: commonEn.guideLocalSize.replace('20 MiB', '24 MiB'), toolCoverageUrl: commonEn.toolCoverageUrl.replace('/docs/cn/', '/docs/intl/') } }), 'codebuddy: international locales')
      const t = ctx.locale.bind('settings.codebuddy-cli')
      const regions = ['cn', 'intl'].map(id => ({ id, ns: 'llm-codebuddy-cli-' + id, props: {
        region: id, legacyForm: ctx.configForms.get('llm-codebuddy-cli-' + id),
        statusUrl: '/plugins/dsh-codebuddy-cli-' + id + '/status',
        actionUrl: '/plugins/dsh-codebuddy-cli-' + id + '/actions',
        diagnosticsUrl: '/plugins/dsh-codebuddy-cli-' + id + '/diagnostics',
        accountsUrl: '/plugins/dsh-codebuddy-cli-' + id + '/accounts',
        officialHome: id === 'cn' ? 'https://www.codebuddy.cn' : 'https://www.codebuddy.ai',
        t: id === 'cn' ? t : ctx.locale.bind('settings.codebuddy-cli-intl-unified')
      }}))
      const openPage = () => ctx.layout.selectPanel(PANEL_ID)
      ctx.effect(() => ctx.configForms.whileServed(regions.map(region => region.ns), () => {
        const disposers = [
          ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID, locale: 'settings.codebuddy-cli', inject: () => ({ regions, t }) }, UnifiedSettingsPage)),
          ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 20, label: () => t('sidebarEntry'), locale: 'settings.codebuddy-cli' }, Icon))
        ]
        return () => {
          if (ctx.layout.panelInfo.getSnapshot().activePanelId === PANEL_ID) ctx.layout.selectPanel(null)
          for (const dispose of disposers.reverse()) dispose()
        }
      }), 'codebuddy: unified page')
      for (const region of regions) ctx.effect(() => ctx.configForms.whileServed([region.ns], () => ctx.slots.inject('plugins.row.config', () => ctx.slots.register({
        name: 'plugins.row.config', key: `${BUNDLE_NAME}#${region.ns}`, locale: 'settings.codebuddy-cli', inject: () => ({ t, openPage })
      }, SettingsLauncher))), 'codebuddy: ' + region.id + ' entry')
    }
    Object.assign(exports, { BUNDLE_NAME, apply, inject, name, createFeedbackKit, IssueFeedback })
    return module.exports
  }
})

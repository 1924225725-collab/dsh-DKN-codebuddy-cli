# 更新记录 / Changelog

## 0.4.2（2026-10-28，仓库分发 / repository distribution）

- 将稳定的工具定义和响应 Schema 移到增长的 messages 历史之前，仅调整 JSON 封装键序。协议和系统指令、末尾 submission、消息／工具内容和顺序、图片索引、Schema、解析及账号和大小保护不变；工具／权限更新仍立即生效。
- 包含未单独上线的 0.4.1 尺寸诊断修正。第一轮复核确认：原超限症状、未匹配的通道拒绝／空输出、国际超时没有证据可宣称已根治；不通过延长时限、删历史或重试关闭案件。
- 六次官方 CLI 2.177.0 / DeepSeek V4.1 Flash 合成缓存 A/B 调用均得到有效结果。两组各后续两次输入合计均19,035 Token，缓存读取比例旧排布14.8%、新排布95.5%；两组采用不同合成标记隔离，文本尺寸相差128字节，非生产收益保证。另三次新排布工具提案、模拟成功／失败结果长回复、混合用户／工具图片验证通过。
- 合成传输验证未执行真实 DSH 业务工具或重放私人故障；附件服务用隔离实现。实际 DSH UI、多账号刷新／扣费归属、全部模型和上游缓存策略仍不在本次实测范围。缓存由官方服务决定，不保证固定比例。

- Move stable tool definitions and the response schema before growing history by changing envelope key order only. Retain protocol/system/submission instructions, full ordered messages/tools, image indices, native schema, parsing, account and request-size boundaries; tool/permission updates remain effective.
- Include the unpublished 0.4.1 diagnostic fixes without claiming to resolve the original oversize, unmatched channel/empty-output or International timeout incidents. Do not extend deadlines, discard history or add retries to close those cases.
- Six synthetic official CLI 2.177.0 / DeepSeek V4.1 Flash A/B calls returned valid results. The two subsequent calls per layout each totaled 19,035 input tokens: cache-read share was 14.8% before and 95.5% after. Different synthetic isolation markers produced a 128-byte text-size difference; this small observation is not a production guarantee. Three further candidate calls passed tool proposals, long summaries of simulated success/failure observations, and mixed user/tool-image checks.
- Live checks used synthetic data and an isolated attachment service, not real DSH business tools or private-session replay. Actual DSH UI, multi-account refresh/billing attribution and every model/upstream cache policy remain unverified. The official service controls cache hits.


## 0.4.1（2026-10-27，本地候选，已合入0.4.2 / local candidate, included in 0.4.2）

- 修正本地文字封装超限在抛错前丢失请求尺寸的问题；普通日志记录检查阶段、实际字节数、上限、系统／历史／工具／响应 Schema 与封装开销。最终 CLI 输入在 JSONL 转义和图片块编码后单独计量。
- 配置页展示超限事实和未记录的后续阶段，不再把尚未提交的封装文本称为已发送文本；新增双语说明，图片卸载不压缩文字历史。新字段经白名单持久化、恢复与导出，不包含请求正文或图片内容。
- 保留 12 MiB 文字封装、20 MiB 最终输入及既有图片／账号／工具协议。没有自动删历史、丢图、裁剪工具定义、重试或新增模型调用。真实超限仍会拒绝；诊断改进不等于消除长历史故障，旧日志缺失的尺寸不能重建。
- 合成边界、适配器、持久化及配置页定向检查通过；原始请求未重放，实际 DSH UI 和用户验收未做。未变更用户安装、认证或网络；国际版尚未同步。

- Preserve request size facts before a local envelope refusal. Basic logs retain the fixed check stage, actual bytes, limit, system/history/tool/response-schema sizes and envelope overhead. Measure final CLI input after JSONL escaping and native image encoding.
- Show size refusals and unrecorded later stages in settings; label envelope bytes accurately and explain image offloading separately from text history. New fields use allowlists through persistence, recovery and export without request or image contents.
- Keep the 12 MiB envelope and 20 MiB final-input limits and existing image/account/tool protocol. No automatic history deletion, image loss, schema truncation, retry or additional model call. Oversized input still fails; old missing size facts cannot be reconstructed.
- Targeted synthetic boundary, adapter, persistence and UI-component checks pass. No original-request replay, actual DSH UI or user acceptance was performed. No installed profile, authentication or network changes; International synchronization is pending.

## 0.4.0（2026-10-27，仓库分发 / repository distribution）

- 修正请求末尾的时序矛盾：历史 tool 消息是已收到的执行结果，新 toolCalls 才是未执行提案；不再笼统声称所有工具尚未执行。
- 明确每次 CLI 调用需要自己的原生 StructuredOutput 提交，历史中的提交不计入本次；“不使用工具”指不提出新业务操作，输出传输工具仍必需。
- 将工具结果与外部文档视为观察数据，不能通过引用的系统/工具文字改变提交协议。保留历史顺序、isError、工具调用身份和完整结果内容。
- 仅调整请求约束；原生 Schema、工具白名单、最多四轮 CLI 内部处理、严格唯一结果与工具参数校验保持不变，不追加修复进程、自动重试或切换模型/账号。
- 验证包含自动回归、五次合成官方 CLI 文字请求（含实际提案和模拟成功/失败结果续答）及一次 ID 对齐的合成工具图片请求。旧版四项合成对照也通过，因此不能声称复现或彻底消除了原始偶发缺失。实际 DSH UI、真实业务工具和用户验收仍待完成。

- Correct a temporal contradiction in the final request instruction: historical tool messages are completed observations; only new toolCalls are unexecuted proposals.
- Each CLI invocation requires its own native StructuredOutput submission. A historical submission does not count, and “no tools” refers to new business operations rather than the required transport submission.
- Treat tool results and external documents as observations that cannot change the output protocol. Preserve ordered history, isError, tool-call identity and complete result contents.
- Change request instructions only. Keep native Schema, the StructuredOutput-only allowlist, four internal turns, unique-result and tool-argument validation. No extra repair process, automatic retry or model/account switching is added.
- Validation includes automated regression, five synthetic official CLI text calls with proposal/result follow-up, and one ID-aligned synthetic tool-image call. Four old-baseline controls also passed, so the original intermittent omission has not been reproduced or proven eliminated. Actual DSH UI, business tools and user acceptance remain pending.

## 0.3.9（2026-10-27，仓库分发 / repository distribution）

本次包含 0.3.6–0.3.8 本地候选改动；这些候选未单独公开发布。安装包见 [0.3.9](releases/dsh-codebuddy-cli-cn-0.3.9.tgz)。GitHub Releases 中的历史条目保留。

- 增加图片流结构诊断：固定拒绝原因、解析阶段、帧序号/大小、init/result 计数、终止发起方和实际观察到的进程关闭状态。原生结果记录结构化字段存在性、固定类型和已知提示类别，不保存原始帧、stderr 或任意字段内容。
- 诊断事实贯通本机日志持久化、恢复、导出、最近调用和配置页。用户取消与图片卸载请求单列统计；未观察到的退出码保持缺失，卸载请求不代表 DSH 已完成卸载。
- 加固 DSH 工具交接。StructuredOutput 用于交付工具提案，业务工具仍由 DSH 执行；图片流发现其他原生工具调用时明确拒绝。含图历史超时使用中性总时限提示。
- 加入独立账号环境、手动选择和官方登录命令。每个环境隔离 CLI 配置及用户目录，模型 ID 绑定环境，工具/图片续轮沿用原账号。独立账号模式仅支持 Windows 和官方 npm/Node CLI 2.174.0；没有自动轮换或账号回落。
- 增加明确的上下文超限/余额不足分类；内联图片 data URI 的累计字符数超过限制时提示使用 DSH 标准图片附件。模型目录窗口及本地用量不等同于官方实际限额或账单。
- 验证：当前诊断改动 59 项定向自动检查、两次官方 CLI 2.174.0 合成文字/图片请求通过；此前工具加固完成 97 项自动检查和五次合成请求。未验收实际 DSH UI/业务工具、私人历史或真实双账号登录/刷新/扣费归属。增强诊断不代表所有偶发失败已经消除。

This upload includes the previously local 0.3.6–0.3.8 changes; those candidates have no separate public release.

- Add bounded structural/process diagnostics across image streams, native results, local persistence, export and settings. Retain fixed classifications and numeric facts rather than raw frames, stderr or arbitrary payloads.
- Count cancellations and DSH image-offload requests separately. An offload request is not proof of completion; unobserved exit codes remain absent.
- Harden DSH tool handoff and reject unexpected native CLI tools. Image-history timeouts use a neutral total-deadline message.
- Add manually selected isolated account environments with official sign-in commands and account-bound model IDs. Isolated mode supports Windows and official npm/Node CLI 2.174.0 only; there is no automatic rotation or account fallback.
- Add explicit context-limit/insufficient-balance classifications and an aggregate inline-image URI character limit. Local usage counters and catalog windows are not official billing or guaranteed request limits.
- Validation: 59 targeted diagnostics checks and two synthetic official CLI 2.174.0 text/image calls passed; earlier tool hardening passed 97 automated checks and five synthetic calls. Actual DSH UI/business tools, private-history replay, real two-account sign-in, refresh and billing attribution remain unverified. This does not claim to eliminate every intermittent failure.

## [0.3.5](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.3.5)

- 识别 CLI 已知 ECONNRESET 与 TLS 建连失败提示，使用固定 CLI_NETWORK_ERROR，覆盖空标准输出且退出码为 0 的情况。
- 保留诊断 ID、耗时、输出字节和退出码，不暴露原始标准错误、地址或凭据；文字与图片共用分类，不自动重试。
- 不改变合法结果、未知空输出、登录/权限分类、超时或工具行为；更新配置页与中英使用指南。
- Recognize fixed CLI connection-reset/TLS failures with CLI_NETWORK_ERROR, including empty stdout and exit 0. Keep safe diagnostics and identifiers without raw stderr or credentials.
- Cover text and image failures without retries, model switching, parser fallback or changes to valid results and existing authentication/permission handling.
- 验证 / Validation: 82 automated checks passed with synthetic failures and existing regression coverage. No live model call was made; network recovery is not claimed.

## [0.3.4](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.3.4)

- 接入 DSH 工具结果中的标准图片附件，覆盖桌面/窗口/区域/浏览器截图、图片读取及其他工具图片，不按工具名设置白名单。
- 保留工具调用 ID、失败标记、文字和图片次序；没有调用 ID 的工具图片明确拒绝。用户图和工具图共用预算与卸载，含图片失败不采集原文。
- 识别官方 CLI 的 error 帧，安全归类鉴权、本机权限或通用错误，不交付其后的结果；更新日志版本标记。
- 配置页和中英文档加入工具适配范围；原生音视频、二进制文档和模型原生图片生成未适配。
- Accept standard DSH tool image results without a tool-name allowlist. Preserve tool call identity, error flags, adjacent text and image order; reject detached tool images.
- Share upload/tool-image budgets, durable offloading and privacy protections. Classify CLI error frames safely and correct the log version marker. Add bilingual tool compatibility documentation and its settings link.
- 验证 / Validation: 79 automated checks and three official CLI 2.174.0 / deepseek-v4.1-flash calls passed with synthetic tool images. Attachment service was isolated; no real desktop was captured or actual business tool executed. Actual DSH capture-tool UI flows and all-model coverage remain unverified.

## [0.3.3](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.3.3)

- 修复 DSH 0.2.1-rc.3 对旧版精确 rc.2 依赖的兼容性拦截。engines.dsh 与六项 DSH peer 依赖均明确列出 0.2.1-rc.2、0.2.1-rc.3，不放宽到未经核查的未来版本。
- 对比六项官方 npm 发布包：LLM、附件、渲染、设置和本地化运行文件一致；插件管理页新增导航入口，不影响现有配置页注册。
- 模型、图片、工具、用量和日志运行代码不变；不需要版本豁免，不覆盖旧安装包。
- Fix DSH 0.2.1-rc.3 rejecting the previous exact rc.2 requirements. Declare both reviewed runtimes in engines.dsh and all six DSH peers without claiming future versions.
- Compare six official npm packages. The LLM, attachment, renderer, settings and locale runtime files are identical; the plugin-manager addition does not affect this adapter's configuration registration.
- Keep model/image/tool/usage/logging runtime code unchanged. No version exemption is required and old packages are preserved.
- 验证 / Validation: 74 existing automated checks and official DSH compatibility preflight checks. No new live model call or actual DSH upload-UI validation in this metadata-only update.

## [0.3.2](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.3.2)

- 新增用户图片提问与历史追问：从 DSH 附件服务读取图片，使用官方 stream-json 原生 image 输入，保留原生 Schema 输出。
- 模型目录增加图片能力标记，未知或未声明能力的路由不接收图片；纯文字调用保留原路径。
- 多图通过索引关联历史消息；最多保留 5 张请求图片，每张转换后 ≤2 MiB、最长边 ≤1920，Base64 合计 ≤8 MiB，文字与图片总请求 ≤20 MiB。超预算通过 DSH 的持久图片卸载机制处理，不静默丢图。
- 图片流支持总超时、取消、严格 JSONL 与唯一终态检查；业务工具仍由 DSH 执行。
- 含图片历史的调用禁用失败原文采集，普通日志仅记录图片数量与字节统计。更新中英配置说明、使用指南和安装教程。
- Add user image questions and history follow-ups through DSH attachments and official native image blocks in stream-json, retaining native Schema output.
- Show catalog-declared image capability; reject images for unknown/undeclared routes and preserve the existing text-only transport.
- Associate images with history by index. Retain up to 5 request images, each converted to ≤2 MiB and longest edge ≤1920; combined Base64 ≤8 MiB, total text/image request ≤20 MiB. Request durable DSH image offloading rather than silently dropping history.
- Bound image streams with cancellation, deadlines, strict JSONL and unique-terminal validation. DSH continues to execute business tools.
- Disable raw failure capture for calls containing image history. Basic logs retain counts/byte totals only. Update bilingual settings, guides and installation instructions.
- 验证 / Validation: This release passed 74 automated checks and six synthetic official CLI image calls through the new adapter: PNG single image, follow-up, two-image order, tool proposal, summary after a simulated tool result and a JPEG check. China-region live tests used deepseek-v4.1-flash and CLI 2.173.0 with an isolated attachment-service test double. No real DSH business tool ran; DSH upload-UI manual end-to-end validation and every-model coverage remain outstanding. Official structured processing may involve internal model turns; official usage applies.

## [0.3.1](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.3.1)

- 改用官方 --json-schema，只开放 StructuredOutput 输出工具，直接读取 structured_output 对象，退出普通文字 JSON 候选扫描路径。
- 原生结果缺失、字符串/包装结果、不合法字段或多个最终记录明确失败，不静默回退、不选择最后一份。
- 保留 DSH 工具名与对象参数检查；单一计划内的重复操作不删除，工具执行继续由 DSH 管理。
- 保留取消、总超时、日志隐私和诊断 ID；原生校验失败也保留进程统计。更新配置页及中英故障指南。
- 结构化处理允许有限 CLI 内部轮次；插件不额外启动 CLI 做修复，官方内部处理仍可能消耗多轮额度。
- Use official --json-schema with only the StructuredOutput output tool enabled; read the structured_output object instead of scanning prose for JSON candidates.
- Reject missing native output, string/wrapper envelopes, invalid fields and multiple final records without prose fallback or arbitrary last-result selection.
- Retain DSH tool-name/object-argument validation and repeated operations within one plan. DSH continues to execute business tools.
- Preserve cancellation, total deadlines, diagnostic IDs and log privacy. Native validation failures retain process diagnostics. Update bilingual in-settings and full troubleshooting guides.
- Allow bounded CLI internal turns for structured processing. The adapter starts no extra CLI repair process; official processing can still consume multiple internal model turns.
- 验证 / Validation: 60 automated checks and three synthetic official CLI calls through the new adapter passed. No real DSH business tool ran; not every model was tested.

## [0.3.0](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.3.0)

- 仅当多个完整协议对象交付的文字及有序工具名称/参数完全一致时，恢复为一份结果；不合并冲突计划，不删除同一计划中的重复工具。
- 合入 0.2.10 本地候选版的文字转义恢复：仅限完整对象、恰好 text 与空 toolCalls 两字段，不补全缺失结构、不恢复工具参数。
- 用户主动取消任务不再消耗“一次失败回复采集”；普通日志标记重复候选数量。
- 配置页增加中英故障处理指南，说明多结果冲突、长回复、工具已执行后的失败、字面转义和日志隐私。
- 加强单一最终结果及转义说明；保留全部既有结构、工具、鉴权和日志回归检查。
- Recover repeated complete envelopes only when their delivered text and ordered tool names/arguments are identical. Never merge conflicting plans or remove repeated calls within a plan.
- Include the unpublished 0.2.10 candidate: bounded text escape recovery only for complete objects containing exactly text and empty toolCalls; no invented structure or tool-argument repair.
- User cancellation preserves armed failure capture. Basic logs count duplicate candidates. Add bilingual in-settings troubleshooting and reinforce final-result/escaping instructions.
- Validation: 55 automated checks passed and two synthetic official CLI requests succeeded. Recovery boundaries are covered by deterministic tests; these checks do not guarantee every model reply or device.

## [0.2.9](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.2.9)

- 对括号完整、无协议字段且不含已声明工具名的损坏 JSON 示例，作为无工具文字交付；协议形状或未闭合内容仍拦截。
- Deliver balanced malformed JSON examples as plain text only when they have no protocol fields or declared tool names; reject protocol-shaped and incomplete content.

## [0.2.8](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.2.8)

- 完善普通文字、JSON 示例和方括号标记的无工具回退；保留未闭合尾部检查，不把截断内容当完整结果。
- 普通日志增加扫描完整性、字符串状态和容器深度，不记录正文。
- Improve text-only fallback for prose, examples and bracketed markers while retaining incomplete-tail rejection. Add content-free scan/string/depth diagnostics.

## [0.2.7](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.2.7)

- 修复 DSH 错误分类丢失；显示机器错误码和可关联日志的 diagnostic-id。
- 保留工具结果 isError，完善权限/先读后改说明；及时释放完成请求计数，拒绝空白无工具结果。
- Preserve DSH error codes and diagnostic IDs, tool-result isError flags, and permission/read-before-edit instructions. Release completed request counts promptly; reject blank tool-free results.

## [0.2.6](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.2.6)

- 识别标准错误中的固定鉴权/权限/限流提示，即使 stdout 为空且退出码为零，也不再一律误报 JSON 无效。
- 区分空输出与非 JSON，记录输出字节数、耗时和退出码；鉴权错误显示官方登录指引。
- Recognize fixed auth/permission/rate-limit notices, including empty stdout with zero exit status. Distinguish empty/non-JSON output, log numeric process diagnostics and show official sign-in guidance.

## [0.2.5](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.2.5)

- 增加本机持久化日志、查看/导出/清空与默认关闭的一次失败原文采集；普通导出不含原文，不自动上传。
- 逐个验证片段，允许唯一有效结果旁的明确无关完整示例；冲突与疑似工具片段继续拒绝。
- Add local persistent diagnostics, view/export/clear, and opt-in one-failure raw-result capture. Basic exports omit raw text; no automatic uploads. Validate fragments independently and accept a unique valid result beside clearly unrelated complete examples.

## [0.2.4](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.2.4)

- 支持明确的完整 JSON 包装、二次编码及纯文字/纯工具结构，增加不含正文的分类诊断和最近失败摘要。
- 补充长回复、结构异常及完整工具往返的自动回归；冲突/缺失结构不猜测、不自动重试。
- Recognize complete wrappers, encoded JSON and unambiguous text/tool-only structures. Add content-free diagnostics and regression coverage for long replies, malformed output and tool continuation, without guessing conflicts or missing content.

## [0.2.3](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/tag/v0.2.3)

- 使用提示词描述输出协议并在本地验证，取消 CLI 原生 --json-schema 处理，不自动追加修复请求。
- Describe the response protocol in the prompt and validate locally instead of native --json-schema processing; no automatic repair request.

## 0.2.2

- 区分版本检查与模型请求；显示运行版本与超时诊断；超时及时返回。
- Distinguish executable checks from model calls; show running version and timeout diagnostics; settle deadlines promptly.

## 0.2.1

- 修复缓存重复计数；减少重复工具定义；区分累计与单次用量；按完整内容块返回。
- Fix duplicate cache accounting, remove duplicate tool definitions, separate cumulative and last-call usage, and return complete content blocks.

## 0.2.0

- 增加 ACP 模型/倍率同步、一键配置、官方登录命令和当前用户路径检测。
- Add ACP model/rate discovery, one-click setup, official sign-in commands and current-user path detection.

## 0.1.x

- 实现模型提供方、无头调用、配置页及 Windows 启动适配。
- Initial model provider, headless calls, settings page and Windows launch support.

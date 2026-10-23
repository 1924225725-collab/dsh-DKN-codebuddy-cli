# 更新记录 / Changelog

历史版本现补齐 GitHub Releases，原安装包不变。0.2.10 仅为本地候选，改动合入 0.3.0，未单独公开发布。

Historical GitHub Releases are backfilled with the unchanged packages. The local 0.2.10 candidate is included in 0.3.0 and has no separate public release.

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

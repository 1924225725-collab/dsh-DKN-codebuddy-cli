# 更新记录 / Changelog

## 0.2.9

- 根据 0.2.8 用户测试日志，新增对语法错误但括号完整、且不含协议字段或已声明工具名的 JSON 示例/片段的纯文本回退；不推断工具，也不吞掉不完整结构。
- 协议形状的损坏 JSON、未闭合内容和多个有效结果仍明确失败，避免把工具请求误当普通文字。
- 新增覆盖该边界的回归测试并更新中英测试手册与测试素材包。0.2.8 的原始模型回复未被采集，因此仍需按 T06 复测确认真实样本。
- Based on the 0.2.8 user-test log, balanced but syntactically invalid JSON examples/fragments fall back to plain text only when they contain no protocol fields or declared tool names. No tools are inferred and incomplete structures are not discarded.
- Malformed protocol-shaped JSON, incomplete content and multiple valid results still fail. Regression tests and the bilingual manual/test kit are updated; the original 0.2.8 model reply was not captured, so retest T06 to confirm that exact case.

## 0.2.8

- 将 CLI 返回的无分隔符纯文本作为最终文字交给 DSH，不据此推断或执行工具调用。
- 不丢弃未闭合 JSON 尾部；带结构但未闭合、损坏或多个协议结果仍拒绝，防止把半截回复当作完整答复。
- 仅含普通文字、JSON 示例或方括号标记且没有协议结果时，作为无工具纯文字交付。
- 普通日志新增 JSON 扫描状态、开放容器深度和字符串状态，不保存响应正文。
- 更新中英测试手册与可移植素材包：明确把素材文件夹本身设为 DSH 工作区；ACL 错误标记阻塞并停止，不建议修改权限。
- 使用 `feedback.md` 与普通诊断日志 JSON 作为常规反馈；详细原始回复仍需用户主动开启并检查。
- The two source incidents had no raw samples; this release improves plain-text handling and diagnostics but cannot claim those exact historical replies are fixed.

## 0.2.7

- 修复 DSH 将外部 Error 归为 UNKNOWN；保留机器错误码及诊断 ID，与持久化日志逐条关联。
- Preserve DSH failure codes and diagnostic IDs instead of UNKNOWN, correlating failures with persisted records.
- 保留工具结果的 isError 标记，补充遵守权限及先读后改的模型说明；不改变 DSH 权限策略。
- Preserve tool-result isError flags and describe DSH permission/read-before-edit requirements without changing enforcement.
- CLI 完成后即释放活动计数，消费端暂停读取不再使已完成请求滞留；空白且无工具的结果明确报错。
- Release active counts when CLI processing completes, even for paused consumers; reject blank replies without tools.
- 增加中英 20 步测试手册、独立测试素材和反馈表。
- Add bilingual 20-step test manuals, isolated fixtures and a feedback form.

## 0.2.6

- 修复 CLI 在标准错误报告 401、标准输出为空且退出码为 0 时，被误报为无效 JSON 的问题；显示 `CLI_AUTH_REQUIRED` 和官方重新登录步骤。
- Recognize CLI authentication notices on stderr even when stdout is empty and exit status is zero, reporting `CLI_AUTH_REQUIRED` with official sign-in guidance.
- 区分空输出、非 JSON、部分明确的权限/限流错误；日志增加进程字节数、耗时和退出码，不保存 CLI 原始诊断输出。
- Distinguish empty/non-JSON output and fixed permission/rate-limit notices; log numeric process diagnostics and exit codes without raw CLI diagnostic output.
- 登录鉴权失败时展开官方登录说明；不读取、替换或自动刷新登录凭据，不自动重试请求。
- Expand official sign-in instructions on authentication failure, without reading/replacing credentials or automatic retries.

## 0.2.5

- 配置页增加普通日志查看、导出与清空；本机持久化最近 100 次调用，主文件上限 2 MiB。
- Add settings controls to view, export and clear local logs, retaining up to 100 calls across restarts in a main file capped at 2 MiB.
- 增加默认关闭的一次失败回复采集、隐私提示、详细预览和独立导出；不采集请求、CLI 标准错误或登录文件，不自动上传。
- Add opt-in one-failure reply capture, a privacy notice, detailed preview and separate export, excluding requests, CLI stderr and login files; no automatic uploads.
- 多片段逐个验证，仅恢复唯一有效结果与无关说明/示例；保留冲突、疑似工具请求和损坏片段的拒绝行为。
- Validate fragments independently; recover only one valid result beside unrelated annotations/examples, rejecting conflicts, possible tool requests and malformed fragments.
- 增加无正文的候选结构摘要、日志隐私/限额/重启恢复、导出与完整适配流程测试。
- Add content-free fragment summaries and regression coverage for privacy, limits, restart recovery, exports and the full adapter flow.

## 0.2.4

- 兼容可明确识别的完整 JSON 包装、二次编码及纯文字/纯工具结构。
- Normalize recognized complete JSON wrappers, encoded JSON and unambiguous text/tool-only replies.
- 增加不含正文的分类诊断和内存中最近 5 条失败摘要；成功调用不会覆盖失败历史。
- Add content-free diagnostic categories and five in-memory failure summaries that survive later successful calls.
- 未闭合、多个冲突结果、未知工具与不完整参数仍失败，不猜测补全、不自动重试。
- Reject incomplete/ambiguous output, unknown tools and invalid arguments without invented content or automatic retries.
- 增加长回复、异常结构、完整工具往返和失败无部分交付的回归测试。
- Add long-output, malformed-response and adapter/tool-continuation regression coverage, including no partial delivery on failure.

## 0.2.3

- 取消 CLI 原生 `--json-schema`，在提示词中描述协议，在本地检查最终结果；不自动追加修复请求。
- Replace native JSON Schema processing with a prompt-described protocol and local result validation, without automatic repair calls.
- 验证普通回复、合成工具请求与工具结果后的继续回复。
- Validate normal replies, synthetic tool requests and continuation after synthetic tool results.

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

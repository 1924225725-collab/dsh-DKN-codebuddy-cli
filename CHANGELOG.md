# 更新记录 / Changelog

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

# 更新记录 / Changelog

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

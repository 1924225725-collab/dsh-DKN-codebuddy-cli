# 国内版 0.2.9 测试反馈 / Test feedback

测试日期与时区 / Date and timezone：
实际运行插件版本 / Running plugin version：
DSH 版本 / DSH version：
CLI 版本 / CLI version：
操作系统 / OS：
模型 ID、推理强度 / Model ID, effort：
超时设置 / Timeout：
测试工作区路径 / Test workspace：
是否确认 DSH 选择的正是素材文件夹 / DSH workspace matches test kit：
资源管理器能看到 input.txt / input.txt visible in Explorer：
是否遇到 grantWrite / ACL 错误 / ACL error：
是否新对话 / Fresh conversation：
会话 ID / Session ID：
是否还有其他任务运行 / Other tasks active：

结果填写：通过 Pass / 失败 Fail / 未触发 Not triggered / 跳过 Skipped / 环境阻塞 Environment blocked。

| 编号 / ID | 结果 / Result | 现象、诊断 ID、附件 / Notes, diagnostic ID, attachments |
| --- | --- | --- |
| T01 版本 / Version | | |
| T02 CLI 检查 / Executable | | |
| T03 登录 / Sign-in | | |
| T04 短回复 / Short reply | | |
| T05 多轮 / History | | |
| T06 特殊字符 / Syntax | | |
| T07 长回复 / Long reply | | |
| T08 读取 / Read | | |
| T09 创建 / Write | | |
| T10 编辑 / Edit | | |
| T11 运行检查 / Run/check | | |
| T12 工具失败 / Tool failure | | |
| T13 工具往返 / Tool cycle | | |
| T14 停止计数 / Cancel/count | | |
| T15 超时 / Timeout | | |
| T16 模型 / Models | | |
| T17 普通日志 / Basic logs | | |
| T18 详细采集 / Capture | | |
| T19 重启 / Restart | | |
| T20 清空 / Clear | | |

## 单个失败详单 / One failure

测试编号 / Test ID：
操作时间 / Time：
操作步骤与完整输入 / Steps and exact input：
预期结果 / Expected：
实际结果与完整报错 / Actual and full error：
诊断 ID / Diagnostic ID：
重复次数 / Frequency（例如 3 次中 2 次失败 / e.g. 2 failures in 3 tries）：
是否有工具执行、是否重复写入 / Tools executed, repeated writes：
文件实际内容与退出码 / Actual file contents and exit code：
附件文件名 / Attachments：
已检查日志不含私人内容 / Logs reviewed for private content：

请附配置页导出的普通日志 JSON。详细样本仅在普通日志不足以定位时采集，并在检查、移除敏感信息后分享。不要附密码、Cookie 或 Token。出现 SetNamedSecurityInfoW / grantWrite / ACL 错误时停止文件测试，标记环境阻塞，不修改权限。

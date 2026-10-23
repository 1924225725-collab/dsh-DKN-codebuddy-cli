# CN 0.2.9 manual-test fixtures / 手工测试素材

将整个 `dsh-codebuddy-cli-cn-0.2.9-test-kit` 文件夹作为独立 DSH 工作区。先确认 DSH 选中的路径正是该目录，且其中直接包含 input.txt、calc.mjs、README.md、feedback.md。不要把素材只放在一个文件夹里，却让 DSH 使用另一个工作区；也不要在真实项目中测试。

Expected: input marker CN029-A, numbers 2 and 3; `node calc.mjs 2 3` prints `5`. The script does not access files or the network. Run tests only in this folder. Keep logs/screenshots here and complete feedback.md. If DSH reports `SetNamedSecurityInfoW`, `grantWrite` or another ACL error, stop file tests and mark them environment-blocked. Do not change permissions or ownership.

For the easiest feedback, fill only the cases you ran in `feedback.md` and attach it with the plugin settings page's exported basic diagnostics JSON; you do not need to paste the full conversation. If attachments are inconvenient, send the test ID, full error, diagnostic ID, time, result and whether the test folder was the active DSH workspace. Detailed samples are optional and may contain private reply content; review them before sharing.

手册：https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/blob/main/docs/测试手册.md

English: https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/blob/main/docs/TESTING.en.md

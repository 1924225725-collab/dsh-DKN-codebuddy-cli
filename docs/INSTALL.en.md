# Installation and usage

[简体中文](安装教程.md) · **English** · [Home](../README.en.md)

For version **0.4.2**.

## 1. Download and install

[Version package](../releases/dsh-codebuddy-cli-cn-0.4.2.tgz). Save it locally, or use the delivered local `dsh-codebuddy-cli-cn-0.4.2.tgz`. Historical formal releases remain in [GitHub Releases](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases); use the version-package link above for this build. The source ZIP is not an installable DSH plugin package.

Open DSH's Plugins page and select the local `.tgz` through its package installation entry. If it asks for a path, use the real downloaded file path, not a web URL. Exact button names can vary by DSH version.

Find **`dsh-codebuddy-cli-cn`**, open component **`llm-codebuddy-cli-cn`**, and check that the settings page reports running version **0.4.2**. Restart DSH if it still shows an older version.

## 2. Set up the CLI and sign in

![Settings component with example state; Chinese UI shown](images/ui-setup.png)

Click **Set up CLI**. The plugin looks for a working installation, otherwise tries the official installer and, if needed, the official npm package in a user-specific directory. If automatic setup fails, use the official installation guide linked in settings, then check again.

Expand **Sign in or switch account**, copy the generated command into PowerShell or Terminal, and follow the official CLI's China-region sign-in flow. Return to DSH afterward.

Use the command generated for your computer, not the author's path. The official CLI stores and uses credentials; the plugin does not ask you to paste a token, cookie or password. Use the official CLI's account management flow to switch accounts.

**Check CLI executable** only runs the version command. It does not verify sign-in, networking or a model response.

## 3. Select a model

![Catalog example with fictional models and multipliers](images/ui-models.png)

Click **Refresh models and rates**. The page displays the catalog returned by the current CLI, including available rates, reasoning options and context information. It refreshes every 15 minutes or on demand.

Select a discovered model in the **DSH conversation model selector**. The settings page's default model ID is only a fallback when a request does not specify a model; it can usually stay blank. Test a short prompt in a new conversation first.

For a tool check in a dedicated demo directory, try:

> Read the README in the current demo directory and summarize it. Do not modify files unless I ask.

Tools follow DSH's permissions and approval flow. Catalog visibility alone does not prove model access for your account.

## 4. Read usage correctly

Cumulative and last-call tokens are separate. Input includes system instructions, history, tool definitions, caches and CLI overhead. It is not the length of your latest question, and request bytes are not tokens. Native structured processing allows bounded internal turns; one CLI call may include multiple model requests and their usage.

Rates come from the current catalog. Check remaining credits on the official CodeBuddy website under Profile → Plan and Usage. Local counters reset when DSH restarts.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| No settings page | Find the plugin and component IDs above; confirm installation and restart DSH. |
| Invalid package or missing path | Select the downloaded local `.tgz`, not a source ZIP, website link or nonexistent file. |
| `CLI_NOT_FOUND` | Run setup, or save the actual local CLI path in advanced settings after official installation. |
| Version check passes but calls fail | Confirm official CLI sign-in, refresh the catalog and try a short prompt in a new conversation. |
| `CLI_AUTH_REQUIRED` / 401 | Copy the settings sign-in command into PowerShell, then run `/login` inside the official CLI and refresh models. Updating the plugin cannot restore account authorization. |
| 180-second timeout | Confirm running version 0.4.2, stop the task and test a short prompt. Inspect error code, elapsed time and output byte counts. Complex tasks may need 300000–600000 ms; a longer deadline cannot fix sign-in or network faults. |
| Missing or invalid native output | Verify running 0.4.2 and CLI/model structured-output support. CLI_STRUCTURED_OUTPUT_MISSING has no prose fallback; multiple final records are not resolved by picking the last. See the [guide](USER_GUIDE.en.md). |
| Missing new models | Save settings before refreshing, and check CLI/configuration paths. Failed refreshes retain the previous catalog. |
| Large input or odd speed | Separate last-call from cumulative usage, and bytes from tokens. History and tools add input. Real decoding speed is not exposed; saved old conversation statistics are not rewritten. |

## Upgrading and reporting

Open **Troubleshooting and usage guide** in settings, or read the full [user guide](USER_GUIDE.en.md).

Use **Diagnostic logs and feedback** in settings to view, export or clear basic logs. If needed, acknowledge the privacy notice, capture the next failed reply and reproduce. Preview detailed samples before sharing: they may contain chats, code and tool arguments. Earlier unrecorded failures cannot be recovered. See [logs and feedback](TROUBLESHOOTING.en.md) for instructions and a report template.

Install the latest `.tgz` through DSH's plugin manager. If your DSH version requires removal first, record your configuration. Restart afterward and verify the running version.

Reports should include DSH/plugin/CLI versions, model ID, error code and reproduction steps. Do not publish credentials, private conversations or unredacted logs.

## Image questions (0.4.2)

Use DSH with its attachment service (plugin interface dependency: @deepseek-ai/dsh-attachment 0.2.1-rc.2) and official CLI supporting image JSONL input plus native Schema. China-region live validation used CLI 2.173.0. Refresh the catalog, check Image input, upload PNG/JPEG and ask. No extra CLI business tools are needed. See the [guide](USER_GUIDE.en.md) for budgets, offloading and troubleshooting.

## DSH version compatibility

This release declares DSH 0.2.1-rc.2 and 0.2.1-rc.3. If 0.3.2 is blocked after upgrading to rc.3, install 0.4.2 and restart DSH. Verify the running plugin version before testing. No version exemption is needed for these two versions; other runtime versions need review.

## Tool screenshots (0.4.2)

Choose a declared image model and use a DSH capture tool. A standard image result is sent on the next model request, preserving its call identity. The adapter does not install or execute capture tools itself. See [tool and result compatibility](TOOL_COMPATIBILITY.en.md).

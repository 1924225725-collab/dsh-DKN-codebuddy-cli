# Logs and issue reports

[简体中文](反馈与日志.md) · [Home](../README.en.md)

Install 0.3.2, restart DSH and open plugin `dsh-codebuddy-cli-cn`, component `llm-codebuddy-cli-cn`. Scroll to **Diagnostic logs and feedback** and verify the running version at the top.

New failure messages include a `diagnostic-id` matching each exported record `id`; DSH also retains the machine code. Settings show the same ID. Earlier uncorrelated failures cannot be retroactively repaired. Include reproduction steps and reviewed logs in reports.

0.2.6 recognizes empty output and fixed CLI error notices. For `CLI_AUTH_REQUIRED`, start the official CLI using the settings sign-in command and run `/login`. The plugin does not replace credentials. Numeric process diagnostics include stdout/stderr byte counts, elapsed time and exit status, without raw notices. Authentication failures usually have no model result to capture; basic logs are sufficient for that classification.

## Basic logs

Basic logs record timestamps, plugin/CLI versions, models, reasoning effort, deadlines, timing, tokens, history/tool counts, request byte sizes, error codes and structural summaries. Version 0.3.2 uses official native JSON Schema with only StructuredOutput enabled, reading the structured_output object. JSON examples inside text are not scanned as protocol candidates. Basic logs mark outputMode=native-json-schema and count multiple final records with finalResultCount. Older scan/escape-recovery fields may remain in saved historical records; current calls do not use that path.

Basic logs exclude request/reply bodies, tool arguments, credentials, CLI output bodies and configuration/executable paths. Record IDs are diagnostic IDs, not account/session IDs. Fragment summaries contain only fixed types, sizes and field-presence flags, without field values or arbitrary field names. Model choices may still reveal usage preferences; review before sharing.

Use **View basic logs** to preview and **Export basic logs** to save JSON. Basic exports always exclude raw replies, even if detailed samples exist locally. Logs survive restart, retaining up to 100 calls in a main file capped at 2 MiB; oldest records are evicted. Writes use a temporary file and replacement. The existing session usage counters and five recent-failure summaries still reset on restart. Nothing uploads automatically.

Storage paths:

- Windows: `%LOCALAPPDATA%\dsh-codebuddy-cli-cn\logs\diagnostics.json`.
- macOS: `~/Library/Application Support/dsh-codebuddy-cli-cn/logs/diagnostics.json`.
- Linux: `${XDG_STATE_HOME:-~/.local/state}/dsh-codebuddy-cli-cn/logs/diagnostics.json`.

Storage errors appear in settings. Available in-memory logs can still be exported but may be lost on restart. Exports exclude the actual user directory.

## Capture one failed reply

Some format failures need the raw result to diagnose. Capture is off by default:

1. Read and acknowledge the privacy notice.
2. Click **Capture next failed reply**.
3. Reproduce in DSH. The next failure other than user cancellation disables capture; successful calls and user cancellations do not consume it. Cancel manually or restart to disarm.
4. Return to settings and **Preview detailed logs**. Review and remove private material before sharing an exported detailed JSON file.

Capture stores only an available failed model result, excluding request bodies, full CLI stdout/stderr, environment variables and login files. Startup/network/timeout failures may have no complete result to capture. Earlier failures cannot be recovered retroactively.

Raw replies may repeat chats, code, file contents, tool arguments or other sensitive material and are not guaranteed to be redacted. Prefer basic exports, and avoid posting detailed files publicly. Each sample is limited to 256 KiB; larger replies retain both ends, original size and a truncation flag. This diagnostic truncation does not prove model/CLI truncation. Samples remain until their records rotate out or logs are cleared.

**Clear logs** requires another confirmation. It clears local plugin records/samples and disarms capture, while preserving session counters, DSH conversations and CLI sign-in. Delete downloaded files and personal backups separately. If storage fails, clearing may not reach disk; check the warning.

## Report template

Include a short reproduction, the exact error/code, diagnostic-id and time, plus an exported basic JSON log. State whether tools already completed before the final reply failed. Review detailed samples privately before sharing.

```text
Running plugin version:
DSH version:
CodeBuddy CLI version:
Operating system:
Model and reasoning effort:
Error text/code:
Reproduction steps and frequency:
Only with long histories or tools?:
Attachments: basic JSON log; reviewed detailed sample only if needed
```

Missing native output reports CLI_STRUCTURED_OUTPUT_MISSING. Multiple final records report native-final-results and are never selected arbitrarily. The adapter does not start additional CLI repair calls, but native processing can include internal model turns and usage. See the [user guide](USER_GUIDE.en.md).

## Image-call diagnostics

0.3.2 adds numeric imageCount, offloadedImageCount, imageBytes and imageBase64Bytes. Failures containing image history have imageRequest=true and cannot store raw samples. An armed attempt records captureAttempted without a sample, then disarms. Images, Base64, image names and attachment paths are not logged. Report basic logs, format/dimensions/count and steps; never publish private screenshots.

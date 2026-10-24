# Usage and troubleshooting guide

[简体中文](使用与故障处理指南.md) · [Installation](INSTALL.en.md) · [Logs](TROUBLESHOOTING.en.md) · [Home](../README.en.md)

For 0.3.2. Plugin settings contain an offline-readable troubleshooting summary. This page provides the full guide. All examples below are fictional.

## Check the failure stage before retrying

The adapter converts model replies into DSH text and tool requests. DSH executes files and commands. A failed final reply does not undo tools that completed earlier. Check tool records, actual files and exit codes before retrying.

“No tools were delivered from this result” refers to the failed model response, not the entire multi-step task. Format recovery does not automatically request another model reply or replay tools.

## Symptoms and next steps

| Symptom | When it can occur | What to do |
| --- | --- | --- |
| CLI_STRUCTURED_OUTPUT_MISSING | Official CLI returned no native structured_output | Check the running plugin/CLI versions and selected model. Export basic logs; try a small request. Prose is not substituted. Update the official CLI through its supported installation flow if needed |
| native-final-results | No unique final CLI record | The adapter never picks the last result. Save diagnostics and report the recurrence |
| native-envelope / field errors | Native output is a string, wrapper, partial object or has invalid fields | Missing content is not reconstructed. Reduce output size and report the diagnostic ID |
| Legacy ambiguous-json / possibly-truncated-json | A saved older call used the text protocol | Verify running 0.3.2 and reproduce a new call; upgrading does not rewrite historical messages |
| `TOOL_CALL_INVALID` | A tool name is undeclared or arguments are invalid | Confirm the intended DSH tools are enabled and make the request precise. Never substitute a similar tool name and execute it. Include DSH/CLI/plugin versions in the report |
| Final failure after successful command output | A tool completed, but the following summary or next-step response failed | Check output, exit codes and files. If only the summary is missing, explicitly request a summary of existing results without repeating operations |
| Changed quotes, code or backslashes | The model may add/remove escaping or alter literal content | Ask for only the affected small block and compare characters. The adapter never unescapes every valid text field a second time; verify content before executing it |
| `CLI_AUTH_REQUIRED` / 401 | Official CLI sign-in or authorization expired | Copy the official sign-in command from settings, use official `/login`, then verify one short request. The plugin cannot restore account rights or credits |
| `CLI_TIMEOUT` | The total CLI deadline expired, including startup, model processing and process exit | Split the task, check connectivity/service status, and adjust the deadline if needed. A longer deadline cannot resolve conflicting JSON plans |
| Missing file, `grantWrite`, ACL or permission error | Wrong workspace, absent path, or DSH/OS access refusal | Verify the workspace and path in the file manager and follow actual DSH permissions. Do not classify every permission error as model formatting, or change permissions to fix formatting |

## Native output boundaries

Only the official structured_output object is accepted, with exactly text and toolCalls. Text is never scanned for extra protocol fragments. Tools must be declared and arguments must be objects. String/wrapper recovery, missing-field inference and escape repair do not run on current calls.

The StructuredOutput output tool is allowed, while CLI file/command/MCP business tools remain disabled. DSH executes business operations. Multiple final records are rejected, and repeated operations inside one submitted plan are preserved.

The adapter starts no extra CLI repair process. Official structured processing allows bounded internal turns and may use more than one model request. Network, sign-in, limits, truncation and invalid results can still fail; native output is not a guarantee of correct task intent.

## Reducing failures in long conversations

Large histories mix code, tool output, old instructions and previous errors. They may make protocol adherence harder, but are not a proven cause of every failure. For repeated failures, start a fresh conversation with an accurate short summary: completed work, relevant paths, operations that must not be repeated, and one next action.

Use small batches and read/edit long files in bounded steps. These practices reduce pressure without promising that a particular model will never fail.

## Useful diagnostics

1. Open plugin `dsh-codebuddy-cli-cn`, component `llm-codebuddy-cli-cn`, and find **Diagnostic logs and feedback**. Record the running version.
2. Export basic logs with the full error, diagnostic ID, time, model/effort and reproduction steps. Basic logs exclude chat/reply bodies.
3. When a raw result is necessary, read the notice and arm **Capture next failed reply** before reproducing. Earlier raw replies cannot be recovered retroactively.
4. Successes and user-aborted tasks preserve capture. The next non-user-aborted failure consumes it; cancelling capture, clearing logs or restarting disables it. Startup/sign-in errors without a model body may have no detailed sample.
5. Preview and review every exported sample, removing private information before sharing. Raw samples are capped at 256 KiB with both ends retained if truncated; a truncated sample is not a complete original reply. Logs are never uploaded automatically.

Retain evidence before retrying. One later success does not establish the cause of the original failure.

## Image questions

Upgrade, restart DSH, refresh the catalog and choose a route marked Images in settings. Upload through DSH attachments and ask about it; later questions may refer to that image. Image content goes to the official model service, not the diagnostic log.

Prefer PNG/JPEG. Retain up to 5 request images, each converted to ≤2 MiB and longest edge ≤1920; combined Base64 ≤8 MiB, total request ≤20 MiB. DSH request conversion can make small text less readable; use a clear crop when needed. WebP/GIF depend on DSH and the model; animated-frame analysis, tool screenshots and image generation are not covered.

- IMAGE_MODEL_UNSUPPORTED: refresh the catalog and choose a declared image route. Unknown manually entered IDs do not enable images. Catalog declarations are not every-model validation.
- IMAGE_SERVICE_UNAVAILABLE / IMAGE_READ_FAILED / IMAGE_ATTACHMENT_INVALID: update DSH, re-enable the plugin or re-upload. Do not enable CLI file tools to work around this.
- IMAGE_TOO_LARGE / REQUEST_TOO_LARGE: crop/downsize or reduce history.
- IMAGE_OFFLOAD_REQUIRED: DSH should record older image offloading and continue. Without that feature, start a fresh conversation with the relevant images. Offloaded images are unavailable to the model; reattach instead of asking it to guess.
- CLI_STREAM_INVALID / CLI_PERMISSION_REQUIRED: update official CLI and report basic diagnostics. Partial frames and interactive permission requests are not automatically accepted.

Calls containing image history never capture raw failure samples, even when armed. That failure consumes the capture attempt with metadata only. Report basic logs, diagnostic ID, image format/dimensions/count and steps. Share a self-made non-private example image only if desired.

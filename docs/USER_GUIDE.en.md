# Usage and troubleshooting guide

[简体中文](使用与故障处理指南.md) · [Installation](INSTALL.en.md) · [Logs](TROUBLESHOOTING.en.md) · [Home](../README.en.md)

For 0.3.5. Plugin settings contain an offline-readable troubleshooting summary. This page provides the full guide. All examples below are fictional.

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
| `CLI_NETWORK_ERROR` | Known connection reset (ECONNRESET) or TLS connection failure from CLI error output, possibly with exit code 0 | Check connectivity/proxy access to the official service. Retain diagnostic ID and basic logs; the task target alone does not identify the failed endpoint. No automatic retry or network/account change is made |
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

Prefer PNG/JPEG. Retain up to 5 request images, each converted to ≤2 MiB and longest edge ≤1920; combined Base64 ≤8 MiB, total request ≤20 MiB. DSH request conversion can make small text less readable; use a clear crop when needed. WebP/GIF depend on DSH and the model; tool screenshots returned as standard DSH attachments are supported; animated-frame analysis and native model image generation are not covered.

- IMAGE_MODEL_UNSUPPORTED: refresh the catalog and choose a declared image route. Unknown manually entered IDs do not enable images. Catalog declarations are not every-model validation.
- IMAGE_SERVICE_UNAVAILABLE / IMAGE_READ_FAILED / IMAGE_ATTACHMENT_INVALID: update DSH, re-enable the plugin or re-upload. Do not enable CLI file tools to work around this.
- IMAGE_TOO_LARGE / REQUEST_TOO_LARGE: crop/downsize or reduce history.
- IMAGE_OFFLOAD_REQUIRED: DSH should record older image offloading and continue. Without that feature, start a fresh conversation with the relevant images. Offloaded images are unavailable to the model; reattach instead of asking it to guess.
- CLI_STREAM_INVALID / CLI_PERMISSION_REQUIRED: update official CLI and report basic diagnostics. Partial frames and interactive permission requests are not automatically accepted.

Calls containing image history never capture raw failure samples, even when armed. That failure consumes the capture attempt with metadata only. Report basic logs, diagnostic ID, image format/dimensions/count and steps. Share a self-made non-private example image only if desired.

## Tool image results (0.3.4)

Images in tool results now use the same native image input as uploads. Preserve toolCallId, isError and order: visible evidence in a failed tool result is not proof the tool succeeded. IMAGE_TOOL_CALL_INVALID indicates a missing call identity. Paths/URLs/Base64 text are not read automatically. CLI error frames report safe authentication, directory-permission or generic request failures. See [tool and result compatibility](TOOL_COMPATIBILITY.en.md) for the supported representations and remaining gaps.

## Private structural diagnostics (0.3.9)

Basic logs and settings show fixed reasons, frame index/bytes, init/result counts, phase, last-frame class and termination initiator. They contain no bodies, images, arbitrary field names or stderr. Unknown frame names become other; missing facts in old logs remain missing.

CLI_STREAM_INVALID means a protocol rejection, not necessarily malformed JSON. json-parse identifies an unparseable complete line; frame-shape identifies an invalid shape; partial-tail identifies a tail parse failure at close, not proof of truncation. Regional versions can have additional init/final sequence guards. Bad lines are not ignored or repaired, and prose never becomes a tool request.

closeObserved=false means close had not been observed when the diagnostic returned. A missing exitCode does not establish a crash. terminationInitiator distinguishes parser, deadline, caller, terminal-drain, process and spawn. caller identifies an upstream cancellation signal, not who clicked Stop. Native-result facts separate structured_output presence/type and fixed subtype categories. noticeClass=unknown does not establish a network failure.

Cancellations and image-offload control events are counted separately and preserve failure capture. Only the requested offload count is recorded; DSH manages history. If a natural failure recurs, provide matching basic logs and diagnostic ID, not private images, full chats or credentials. Validated diagnostics do not prove reproduction or elimination of an older intermittent failure.

## DSH tools and native CLI tools (0.3.8)

DSH executes its business tools. The model submits proposals through the CLI's `StructuredOutput` tool, and the plugin hands them back to DSH. Do not install DSH tools into the CLI or enable CLI file, shell or network tools for this purpose.

`CLI_TOOL_PROTOCOL_ERROR` means the model used a DSH tool name as a native CLI function. The plugin stops this request without inferring arguments from error prose, executing that tool or automatically retrying. Check earlier completed operations before manually retrying the unfinished step. If repeated, share basic diagnostics, diagnostic ID, model/version and non-private reproduction steps. Stronger protocol instructions cannot guarantee every upstream model always complies.

A generic lookup tool may work in DSH yet fail if the model invokes it directly inside the CLI. That is a handoff failure, not evidence that the lookup service is unavailable. Historical images select the image input channel even for a new text-only message. `CLI_TIMEOUT` means no final result arrived before the deadline; it does not establish an expired login or oversized image.

## Network diagnostics (0.3.5)

Only fixed, known CLI notices are classified. A valid final native result remains successful even if stderr contains an earlier recovered network notice; quoted error words are not sufficient. Unknown empty output retains the generic error. Authentication/permission classification remains separate. Retrying a summary does not undo earlier DSH tools, so check completed actions first. This version improves the message, not the connection itself.

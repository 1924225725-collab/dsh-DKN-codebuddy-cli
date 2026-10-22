# China plugin 0.2.8 manual testing

[简体中文](测试手册.md) · [Installation](INSTALL.en.md) · [Logs](TROUBLESHOOTING.en.md)

Test only `dsh-codebuddy-cli-cn`; international work remains paused. Follow the cases in order using a dedicated workspace. Model requests use your account credits: start with one model you already have access to. Automated tests do not replace actual DSH testing. An old failure without its raw result cannot be declared fixed from the error text alone. Use **Pass / Fail / Not triggered / Skipped / Environment blocked**; an untriggered intermittent error is not a pass.

## Preparation

Finish other model tasks so active-request counts are meaningful. Save a settings screenshot, including CLI/configuration paths, model, effort and timeout. Install `dsh-codebuddy-cli-cn-0.2.8.tgz`, fully exit DSH and reopen it. Uploading/downloading the package does not update the running plugin.

Extract `dsh-codebuddy-cli-cn-0.2.8-test-kit.zip` into a dedicated folder. In DSH, select the extracted `dsh-codebuddy-cli-cn-0.2.8-test-kit` folder itself as the workspace. Before T08, verify in File Explorer that `input.txt`, `calc.mjs`, `README.md` and `feedback.md` are directly inside that folder, and confirm DSH shows that same folder as the active workspace. If they differ, switch workspaces before proceeding. If DSH reports `SetNamedSecurityInfoW`, `grantWrite` or another ACL access error, mark file/tool tests blocked and stop; do not repair permissions or ownership. Do not test in a real project.

Create a fresh conversation such as `CN028-Core` and select a **CodeBuddy CLI (China)** model. Record its exact ID and reasoning effort. A version check is not a model-connectivity test, and a DSH tool permission refusal is not a JSON-parser error.

## T01 — Running version

Open plugin `dsh-codebuddy-cli-cn`, component `llm-codebuddy-cli-cn`, and its settings.

Expected: running version **0.2.8** and **Diagnostic logs and feedback**, including basic viewing/export, clearing and one-failure capture. Resolve stale running versions before continuing. Record DSH/OS versions and the package filename.

## T02 — Executable

Click **Check CLI executable**. Reuse an existing working installation; use setup only if the CLI is missing.

Expected: executable availability and a version. No test prompt is sent by this check; it proves neither sign-in nor model access. Record the version/setup result and any `CLI_NOT_FOUND` error.

## T03 — Sign-in

For 401/`CLI_AUTH_REQUIRED`, copy the settings sign-in command into PowerShell, start the official CLI and run `/login`. Complete official China-region sign-in, return to DSH and refresh models. Never send passwords, cookies or tokens in feedback.

Expected: T04 works after accepted sign-in. Catalog refresh alone is insufficient. If service authentication still fails, expect an explicit `CLI_AUTH_REQUIRED` message rather than generic invalid JSON. Save basic logs and stop further model testing until authentication is resolved. Do not log out of a working account just to trigger this case; keep account/region fixed during the tests.

## T04 — Short real reply

```text
Connectivity test. Do not use tools. Reply only: CN028_OK
```

Expected: that text appears and the turn completes. A successful call is recorded, and its active count returns to zero shortly afterward. Token counts include CLI overhead; they need not equal the prompt length. For failures record model, effort, time, full error and `diagnostic-id`.

## T05 — Conversation history

Send these one at a time in the same conversation:

```text
Remember CN028-CONTEXT. Do not use tools; acknowledge only.
```

```text
What is 2+3? Do not use tools.
```

```text
What code did I ask you to remember? Reply only with the code.
```

Expected: the final answer is `CN028-CONTEXT`, without another conversation's data or parser failure. Record wrong answers separately from adapter errors.

## T06 — Quotes, paths, brackets and code

Ask for a Markdown code block containing these literal lines followed by an explanation, without tools:

```text
C:\测试目录\含 空格\demo.txt
{"example":1} [阶段一] [阶段二]
He said: "hello"; backslash: \
```

Expected: content/code blocks display normally, including JSON examples and bracket labels inside the answer. Quotes, backslashes and line breaks remain meaningful. Plain text is delivered without tool execution. A displayed code fence is not itself a protocol failure. Record the diagnostic ID if parsing fails; T18 can capture a later reproduction.

## T07 — Long answer

Ask for about 1,500 Chinese characters (or a comparable English answer) on making a software promo, in 12 numbered sections, ending with `CN028_LONG_END`, without tools or claims of created files.

Expected: a complete reply including the ending, without a blank turn or a response failing midway. Delimiter-free text can be delivered as text with no tools. If JSON structure is visibly incomplete, the plugin must keep the failure rather than discard the tail or present a partial answer as complete. Approximate length is sufficient. Initially repeat at most once if needed and record frequency.

## T08 — Read-only tool

Confirm the active DSH workspace is the extracted test-kit folder and `input.txt` is visible at its root in File Explorer. If the workspace differs, switch it; if an ACL error appears, stop and mark the case blocked. Ask the model to read `input.txt` and report the marker and two numbers without modifying files.

Expected: an actual DSH read tool, marker `CN028-A`, numbers `2` and `3`, and unchanged file contents. A claim to have read the file without a tool record is insufficient.

## T09 — Create and read back

Ask to create `notes.txt` containing one line `FIRST_WRITE_CN028`, then read it back using a tool, changing no other files.

Expected: the real file exists with that marker, with visible write/read tools. Check existing files yourself before repeating the case; an earlier result is not evidence of a new successful write.

## T10 — Read before editing

Ask to read `notes.txt`, append exactly one line `SECOND_WRITE_CN028`, preserve existing content and read it back.

Expected: reading precedes editing, with each marker appearing once. If DSH reports “file has not been read”, the model should read the file before retrying that edit, respecting the policy. Do not bypass permissions. A model correcting a failed tool call is different from the plugin automatically replaying a completed request.

## T11 — Run and check

Ask to read `calc.mjs`, run it with the locally available Node.js and arguments `2 3`, then perform a syntax check. Do not install dependencies, access the network or alter system configuration.

Expected: actual output `5` and a successful syntax-check exit. Handle DSH command approvals under your own policy. Missing Node is an environment problem, not JSON parsing failure.

## T12 — Understand a failed tool

Ensure `missing-for-T12.txt` does not exist. Ask for exactly one read attempt, a truthful explanation if missing, and then stop without creating the file, network access or repeated attempts.

Expected: the tool reports missing-file failure and the model explains it rather than inventing contents/success. Then ask for a plain `CN028_AFTER_TOOL_ERROR` reply; conversation should still work. The failure flag now reaches the model, but correct model behavior still needs observation.

## T13 — Complete tool cycle

Ask to read the numbers from `input.txt`, run `calc.mjs` to add them, create `result.txt` with `CN028_RESULT=5`, and read that result back. Restrict all operations to this test folder and avoid repeated writes.

Expected: read → run → write → read, with real results matching the final answer. Multiple CLI/model steps are normal for a tool workflow; request count greater than one does not itself prove paid retries. Look for duplicate execution of already-completed writes.

## T14 — Cancel and active count

In another fresh test conversation, request a long explanation without tools and click DSH Stop while waiting. Refresh settings once.

Expected: the request stops, its active count clears, and another short prompt works. Cancellation before dispatch may create no log. If the answer finishes before you can stop it, mark “Not triggered”. Also verify active count after normal completion. Record time-to-clear and any other active conversations.

## T15 — Timeout (optional)

Record the original timeout, set/save `15000` ms, request a long answer without tools, and **restore the original timeout afterward**.

Expected if the deadline is exceeded: `CLI_TIMEOUT`, diagnostic ID and numeric process details, without an automatic extra model request. Finishing within 15 seconds means timeout was not triggered, not failure. Do not repeatedly force a slow request just to trigger this case.

## T16 — Catalog and another model (optional)

Save settings, refresh the catalog and search for the current ID. If another model is known to be authorized, use it in a fresh conversation for T04 once, then return to your usual model.

Expected: discovered rates/fields appear, unavailable fields may remain unknown, and actual call/log model IDs match selection. Catalog visibility is not proof of account access. Report authorization/quota problems separately from parsing.

## T17 — Basic logs and correlation

View/export basic logs and open the downloaded JSON in a text editor.

Expected: version/model/state/time/usage/request-size/structural information, including `scanIncomplete`, `scanBroken`, `insideString` and `openContainerDepth` when JSON scanning ran; process statistics appear when available. A new failure's `diagnostic-id` should equal its exported record `id`; machine codes should survive instead of all becoming `UNKNOWN`. Old records cannot acquire missing IDs retroactively.

Search for body markers such as `FIRST_WRITE_CN028` and `SECOND_WRITE_CN028`: basic exports must exclude them, request/reply bodies, credentials and actual configuration paths. Model IDs and timestamps still reveal usage preferences; review before sharing.

## T18 — One failed reply capture (conditional)

Only when a format failure needs diagnosis, acknowledge the privacy notice, arm **Capture next failed reply** and reproduce the test case.

Expected: successes do not consume capture; the next failure disarms it. An available raw model result creates a sample for preview/separate export. Authentication/startup/timeout failures may have no result to capture. Samples larger than 256 KiB retain both ends with a diagnostic-truncation marker. Basic export must still exclude samples.

Review/remove private content before sharing. If no natural format failure occurs, mark “Not triggered”; do not damage installation, credentials or networking to force one.

## T19 — Restart and persistence

Export a basic log and record the count/capture state. Finish tasks, fully restart DSH and revisit settings.

Expected: running version remains 0.2.8; saved logs/samples survive within the 100-record/2-MiB main-file limits, with oldest records rotated. Capture is disarmed. Session usage counters and the five recent-failure summaries reset by design. Record storage warnings rather than treating unsaved data loss as a successful persistence test.

## T20 — Clear and finish

Save feedback logs first. Click Clear, cancel the confirmation once and verify records remain. Clear again and confirm.

Expected: records/samples clear and capture disarms, while DSH conversations, official sign-in and current session counters remain. Downloaded copies need separate deletion. A storage warning means disk clearing is not confirmed. Restore original settings; retain the test folder and feedback.

## What to send back

The easiest feedback is two attachments: the kit's partially completed `feedback.md` (only fill the cases you ran) and the settings page's exported basic JSON log. You do not need to paste the entire conversation. For one specific failure, include its test ID, exact error, diagnostic ID, time and whether the test-kit folder was the active workspace. Share detailed samples only after reviewing/removing private content; never send passwords, cookies or tokens. If attachments are inconvenient, paste those same fields in chat.

Compare fresh-conversation T04/T06/T07 with old-history failures. Avoid asking an old production session to “continue” just to test: it could resume real modifications. Use a copied test workspace/session if historical reproduction is necessary.

Automated coverage includes conflicting results, incomplete JSON/arguments, unknown tools, large synthetic content, empty-content rejection, storage failures/limits/concurrency, paused-consumer active counts, and failure-code/ID propagation. Do not force these conditions manually. This coverage does not guarantee every future model output or account authorization.

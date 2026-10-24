# Architecture

[简体中文](工作原理.md) · [Home](../README.en.md)

Version 0.3.2 adapts the signed-in China-region official CLI into a DSH model provider. DSH retains history, permissions and business-tool execution.

## Native result path

The adapter supplies messages, instructions, tool definitions and responseSchema. CLI flags include --print --output-format json --json-schema and a whitelist containing only StructuredOutput. Other built-in business tools, MCP, auto memory and transcript persistence are disabled.

StructuredOutput submits a text/toolCalls object; it performs no project file or command operation. The adapter consumes the official final record's structured_output object, never searching result prose for JSON. Code, paths and protocol examples inside text remain data.

Missing native output, string/wrapper envelopes, extra fields, invalid names/arguments and multiple final records fail without prose fallback or last-result selection. Arguments must be objects. The complete plan is validated before DSH blocks are delivered. Repeated operations inside one plan remain intact.

DSH executes requested tools and puts results in its history for the next call. A failed summary cannot undo earlier tools; inspect actual state before retrying. User images, standard tool image results and follow-ups are supported; history belongs to DSH.

## Deadlines and usage

One CLI process starts per DSH request. Native processing allows up to four CLI turns within the existing total deadline and cancellation flow. This is not a guarantee about billed request counts. The adapter starts no extra repair process or automatic retry, but official processing can involve internal model requests. Reported tokens and official usage pages determine accounting.

## Account, catalog and setup

Sign-in remains an official China-region CLI flow; the plugin passes an optional configuration directory without reading or copying credentials. Conversation content goes to the official model service.

A separate ACP initialize/session-new flow discovers catalog models, rates, reasoning and context metadata without a model prompt. Refresh occurs at startup, every 15 minutes and on demand. Visibility does not guarantee model access; rates are not balances.

Setup detects the current user's installation or uses the official installer/npm package. It has no hardcoded author paths.

## Validation and diagnostics

This release passed 74 automated checks and six synthetic official CLI image calls through the new adapter: PNG single image, follow-up, two-image order, tool proposal, summary after a simulated tool result and a JPEG check. China-region live tests used deepseek-v4.1-flash and CLI 2.173.0 with an isolated attachment-service test double. No real DSH business tool ran; DSH upload-UI manual end-to-end validation and every-model coverage remain outstanding. Official structured processing may involve internal model turns; official usage applies.

Basic logs exclude bodies. Raw failures require explicit opt-in capture and are never automatically uploaded. See [logs](TROUBLESHOOTING.en.md) and the [user guide](USER_GUIDE.en.md).

[Official headless mode](https://www.codebuddy.cn/docs/cli/headless) · [Tools](https://www.codebuddy.cn/docs/cli/tools-reference) · [ACP](https://www.codebuddy.cn/docs/cli/acp)

## Image transport

DSH image blocks carry attachment references. The adapter reads request bytes with ctx.attachments.readImageRequest, replaces history occurrences with explicit indexes and attaches native image blocks in that order to one CLI user message. Base64 is not plain prompt text, and history is not replayed as multiple CLI user turns. DSH owns attachment lifecycle.

Local budgets are longest edge 1920, 2 MiB per converted image, 5 retained images, 8 MiB combined Base64 and 20 MiB total input. These are adapter limits, not universal provider limits. IMAGE_OFFLOAD_REQUIRED carries the number of oldest occurrences for DSH to durably offload before retrying. Offloaded images retain honest no-image-data placeholders, without private history deletion or guessed contents.

The documented stream is resident. Send one input, drain queued frames after the terminal result, then close that process. Multiple final records observed in the response fail rather than selecting the last. Calls containing image history never store raw failure samples, even with capture armed.

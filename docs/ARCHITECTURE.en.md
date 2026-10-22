# Architecture

[简体中文](工作原理.md) · [English home](../README.en.md)

The plugin registers a CodeBuddy CLI model provider in DSH. It converts the selected model ID, ordered conversation history, system instructions and tool definitions into a text envelope, then starts the official CLI using `--print --output-format json`.

Since 0.2.3, the response schema is included in the prompt rather than passed to native `--json-schema`. The model's final result contains a JSON object with `text` and `toolCalls`. The adapter validates its structure and tool names locally, then returns DSH text/tool blocks and reported usage. Invalid output fails without an automatic paid repair request.

Version 0.2.4 recognizes complete fences, unambiguous complete JSON containers, encoded JSON and a small set of wrappers before validation. Empty fields are inferred only for unambiguous text-only or nonempty tool-only replies. String arguments must decode into complete objects and tool names must be declared. Incomplete or conflicting results are never repaired by guessing. Fixed diagnostic categories, types, lengths and normalization steps are retained without content; five failure summaries remain in memory until restart, even after later successful calls.

The CLI's own tools, MCP, automatic memory/background work for the call, and session persistence are disabled. The adapter supplies its own CLI system prompt, while preserving DSH instructions in the request envelope. DSH executes requested tools under its own permissions. Tool results enter DSH history and are included in the next call. Each call starts a CLI process; history continuity belongs to DSH.

Model discovery is a separate ACP flow: `initialize` and `session/new` obtain the current catalog, including available model IDs, credit multipliers, reasoning options and context metadata. It sends no model prompt. Refresh happens at startup, every 15 minutes and on demand; failed refreshes retain the catalog associated with that CLI/configuration path.

One-click setup checks common current-user installation locations, tries the official installer when necessary, and can fall back to the official npm package. Sign-in remains an official CLI flow. The plugin passes an optional configuration directory without reading or copying credentials.

Input is currently text only. Results are delivered as complete blocks, without a measured decoding speed. Token usage is reported by the CLI; it may include internal model calls and is not equivalent to billed credits or remaining balance. Account permissions and billing are determined by the official service.

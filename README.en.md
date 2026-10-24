# DSH CodeBuddy CLI (China)

[简体中文](README.md) · **English**

Use models available to your China-region account in **DeepSeek Harness (DSH)** through the signed-in official CodeBuddy CLI. DSH manages conversations and tools; this adapter translates model requests and results.

**Latest version: 0.3.2**

[Download plugin](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/download/v0.3.2/dsh-codebuddy-cli-cn-0.3.2.tgz) · [All releases](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases) · [Installation](docs/INSTALL.en.md) · [Usage and troubleshooting](docs/USER_GUIDE.en.md) · [Changelog](CHANGELOG.md)

[Repository download fallback](releases/dsh-codebuddy-cli-cn-0.3.2.tgz) · [SHA-256](releases/SHA256SUMS.txt)

## What's new in 0.3.2

- Add user image questions and history follow-ups through DSH attachments and official native image blocks in stream-json, retaining native Schema output.
- Show catalog-declared image capability; reject images for unknown/undeclared routes and preserve the existing text-only transport.
- Associate images with history by index. Retain up to 5 request images, each converted to ≤2 MiB and longest edge ≤1920; combined Base64 ≤8 MiB, total text/image request ≤20 MiB. Request durable DSH image offloading rather than silently dropping history.
- Bound image streams with cancellation, deadlines, strict JSONL and unique-terminal validation. DSH continues to execute business tools.
- Disable raw failure capture for calls containing image history. Basic logs retain counts/byte totals only. Update bilingual settings, guides and installation instructions.

Earlier changes remain in [Changelog](CHANGELOG.md) and [Releases](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases). The unpublished 0.2.10 local candidate was included in 0.3.0.

## Install and start

1. Download the `.tgz` locally and install it from DSH's plugin manager. A source ZIP is not a plugin package.
2. Open plugin `dsh-codebuddy-cli-cn`, component `llm-codebuddy-cli-cn`, and select **Set up CLI**.
3. Expand **Sign in or switch account**, copy the official command into PowerShell (Terminal on macOS/Linux), and complete China-region sign-in.
4. Refresh models/rates and select a model in DSH. Restart after upgrading and verify running version **0.3.2**.

See the [installation guide](docs/INSTALL.en.md). For failures, expand **Troubleshooting and usage guide** inside settings or read the [full guide](docs/USER_GUIDE.en.md).

## Features

- **Dynamic model discovery and rates:** ACP synchronizes the current CLI catalog, rates, reasoning options and context without a fixed allowlist, at startup, every 15 minutes and on demand.
- **Portable setup:** detects the current user's installation or uses the official installer/npm package, without fixed usernames or paths.
- **DSH tool workflow:** DSH enforces permissions, executes model-requested tools and passes results into subsequent requests.
- **Usage diagnostics:** separate cumulative, per-call and cache accounting, request sizes and total durations; no artificial token-generation speed.
- **Local logs:** view/export/clear basic logs, with opt-in detailed failure capture and no automatic upload.

Catalog visibility does not guarantee every model is authorized. Rates and token counters are not remaining credits; official usage pages determine balances and billing.

## Interface examples

These historical 0.2.3 component previews use fictional models and states, without account data. Version 0.3.2 also includes the in-settings guide and updated error handling.

![Automatic CLI setup and sign-in example](docs/images/ui-setup.png)

![Model/rate catalog with fictional data](docs/images/ui-models.png)

## Architecture and limits

![DSH, adapter, official CLI and service](docs/images/architecture.svg)

DSH → local adapter → official CLI → official model service → adapter validation → DSH text/tools. Text calls use `--print --output-format json`; retained-image calls use official `--input-format stream-json --output-format stream-json`, with official --json-schema and only StructuredOutput enabled. Other built-in business tools, MCP and session persistence are disabled. DSH supplies history. See [architecture](docs/ARCHITECTURE.en.md).

This is an independent third-party adapter. The author provides no relay server, shared accounts or credit resale. Official CLI sign-in does not confer official authorization on this project or guarantee future service policies.

User-uploaded images and follow-ups are supported on routes declaring image input. Prefer PNG/JPEG; WebP/GIF depend on DSH conversion and model support, with no animated-frame, tool-screenshot or image-generation promise. Replies are delivered as complete blocks, without per-token speed. The default total deadline is 180 seconds. A version check only proves the executable starts. Node.js ≥ 22.19.0 is required. Windows has local validation; macOS/Linux installation branches have synthetic coverage, with full physical-device workflows still unverified.

Missing native output, multiple final records and invalid tool requests still fail without prose fallback. A failed final reply does not undo completed tools: verify actual state before retrying. See the [user guide](docs/USER_GUIDE.en.md).

This release passed 74 automated checks and six synthetic official CLI image calls through the new adapter: PNG single image, follow-up, two-image order, tool proposal, summary after a simulated tool result and a JPEG check. China-region live tests used deepseek-v4.1-flash and CLI 2.173.0 with an isolated attachment-service test double. No real DSH business tool ran; DSH upload-UI manual end-to-end validation and every-model coverage remain outstanding. Official structured processing may involve internal model turns; official usage applies.

## Feedback

Export basic logs from settings with the error code, diagnostic ID, version and reproduction steps. Arm capture beforehand only when raw replies are necessary and review before sharing. See [logging help](docs/TROUBLESHOOTING.en.md). Never publish credentials, private sessions or unreviewed raw logs.

This repository contains source, automated tests and user documentation. Historical packages live in Releases; manual test forms and fixtures are distributed separately.

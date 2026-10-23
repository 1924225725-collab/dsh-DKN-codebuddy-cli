# DSH CodeBuddy CLI (China)

[简体中文](README.md) · **English**

Use models available to your China-region account in **DeepSeek Harness (DSH)** through the signed-in official CodeBuddy CLI. DSH manages conversations and tools; this adapter translates model requests and results.

**Latest version: 0.3.0**

[Download plugin](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases/download/v0.3.0/dsh-codebuddy-cli-cn-0.3.0.tgz) · [All releases](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases) · [Installation](docs/INSTALL.en.md) · [Usage and troubleshooting](docs/USER_GUIDE.en.md) · [Changelog](CHANGELOG.md)

[Repository download fallback](releases/dsh-codebuddy-cli-cn-0.3.0.tgz) · [SHA-256](releases/SHA256SUMS.txt)

## What's new in 0.3.0

- Identical complete replies with the same text, ordered tools and delivered arguments are delivered once. Different plans remain blocked instead of being merged or selected arbitrarily.
- Includes final-text escape recovery from the earlier local candidate, limited to complete explicitly text-only replies.
- User-aborted tasks no longer consume the next-failed-reply capture opportunity.
- Bilingual troubleshooting guidance is available directly inside plugin settings, covering triggers, limits and recovery steps.
- Reinforces one-result-per-request and literal-text instructions, retaining local validation without extra model calls or replaying completed tools.

Includes the 0.2.4–0.2.9 parsing, authentication, logging, error-correlation and tool-result fixes. Historical notes are recorded in [GitHub Releases](https://github.com/1924225725-collab/dsh-codebuddy-cli-cn/releases) and [CHANGELOG](CHANGELOG.md). Version 0.2.10 was a local candidate, incorporated into 0.3.0 without a separate public release.

## Install and start

1. Download the `.tgz` locally and install it from DSH's plugin manager. A source ZIP is not a plugin package.
2. Open plugin `dsh-codebuddy-cli-cn`, component `llm-codebuddy-cli-cn`, and select **Set up CLI**.
3. Expand **Sign in or switch account**, copy the official command into PowerShell (Terminal on macOS/Linux), and complete China-region sign-in.
4. Refresh models/rates and select a model in DSH. Restart after upgrading and verify running version **0.3.0**.

See the [installation guide](docs/INSTALL.en.md). For failures, expand **Troubleshooting and usage guide** inside settings or read the [full guide](docs/USER_GUIDE.en.md).

## Features

- **Dynamic model discovery and rates:** ACP synchronizes the current CLI catalog, rates, reasoning options and context without a fixed allowlist, at startup, every 15 minutes and on demand.
- **Portable setup:** detects the current user's installation or uses the official installer/npm package, without fixed usernames or paths.
- **DSH tool workflow:** DSH enforces permissions, executes model-requested tools and passes results into subsequent requests.
- **Usage diagnostics:** separate cumulative, per-call and cache accounting, request sizes and total durations; no artificial token-generation speed.
- **Local logs:** view/export/clear basic logs, with opt-in detailed failure capture and no automatic upload.

Catalog visibility does not guarantee every model is authorized. Rates and token counters are not remaining credits; official usage pages determine balances and billing.

## Interface examples

These historical 0.2.3 component previews use fictional models and states, without account data. Version 0.3.0 also includes the in-settings guide and updated error handling.

![Automatic CLI setup and sign-in example](docs/images/ui-setup.png)

![Model/rate catalog with fictional data](docs/images/ui-models.png)

## Architecture and limits

![DSH, adapter, official CLI and service](docs/images/architecture.svg)

DSH → local adapter → official CLI → official model service → adapter validation → DSH text/tools. The CLI uses `--print --output-format json`, with built-in tools, MCP and session persistence disabled. DSH supplies history. See [architecture](docs/ARCHITECTURE.en.md).

This is an independent third-party adapter. The author provides no relay server, shared accounts or credit resale. Official CLI sign-in does not confer official authorization on this project or guarantee future service policies.

Text only; no image input or true token streaming. The default total deadline is 180 seconds. A version check only proves the executable starts. Node.js ≥ 22.19.0 is required. Windows has local validation; macOS/Linux installation branches have synthetic coverage, with full physical-device workflows still unverified.

Conflicting plans, missing content and invalid tool requests may still fail. A failed final reply does not undo completed tools: verify actual state before retrying. See the [user guide](docs/USER_GUIDE.en.md).

This release passed 55 automated checks and two official CLI calls using entirely synthetic tool results. This does not guarantee every future model response.

## Feedback

Export basic logs from settings with the error code, diagnostic ID, version and reproduction steps. Arm capture beforehand only when raw replies are necessary and review before sharing. See [logging help](docs/TROUBLESHOOTING.en.md). Never publish credentials, private sessions or unreviewed raw logs.

This repository contains source, automated tests and user documentation. Historical packages live in Releases; manual test forms and fixtures are distributed separately.

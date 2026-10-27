# Multiple accounts (preview feature; 0.4.0)

This preview feature implements isolated environments and account-bound model routing. Directory isolation, synthetic routing and existing automated regressions passed. Real two-account sign-in persistence, token refresh and billing attribution still require user acceptance. This feature is not marked production-ready.

Supported for this feature: Windows, official **npm/Node** CodeBuddy CLI **2.174.0**, DSH **0.2.1-rc.2 / rc.3**. Native executables and other CLI versions are blocked in account mode until verified. Existing default sign-in behavior remains available.

## Setup

1. Install package 0.4.0 yourself and confirm running version 0.4.0. The plugin does not update your running DSH installation automatically.
2. Open **Multiple accounts (preview)**, enter a label and add an isolated account. Adding does not activate it or copy existing credentials.
3. Prepare its official sign-in command. Copy it into a new PowerShell window. A separate PowerShell process launches the official CLI with isolated configuration, home and AppData directories. No permanent system/user environment variables are changed.
4. Choose **Chinese Site** and verify the intended identity on the official page. Exit the CLI after signing in; no model prompt is needed. Repeat separately for each account.
5. Select an account, refresh models, then choose its **[account label]** model in the DSH conversation.

Each environment contains one current sign-in. Signing in again replaces that environment's identity. A user label is not an identity check. “Local credential present” means only that a nonempty credential file without a logout marker exists; its contents are not read for this indicator. It does not prove authentication, credits or model connectivity.

## Routing

Account-bound model IDs retain the environment ID across model calls, tool results and screenshots. The plugin restores the original official model ID before launching the CLI. Changing the selected account changes the advertised catalog; existing conversations retain their labelled model until explicitly changed.

To change the account for an existing conversation, explicitly select the intended labelled model there. Subsequent requests use it and still carry DSH conversation history.

Legacy unlabelled models fail with `ACCOUNT_MODEL_REQUIRED` while an isolated account is selected. Choose a labelled model or return to **Use default CLI sign-in**. Missing credentials, network errors and quota/authentication failures never silently switch to another account.

## Usage and local data

Per-account request/token counters cover this plugin process only, include blocked attempts and reset on restart. They are not official billing or remaining credits. Official structured output may involve multiple internal model requests. Confirm real billing against the correct account's official request records after accounting catches up.

Use official `/logout` only inside the intended dedicated environment. Its effect on other real accounts remains an acceptance-test item. To remove an entry, select another account/default mode and wait for its calls to finish, then confirm removal. **Removing an entry retains local official login/session files; it does not log out or erase credentials.** Existing bound conversations fail explicitly.

Metadata is stored under `%LOCALAPPDATA%\dsh-codebuddy-cli-cn\accounts\index.json`; random-ID subdirectories contain each environment. These may contain official credentials: never share or publish the directory as diagnostics. Ordinary plugin logs include only the random environment ID, not the label, directories or credentials.

## Errors

| Code | Action |
| --- | --- |
| ACCOUNT_LOGIN_REQUIRED | Complete the entry's official sign-in flow, then refresh models. |
| CLI_AUTH_REQUIRED / 401 | Reauthenticate through official `/login` in that environment. A file may exist but be expired. |
| ACCOUNT_CLI_UNVERIFIED | Account mode requires the verified CLI 2.174.0. Wait for adaptation or return to default mode. |
| ACCOUNT_CLI_RUNTIME_UNVERIFIED | Use the official npm package and select its codebuddy.cmd in advanced settings. Native executables and other entrypoints have not been verified. The plugin does not replace your CLI automatically. |
| ACCOUNT_MODEL_REQUIRED | Explicitly choose the intended labelled model in DSH. |
| ACCOUNT_NOT_FOUND | The original environment was removed from the list. Select a target model explicitly. |
| ACCOUNT_IN_USE | Select another/default account and wait for in-flight calls. |
| ACCOUNT_PATH_INVALID | Preserve data; do not bypass path checks or copy tokens. |
| ACCOUNT_STORE_INVALID / BUSY | Retry later or report the metadata/lock issue without sharing credentials. Do not delete login directories to force a fallback. |

The plugin delegates login, credential refresh and model calls to the official CLI. Independent environments do not establish separate official authorization for an account pool. Real account and billing behavior remains subject to acceptance testing.

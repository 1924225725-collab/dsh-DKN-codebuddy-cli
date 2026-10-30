# Install and migrate — unified 1.0.3

1. Record each standalone plugin's CLI path, config directory, model, effort and deadline. Do not copy credentials.
2. With no active task, disable both standalone bundles and the older dsh-codebuddy-cli 0.4.4 preview in DSH. Keep old packages and sign-in/account directories.
3. Install dsh-dkn-codebuddy-cli-1.0.3.tgz and follow DSH's normal reload/restart requirements.
4. Open DKN CodeBuddy in the sidebar. Check both regions show runtime 1.0.3 and restore recorded settings where necessary. Old module-name profile overrides may not migrate automatically.
5. International retains ~/.dsh-codebuddy-cli-intl. China with a blank config directory uses the official default and no longer inherits CODEBUDDY_CONFIG_DIR; explicitly enter the previous directory if you depended on that variable.
6. Existing regional account roots and model prefixes remain unchanged. Separate default config directories are not proof of credential isolation; use isolated-account environments when required.
7. Test each provider in a new conversation before checking a harmless old conversation. Settings-page selection never reroutes a conversation.

If DSH reports DUPLICATE_ADAPTER, check that the old bundles are disabled. Do not delete sign-in files. To roll back, disable this bundle before re-enabling the standalone versions and restoring recorded settings. Actual old-profile/session migration has not yet been accepted in installed DSH.

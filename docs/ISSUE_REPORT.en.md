# Issue reports and evidence bundles

Open **DKN CodeBuddy → China / International → Report an issue**. Choose the region where the incident happened. Each region keeps separate descriptions, screenshots and diagnostic snapshots. Nothing is automatically uploaded or sent to QQ.

The form has three tiers marked with `#`:

| Marker | Fields | Can be left blank? |
| --- | --- | --- |
| Red — Required | Issue summary, actual result and at least one context screenshot | No |
| Yellow — Recommended | Steps, expected result, full error, incident time, DSH version, model, IDs, tool execution state, context, frequency and matching call | Yes; gaps are stated in the bundle |
| Normal — Optional | Missing-evidence reasons, network/proxy use, attempts, text supplements, captured raw samples and local diagnostic replacement | Yes |

1. Logs are read automatically when this region’s feedback pane opens, and refreshed before preview/export. No local log file or model test is needed. Unavailable diagnostics do not prevent a minimal report.
2. Fill in the summary and actual result and attach **at least one context screenshot**, ideally showing the error/ID, preceding request, tool result and selected model. Mask private pixels first. PNG/JPEG/WebP: 1–6 images; source and converted PNG each ≤5 MiB, total ≤20 MiB; ≤16 million pixels and maximum edge 8192 per image.
3. Optionally expand Recommended. The in-page record list follows the theme, supports search and prioritizes failures. Select the exact diagnostic ID if known; nearby calls are not proof. Never invent missing values.
4. Optionally expand Optional for attempts, network information and UTF-8 txt/md/json/log supplements: up to 3 files totaling 4 MiB. Common credential filenames are rejected. Do not include authentication files or an entire project/account directory.
5. Preview all text and screenshots, confirm they may be shared, then download the ZIP. Edits invalidate the preview and confirmation. The downloaded evidence is frozen for that preview; the browser or DSH controls the save location.

Log viewing, exports, one-failure capture and clearing are integrated under this page’s **Log tools**. These actions apply to the running regional plugin, not an imported file. Clearing loses retained evidence.

To replace automatic diagnostics, select a plugin diagnostic JSON export (up to 4 MiB), review and apply it. Arbitrary JSON/conversation exports are not accepted as diagnostic logs. A file declaring a different region or duplicate event IDs is rejected. Legacy files without region metadata require explicit confirmation. Local replacements are never merged with automatic logs; source and region verification are recorded in the ZIP. Restore automatic logs with one button and review the new preview again.

**Join QQ group 1095591284 and privately send the ZIP to the group owner.** Do not post unredacted conversations publicly. The plugin never contacts anyone automatically.

Basic diagnostics are the default. Including a raw failure reply requires explicit opt-in and an existing capture for the exact diagnostic ID. To collect one safely, read the integrated Log tools instructions and arm one-failure capture first. Raw replies for image requests remain excluded. Capture is never armed automatically; no model request is replayed. Do not repeat side-effecting tools merely to collect logs.

The ZIP contains `README.md`, `report.json`, `diagnostics.json`, `screenshots/context-*.png`, optional `supplements/context-*.txt`, and `manifest.json` with file byte sizes and SHA-256 hashes (excluding itself). User descriptions, automatic facts and evidence gaps are distinguished. Configuration paths are represented only by presence flags. Credentials, account labels, login commands, proxy configuration and original image paths are not automatically collected.

Screenshots are locally re-encoded as PNG without original file metadata. Common text secrets are masked on a best-effort basis. **Image pixels are not automatically redacted**, and manually selected exports may still contain secrets. Review everything; do not attach login QR codes, verification/recovery codes, cookies, passwords or credentials. Drafts exist only in page memory and disappear when the page closes or reloads.

This is a bounded evidence bundle, not a complete historical backup or guaranteed diagnosis. Missing IDs/services, different versions, active requests and absent raw replies/exports are explicitly recorded. Nearby calls do not prove the same failure; cancellations and image offloads are control events. Further targeted evidence or safe testing may still be needed.

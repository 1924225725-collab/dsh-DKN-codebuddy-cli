# Tool and result compatibility

[简体中文](工具适配范围.md) · [Home](../README.en.md)

For China 0.3.4. Tool names and argument schemas come from DSH at request time; there is no screenshot-tool name allowlist. DSH owns tool execution, permissions and history. Image support does not install a capture tool.

| Tool or result | Supported | Remaining limits |
|---|---|---|
| File, editing, command, search and other text tools | Forward DSH declarations, calls and text results | Installation and permission remain DSH responsibilities; every tool has not been tested individually |
| Desktop, monitor, window and region captures | Standard DSH image attachments in tool results | The capture tool decides what it can capture; the adapter never captures the screen itself |
| Browser page, element and long-page captures | The same standard attachments, without a name allowlist | Resizing tall images may blur text; crop or split when needed |
| Image reading, rendered charts and PDF-page renders | Standard image results | Binary documents must first be read or rendered by a DSH tool |
| MCP and third-party image results | Images normalized by DSH into attachment references | Raw MCP/Base64/custom objects are not automatically native image input |
| Paths, image URLs, data URLs and Base64 text | Preserve as text | No automatic path read or URL download; use a DSH image-reading tool |
| Original PDF, Word and Excel binaries | Text or rendered-image results from DSH tools | No native binary-document input to the CLI |
| Native audio, video and real-time screen streams | Not adapted | Tool transcripts and standard extracted image frames use text/image paths |
| Native model image generation and assistant image output | Not adapted | Independent DSH generation tools may still execute; their standard image results can become tool observations |

## Image provenance and limits

A standard tool result has `role: 'tool'`, a nonempty `toolCallId`, and a content array with `{ type: 'image', attachment: ImageAttachmentRef }`. DSH owns the bytes; a path or URL alone is insufficient. The adapter uses `attachments.readImageRequest`, preserving message role, call identity, text, image order and `isError`. A failed result may contain observable images without implying that the tool succeeded.

Uploads and tool images share one budget: at most 5 retained images, each converted to ≤2 MiB and longest edge ≤1920; combined Base64 ≤8 MiB, total request ≤20 MiB. DSH records older-image offloading; the adapter does not silently drop history. The selected model must declare image capability. Image bytes, Base64 and detailed failure replies are excluded from diagnostics for image histories.

## Troubleshooting and validation

Upgrade to 0.3.4 and restart for old tool-image errors. `IMAGE_TOOL_CALL_INVALID` means the producing tool/bridge omitted its call identity. `IMAGE_MODEL_UNSUPPORTED` requires a declared image model; `IMAGE_READ_FAILED` requires a fresh attachment; `IMAGE_OFFLOAD_REQUIRED` asks DSH to offload older occurrences. `CLI_LOCAL_PERMISSION_DENIED` means official CLI configuration/cache directory permissions need attention, even when its version command succeeds.

All 79 automated checks pass. Three official CLI 2.174.0 / deepseek-v4.1-flash adapter calls passed with synthetic tool images: tool-only, mixed upload/tool images, and a failed tool with a visible image. The attachment service was an isolated test implementation. No real desktop was captured, and actual desktop/browser/third-party capture-tool UI flows remain unverified.

[Fixed DSH image implementation](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-rc.3/packages/llm/llm-deepseek/src/images.ts) · [Official CodeBuddy image input](https://www.codebuddy.cn/docs/cli/headless)

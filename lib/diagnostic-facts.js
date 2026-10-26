// Only fixed categories and bounded facts may cross the ordinary-log boundary.
// Never add frame keys, native tool names, prompt text or raw notice bodies.
const enums = {
  channel: ['text-json', 'image-jsonl'],
  streamReason: ['none', 'json-parse', 'partial-tail', 'frame-shape', 'duplicate-init', 'missing-init', 'post-result-sequence', 'multiple-results', 'error-frame', 'permission-frame', 'native-tool-protocol', 'output-limit', 'spawn-failed', 'no-final-result', 'nonzero-exit', 'deadline', 'cancelled'],
  streamPhase: ['pre-start', 'awaiting-frame', 'receiving', 'after-result', 'draining', 'closed'],
  lastFrameClass: ['none', 'init', 'system', 'assistant', 'user', 'result', 'error', 'control', 'stream-event', 'other'],
  terminationInitiator: ['parser', 'deadline', 'caller', 'terminal-drain', 'process', 'spawn'],
  exitSignal: ['SIGTERM', 'SIGKILL', 'SIGINT', 'SIGABRT', 'SIGSEGV', 'other'],
  noticeClass: ['tool-protocol', 'balance', 'context', 'auth', 'access', 'rate-limit', 'local-permission', 'network', 'unknown'],
  noticeSource: ['stderr', 'stdout', 'error-frame', 'assistant-notice', 'final-result', 'none'],
  structuredOutputType: ['missing', 'undefined', 'null', 'object', 'array', 'string', 'number', 'boolean', 'other'],
  finalSubtypeClass: ['missing', 'success', 'error', 'max-turns', 'error-other', 'other'],
  controlClass: ['cancelled', 'image-offload']
}
const bounded = n => Number.isSafeInteger(n) && n >= 0 && n <= 2147483647
export function enumFacts(value, keys) {
  return Object.fromEntries(keys.filter(key => enums[key]?.includes(value?.[key])).map(key => [key, value[key]]))
}
export function processFacts(value) {
  const out = Object.fromEntries(['timeoutMs', 'elapsedMs', 'stdoutBytes', 'stderrBytes', 'frameIndex', 'frameBytes', 'totalFrames', 'initCount', 'finalResultCount']
    .filter(key => bounded(value?.[key])).map(key => [key, value[key]]))
  if (Number.isInteger(value?.exitCode) && value.exitCode >= -2147483648 && value.exitCode <= 4294967295) out.exitCode = value.exitCode
  for (const key of ['closeObserved', 'deadlineReached', 'firstFinalSeen', 'tailFrame']) if (typeof value?.[key] === 'boolean') out[key] = value[key]
  return { ...out, ...enumFacts(value, ['channel', 'streamReason', 'streamPhase', 'lastFrameClass', 'terminationInitiator', 'exitSignal']) }
}
export function nativeResultFacts(document) {
  const own = key => Object.hasOwn(document, key)
  const value = document.structured_output, subtype = document.subtype
  return { hasStructuredOutput: own('structured_output'),
    structuredOutputType: !own('structured_output') ? 'missing' : value === undefined ? 'undefined' : value === null ? 'null' : Array.isArray(value) ? 'array' : ['object', 'string', 'number', 'boolean'].includes(typeof value) ? typeof value : 'other',
    resultTypePresent: own('type'), resultTypeValid: document.type === 'result',
    finalSubtypeClass: !own('subtype') ? 'missing' : subtype === 'success' ? 'success' : subtype === 'error_max_turns' ? 'max-turns' : subtype === 'error' ? 'error' : typeof subtype === 'string' && subtype.startsWith('error_') ? 'error-other' : 'other' }
}
export function nativeFactSummary(value) {
  const out = enumFacts(value, ['structuredOutputType', 'finalSubtypeClass', 'noticeClass', 'noticeSource'])
  for (const key of ['hasStructuredOutput', 'resultTypePresent', 'resultTypeValid']) if (typeof value?.[key] === 'boolean') out[key] = value[key]
  return out
}

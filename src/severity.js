/**
 * parseLLMResponse
 * turns raw LLM text into an array of structured issue objects
 *
 * returns { issues: [], isClean: bool }
 */
const parseLLMResponse = (raw) => {
  const trimmed = raw.trim()

  if (trimmed === 'CLEAN') {
    return { issues: [], isClean: true }
  }

  const issueBlocks = trimmed.split('ISSUE').slice(1) // split on ISSUE keyword

  const issues = issueBlocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)

    const get = (key) => {
      const line = lines.find(l => l.toLowerCase().startsWith(key + ':'))
      return line ? line.slice(key.length + 1).trim() : 'unknown'
    }

    return {
      severity: get('severity').toUpperCase(),
      type:     get('type'),
      file:     get('file'),
      line:     get('line'),
      problem:  get('problem'),
      fix:      get('fix'),
    }
  }).filter(i => i.severity !== 'unknown')

  // sort: CRITICAL first, then WARNING, then INFO
  const order = { CRITICAL: 0, WARNING: 1, INFO: 2 }
  issues.sort((a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3))

  const hasCritical = issues.some(i => i.severity === 'CRITICAL')

  return { issues, isClean: issues.length === 0, hasCritical }
}

module.exports = { parseLLMResponse }
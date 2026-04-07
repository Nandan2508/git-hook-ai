require('dotenv').config()
const { getDiff, formatDiffForLLM } = require('./diff')
const { analyzeCode }               = require('./analyzer')
const { parseLLMResponse }          = require('./severity')
const {
  printHeader, printClean, printIssue,
  printBlocked, printAllowed, printNoFiles, printError
} = require('./printer')

const run = async () => {
  printHeader()

  // 1. extract staged diffs
  const diffs = getDiff()
  if (diffs.length === 0) {
    printNoFiles()
    process.exit(0)
  }

  const formattedDiff = formatDiffForLLM(diffs)

  // 2. send to groq
  let content, latencyMs
  try {
    ;({ content, latencyMs } = await analyzeCode(formattedDiff))
  } catch (err) {
    // if groq is down or key is missing, don't block the commit
    printError(err.message)
    process.exit(0)
  }

  // 3. parse response
  const { issues, isClean, hasCritical } = parseLLMResponse(content)

  // 4. print each issue
  issues.forEach((issue, i) => printIssue(issue, i))

  // 5. decide: block or allow
  if (isClean) {
    printClean(latencyMs)
    process.exit(0)
  }

  if (hasCritical) {
    const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length
    printBlocked(criticalCount, latencyMs)
    process.exit(1) // non-zero exit = git blocks the commit
  }

  // only warnings/info — allow
  const warningCount = issues.filter(i => i.severity === 'WARNING').length
  printAllowed(warningCount, latencyMs)
  process.exit(0)
}

run()
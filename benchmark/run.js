require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const fs   = require('fs')
const path = require('path')
const chalk = require('chalk')
const { analyzeCode }    = require('../src/analyzer')
const { parseLLMResponse } = require('../src/severity')
const { computeMetrics } = require('./results')

const BUGGY_DIR = path.join(__dirname, 'dataset/buggy')
const CLEAN_DIR = path.join(__dirname, 'dataset/clean')

// wrap a file's content to look like a git diff
const fakeDiff = (filename, content) => {
  const lines = content.split('\n').map(l => `+${l}`).join('\n')
  return `--- FILE: ${filename} ---\n+++ b/${filename}\n${lines}`
}

const runOnDir = async (dir, expectedLabel) => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') || f.endsWith('.ts'))
  const results = []

  for (const file of files) {
    const filepath = path.join(dir, file)
    const content  = fs.readFileSync(filepath, 'utf8')
    const diff     = fakeDiff(file, content)

    process.stdout.write(`  testing ${chalk.cyan(file.padEnd(35))}`)

    try {
      const { content: llmResponse, latencyMs } = await analyzeCode(diff)
      const { issues, isClean, hasCritical }     = parseLLMResponse(llmResponse)

      // detected = LLM raised at least a WARNING or CRITICAL
      const detected = !isClean && issues.some(i =>
        i.severity === 'CRITICAL' || i.severity === 'WARNING'
      )

      const correct = expectedLabel === 'buggy' ? detected : !detected
      const mark    = correct ? chalk.green('✔') : chalk.red('✖')
      const topSev  = issues[0]?.severity ?? 'CLEAN'

      console.log(`${mark}  ${chalk.gray(topSev.padEnd(10))} ${chalk.gray(latencyMs + 'ms')}`)

      results.push({ file, expected: expectedLabel, detected, latencyMs, issues })
    } catch (err) {
      console.log(chalk.yellow('  ⚠ error: ' + err.message))
      results.push({ file, expected: expectedLabel, detected: false, latencyMs: 0, issues: [], error: true })
    }

    // small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  return results
}

const printTable = (metrics) => {
  console.log('')
  console.log(chalk.bold('┌──────────────────────────────────────────────┐'))
  console.log(chalk.bold('│              Benchmark Results                │'))
  console.log(chalk.bold('├──────────────────────────────────────────────┤'))
  console.log(`│  ${chalk.cyan('Precision')}          ${String(metrics.precision + '%').padStart(8)}  (lower = more false alarms)  │`)
  console.log(`│  ${chalk.cyan('Recall')}             ${String(metrics.recall    + '%').padStart(8)}  (lower = missing more bugs)  │`)
  console.log(`│  ${chalk.cyan('F1 Score')}           ${String(metrics.f1        + '%').padStart(8)}  (harmonic mean)              │`)
  console.log(`│  ${chalk.cyan('Accuracy')}           ${String(metrics.accuracy  + '%').padStart(8)}                               │`)
  console.log(`│  ${chalk.cyan('False Positive Rate')}${String(metrics.fpr       + '%').padStart(8)}  (clean files flagged)        │`)
  console.log(chalk.bold('├──────────────────────────────────────────────┤'))
  console.log(`│  ${chalk.cyan('Avg Latency')}        ${String(metrics.avgLatencyMs + 'ms').padStart(8)}                               │`)
  console.log(`│  ${chalk.cyan('p90 Latency')}        ${String(metrics.p90LatencyMs + 'ms').padStart(8)}                               │`)
  console.log(chalk.bold('├──────────────────────────────────────────────┤'))
  console.log(`│  TP ${metrics.TP}  FP ${metrics.FP}  FN ${metrics.FN}  TN ${metrics.TN}                                │`)
  console.log(chalk.bold('└──────────────────────────────────────────────┘'))
}

const saveResults = (allResults, metrics) => {
  const output = {
    timestamp: new Date().toISOString(),
    model: 'llama-3.1-8b-instant',
    metrics,
    results: allResults,
  }
  const outPath = path.join(__dirname, 'benchmark_results.json')
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2))
  console.log(chalk.gray(`\n  results saved to benchmark/benchmark_results.json`))
}

const main = async () => {
  console.log('')
  console.log(chalk.bold('🔬 AI Git Hook — Benchmark Runner'))
  console.log(chalk.gray('   model: llama-3.1-8b-instant via Groq'))
  console.log('')

  console.log(chalk.bold('── Buggy files (expect: DETECTED) ──'))
  const buggyResults = await runOnDir(BUGGY_DIR, 'buggy')

  console.log('')
  console.log(chalk.bold('── Clean files (expect: PASSED) ──'))
  const cleanResults = await runOnDir(CLEAN_DIR, 'clean')

  const allResults = [...buggyResults, ...cleanResults]
  const metrics    = computeMetrics(allResults)

  printTable(metrics)
  saveResults(allResults, metrics)
}

main().catch(err => {
  console.error(chalk.red('benchmark failed:'), err.message)
  process.exit(1)
})
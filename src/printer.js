const chalk = require('chalk')

const ICONS = {
  CRITICAL: '✖',
  WARNING:  '⚠',
  INFO:     '●',
}

const COLORS = {
  CRITICAL: chalk.bgRed.white.bold,
  WARNING:  chalk.bgYellow.black.bold,
  INFO:     chalk.bgBlue.white.bold,
}

const printHeader = () => {
  console.log('')
  console.log(chalk.bold('┌─────────────────────────────────────────┐'))
  console.log(chalk.bold('│        🤖  AI Pre-Commit Review          │'))
  console.log(chalk.bold('└─────────────────────────────────────────┘'))
  console.log('')
}

const printClean = (latencyMs) => {
  console.log(chalk.green.bold('  ✔  No issues found — commit approved'))
  console.log(chalk.gray(`     reviewed in ${latencyMs}ms`))
  console.log('')
}

const printIssue = (issue, index) => {
  const badge   = COLORS[issue.severity] || chalk.gray.bold
  const icon    = ICONS[issue.severity]  || '○'
  const num     = chalk.gray(`[${index + 1}]`)

  console.log(`  ${num} ${badge(` ${icon} ${issue.severity} `)}  ${chalk.bold(issue.type)}`)
  console.log(`       ${chalk.cyan('file:')}    ${issue.file}  ${chalk.gray('line ' + issue.line)}`)
  console.log(`       ${chalk.cyan('problem:')} ${issue.problem}`)
  console.log(`       ${chalk.cyan('fix:')}     ${chalk.green(issue.fix)}`)
  console.log('')
}

const printBlocked = (criticalCount, latencyMs) => {
  console.log(chalk.red.bold('  ✖  COMMIT BLOCKED'))
  console.log(chalk.red(`     ${criticalCount} critical issue${criticalCount > 1 ? 's' : ''} must be fixed before committing`))
  console.log(chalk.gray(`     reviewed in ${latencyMs}ms`))
  console.log(chalk.gray('     to skip: git commit --no-verify'))
  console.log('')
}

const printAllowed = (warningCount, latencyMs) => {
  console.log(chalk.yellow.bold('  ⚠  COMMIT ALLOWED with warnings'))
  console.log(chalk.yellow(`     ${warningCount} warning${warningCount > 1 ? 's' : ''} — consider fixing before pushing`))
  console.log(chalk.gray(`     reviewed in ${latencyMs}ms`))
  console.log('')
}

const printNoFiles = () => {
  console.log(chalk.gray('  ○  No supported code files staged — skipping AI review'))
  console.log('')
}

const printError = (msg) => {
  console.log(chalk.yellow('  ⚠  AI review failed:'), chalk.gray(msg))
  console.log(chalk.gray('     commit allowed — fix your GROQ_API_KEY if this keeps happening'))
  console.log('')
}

module.exports = {
  printHeader,
  printClean,
  printIssue,
  printBlocked,
  printAllowed,
  printNoFiles,
  printError,
}
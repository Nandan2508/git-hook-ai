const { execSync } = require('child_process')

// file extensions we care about — no point scanning lock files or images
const SUPPORTED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.py', '.go', '.java', '.c', '.cpp',
  '.rb', '.php', '.rs',
]

const isSupportedFile = (filename) =>
  SUPPORTED_EXTENSIONS.some(ext => filename.endsWith(ext))

/**
 * getDiff
 * returns array of { filename, diff } for all staged code files
 */
const getDiff = () => {
  try {
    // get list of staged files
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean)
      .filter(isSupportedFile)

    if (stagedFiles.length === 0) return []

    // get the actual diff for each file
    const diffs = stagedFiles.map(filename => {
      try {
        const diff = execSync(`git diff --cached -- "${filename}"`, { encoding: 'utf8' })
        return { filename, diff }
      } catch {
        return null
      }
    }).filter(Boolean)

    return diffs
  } catch (err) {
    console.error('[ai-hook] failed to get git diff:', err.message)
    return []
  }
}

/**
 * formatDiffForLLM
 * trims diffs to avoid hitting token limits
 * keeps first 200 lines of each file diff
 */
const formatDiffForLLM = (diffs) => {
  return diffs.map(({ filename, diff }) => {
    const lines = diff.split('\n').slice(0, 200).join('\n')
    return `--- FILE: ${filename} ---\n${lines}`
  }).join('\n\n')
}

module.exports = { getDiff, formatDiffForLLM }
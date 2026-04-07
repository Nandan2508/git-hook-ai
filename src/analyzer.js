
// require('dotenv').config()

// const SYSTEM_PROMPT = `
// You are a senior engineer reviewing git diffs for security vulnerabilities and logic bugs.

// SECURITY — Flag confirmed instances of:
// 1. Hardcoded secret, API key, password, or token — whether assigned directly or nested inside a config/options object (string literal, not process.env)
// 2. SQL injection — unsanitized user input in raw SQL strings, including ORM raw queries (e.g. sequelize.query with user input concatenated or interpolated)
// 3. Path traversal — req.query / req.params / req.body used inside path.join or fs calls WITHOUT path.basename() or equivalent guard
// 4. Auth bypass — removal of authentication or authorization checks
// 5. RCE vector — exec/eval/child_process where the command string contains user-controlled input
// 6. SSRF — user-controlled URL passed directly to fetch/axios/http.get without hostname validation against an allowlist
// 7. Mass assignment — req.body spread or assigned directly to a model/object without field whitelisting (e.g. Object.assign(user, req.body))
// 8. Insecure direct comparison — secrets or tokens compared with === instead of crypto.timingSafeEqual

// LOGIC — Flag confirmed instances of:
// 9. Off-by-one — loop that starts at i=1 instead of i=0, or uses i < arr.length - 1, silently skipping first or last element
// 10. Unhandled rejection — async function with await but no try/catch, OR .then() with no .catch(), where errors crash silently

// ALWAYS CLEAN — never flag these:
// - process.env usage for secrets
// - Adding null checks, guards, or early returns
// - Adding try/catch or error handling
// - Refactors, renames, or logic improvements with no risk
// - .catch() present on a promise chain
// - crypto.timingSafeEqual usage for password or hash comparison
// - exec/child_process where the command is a fully hardcoded string with no user input
// - path.join used together with path.basename() on user input
// - fetch/axios with hostname validated against an allowlist before the call
// - Object.assign or spread where fields are explicitly destructured first

// If safe: respond only with CLEAN
// If an issue exists:
// ISSUE
// severity: CRITICAL | WARNING
// type: security | logic
// file: <filename>
// line: <line>
// problem: <exact problem in one sentence>
// fix: <exact fix in one sentence>
// END
// `.trim()

// const analyzeCode = async (formattedDiff) => {
//   const start = Date.now()

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           system_instruction: {
//             parts: [{ text: SYSTEM_PROMPT }]
//           },
//           contents: [{
//             parts: [{ text: `Review this diff:\n\n${formattedDiff}` }]
//           }],
//           generationConfig: {
//             temperature: 0,
//             maxOutputTokens: 500
//           }
//         })
//       }
//     )

//     const data = await response.json()
//     const latencyMs = Date.now() - start
//     console.log('Gemini raw:', JSON.stringify(data).slice(0, 300)) // 
//     const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? 'CLEAN'

//     return { content, latencyMs }
//   } catch (error) {
//     console.error('Gemini error:', error.message)
//     return { content: 'CLEAN', latencyMs: Date.now() - start }
//   }
// }

// module.exports = { analyzeCode }

//----------------------GROQ--------------------------//


require('dotenv').config()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `
You are a senior engineer reviewing git diffs for security vulnerabilities and logic bugs.

SECURITY — Flag confirmed instances of:
1. Hardcoded secret, API key, password, or token — whether assigned directly or nested inside a config/options object (string literal, not process.env)
2. SQL injection — unsanitized user input in raw SQL strings, including ORM raw queries (e.g. sequelize.query with user input concatenated or interpolated)
3. Path traversal — req.query / req.params / req.body used inside path.join or fs calls WITHOUT path.basename() or equivalent guard
4. Auth bypass — removal of authentication or authorization checks
5. RCE vector — exec/eval/child_process where the command string contains user-controlled input
6. SSRF — user-controlled URL passed directly to fetch/axios/http.get without hostname validation against an allowlist
7. Mass assignment — req.body spread or assigned directly to a model/object without field whitelisting (e.g. Object.assign(user, req.body))
8. Insecure direct comparison — secrets or tokens compared with === instead of crypto.timingSafeEqual

LOGIC — Flag confirmed instances of:
9. Off-by-one — loop that starts at i=1 instead of i=0, or uses i < arr.length - 1, silently skipping first or last element
10. Unhandled rejection — async function with await but no try/catch, OR .then() with no .catch(), where errors crash silently

ALWAYS CLEAN — never flag these:
- process.env usage for secrets
- Adding null checks, guards, or early returns
- Adding try/catch or error handling
- Refactors, renames, or logic improvements with no risk
- .catch() present on a promise chain
- crypto.timingSafeEqual usage for password or hash comparison
- exec/child_process where the command is a fully hardcoded string with no user input
- path.join used together with path.basename() on user input
- fetch/axios with hostname validated against an allowlist before the call
- Object.assign or spread where fields are explicitly destructured first

If safe: respond only with CLEAN
If an issue exists:
ISSUE
severity: CRITICAL | WARNING
type: security | logic
file: <filename>
line: <line>
problem: <exact problem in one sentence>
fix: <exact fix in one sentence>
END
`.trim()

const analyzeCode = async (formattedDiff) => {
  const start = Date.now()

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0,
      max_tokens: 500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Review this diff:\n\n${formattedDiff}` }
      ],
      stop: ["END\n\n"]
    })

    const latencyMs = Date.now() - start
    const content = response.choices[0]?.message?.content?.trim() ?? 'CLEAN'

    return { content, latencyMs }
  } catch (error) {
    console.error('Groq error:', error.message)
    return { content: 'CLEAN', latencyMs: Date.now() - start }
  }
}

module.exports = { analyzeCode }
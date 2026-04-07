// clean/09 — constant-time comparison prevents timing attacks
const crypto = require('crypto')

const login = (inputPassword, storedHash) => {
  const inputHash = crypto.createHash('sha256').update(inputPassword).digest('hex')
  const match = crypto.timingSafeEqual(
    Buffer.from(inputHash),
    Buffer.from(storedHash)
  )
  if (match) return { success: true, token: generateToken() }
  return { success: false }
}
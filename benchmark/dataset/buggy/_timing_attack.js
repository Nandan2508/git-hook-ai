// Timing attack vulnerability
// string comparison leaks info about password length via timing

const login = (inputPassword, storedPassword) => {
  if (inputPassword === storedPassword) {
    return { success: true, token: generateToken() }
  }
  return { success: false }
}
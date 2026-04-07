// clean/01 — parameterized query, no injection possible
const getUser = (username) => {
  return db.execute('SELECT * FROM users WHERE username = ?', [username])
}
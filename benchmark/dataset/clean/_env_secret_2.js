
const config = {
  server: { port: process.env.PORT || 3000 },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  }
}

module.exports = config
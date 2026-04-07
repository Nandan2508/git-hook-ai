// Path traversal vulnerability
// attacker can read any file on the server with ../../etc/passwd

const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.get('/file', (req, res) => {
  const filename = req.query.name
  const filePath = path.join('/var/www/uploads', filename)
  res.send(fs.readFileSync(filePath, 'utf8'))
})
// clean/10 — path sanitized, traversal not possible
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

const UPLOADS_DIR = '/var/www/uploads'

app.get('/file', (req, res) => {
  const filename = path.basename(req.query.name) // strips any ../ traversal
  const filePath = path.join(UPLOADS_DIR, filename)

  if (!filePath.startsWith(UPLOADS_DIR)) {
    return res.status(403).send('Forbidden')
  }

  res.send(fs.readFileSync(filePath, 'utf8'))
})
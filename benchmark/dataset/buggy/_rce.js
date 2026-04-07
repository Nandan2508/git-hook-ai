// User-controlled input passed directly to exec
const { exec } = require('child_process')

const runReport = (req, res) => {
  const tool = req.query.tool
  exec(`/usr/bin/${tool} --report`, (err, stdout) => {
    res.send(stdout)
  })
}
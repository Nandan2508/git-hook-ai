// Tool hardcoded, no user input reaches exec — safe
const { exec } = require('child_process')

const runReport = (res) => {
  exec('/usr/bin/audit-tool --report', (err, stdout) => {
    if (err) return res.status(500).send('Report failed')
    res.send(stdout)
  })
}
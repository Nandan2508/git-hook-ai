// DVNA — Remote Code Execution
// exec() with unsanitized req.body.address

const exec = require('child_process').exec

module.exports.ping = function (req, res) {
  exec('ping -c 2 ' + req.body.address, function (err, stdout, stderr) {
    output = stdout + stderr
    res.render('app/ping', { output: output })
  })
}

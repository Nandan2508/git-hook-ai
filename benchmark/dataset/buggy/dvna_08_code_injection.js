// DVNA — Code Injection
// mathjs.eval() on unsanitized user input — allows arbitrary expression execution

var mathjs = require('mathjs')

module.exports.calc = function (req, res) {
  if (req.body.eqn) {
    res.render('app/calc', {
      output: mathjs.eval(req.body.eqn)
    })
  } else {
    res.render('app/calc', {
      output: 'Enter a valid math string like (3+3)*2'
    })
  }
}

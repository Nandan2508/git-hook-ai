// DVNA — SQL Injection
// raw string concatenation in sequelize.query()

var db = require('../models')
const Op = db.Sequelize.Op

module.exports.userSearch = function (req, res) {
  var query = "SELECT name,id FROM Users WHERE login='" + req.body.login + "'"
  db.sequelize.query(query, {
    model: db.User
  }).then(user => {
    if (user.length) {
      res.render('app/usersearch', { output: { user: { name: user[0].name, id: user[0].id } } })
    } else {
      req.flash('warning', 'User not found')
      res.render('app/usersearch', { output: null })
    }
  }).catch(err => {
    req.flash('danger', 'Internal Error')
    res.render('app/usersearch', { output: null })
  })
}

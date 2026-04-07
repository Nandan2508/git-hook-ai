// DVNA — Open Redirect
// res.redirect() with unvalidated req.query.url

module.exports.redirect = function (req, res) {
  if (req.query.url) {
    res.redirect(req.query.url)
  } else {
    res.send('invalid redirect url')
  }
}

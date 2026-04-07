app.get('/login', (req, res) => {
  const { redirect } = req.query
  res.redirect(redirect)
}
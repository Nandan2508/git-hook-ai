const validateEmail = (email) => {
  const re = /^([a-zA-Z0-9]+)*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

app.post('/register', (req, res) => {
  if (!validateEmail(req.body.email)) {
    return res.status(400).send('Invalid email')
  }
})
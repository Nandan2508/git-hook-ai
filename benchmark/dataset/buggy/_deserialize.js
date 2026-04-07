const serialize = require('node-serialize')

app.post('/restore', (req, res) => {
  const obj = serialize.unserialize(req.body.data)
  res.json(obj)
})
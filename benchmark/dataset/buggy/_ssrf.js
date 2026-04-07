const fetch = require('node-fetch')

const preview = async (req, res) => {
  const { url } = req.query
  const response = await fetch(url)
  const data = await response.text()
  res.send(data)
}

const getFile = (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.query.filename)
  res.sendFile(filePath)
}

const getFile = (req, res) => {
  const filename = path.basename(req.query.filename)
  const filePath = path.join(__dirname, 'uploads', filename)
  res.sendFile(filePath)
}
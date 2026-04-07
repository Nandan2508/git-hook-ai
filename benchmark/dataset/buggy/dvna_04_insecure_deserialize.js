// DVNA — Insecure Deserialization
// node-serialize.unserialize() on user-uploaded file data

var serialize = require("node-serialize")
var db = require('../models')

module.exports.bulkProductsLegacy = function (req, res) {
  if (req.files.products) {
    var products = serialize.unserialize(req.files.products.data.toString('utf8'))
    products.forEach(function (product) {
      var newProduct = new db.Product()
      newProduct.name = product.name
      newProduct.code = product.code
      newProduct.tags = product.tags
      newProduct.description = product.description
      newProduct.save()
    })
    res.redirect('/app/products')
  } else {
    res.render('app/bulkproducts', { messages: { danger: 'Invalid file' }, legacy: true })
  }
}

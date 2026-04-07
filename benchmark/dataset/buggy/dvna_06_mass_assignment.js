// DVNA — Mass Assignment
// req.body fields assigned directly to model without whitelist

var db = require('../models')

module.exports.modifyProductSubmit = function (req, res) {
  if (!req.body.id || req.body.id == '') {
    req.body.id = 0
  }
  db.Product.find({ where: { 'id': req.body.id } }).then(product => {
    if (!product) {
      product = new db.Product()
    }
    product.code        = req.body.code
    product.name        = req.body.name
    product.description = req.body.description
    product.tags        = req.body.tags
    product.save().then(p => {
      if (p) {
        req.flash('success', 'Product added/modified!')
        res.redirect('/app/products')
      }
    }).catch(err => {
      req.flash('danger', err)
      res.render('app/modifyproduct', { output: { product: product } })
    })
  })
}

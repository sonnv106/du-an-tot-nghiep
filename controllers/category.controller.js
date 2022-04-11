var Product = require("../models/product.model");
var Category = require("../models/category.model");
var jwt = require("jsonwebtoken");

module.exports.getall = async (req, res)=>{
  var categories = await Category.find();
  res.render('category/getall', {
    categories: categories
  })
}
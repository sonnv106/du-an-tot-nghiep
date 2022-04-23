var Product = require("../models/product.model");
var Category = require("../models/category.model");
var cloudinary = require("../cloudinary");
var jwt = require("jsonwebtoken");

module.exports.getall = async (req, res) => {
  var categories = await Category.find();
  res.render("category/getall", {
    categories: categories,
  });
};
module.exports.getUpdate = async (req, res) => {
  var id = req.params.id;
  var category = await Category.findOne({ _id: id });
  res.render("category/update", {
    category: category,
  });
};
module.exports.postUpdate = async (req, res) => {
  var id = req.params.id;
  var category = await Category.findOne({ _id: id });
  var image = await cloudinary.uploader.upload(req.file.path);
  var categories = await Category.find();
  category.name = req.body.name;
  category.detail = req.body.detail;
  category.postion = req.body.position;
  category.image = image.secure_url;
  await category.save();
  res.render("category/getall", {
    categories: categories,
  });
};
module.exports.delete = async (req, res) => {
  res.render();
};

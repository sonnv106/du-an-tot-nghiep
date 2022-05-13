var Product = require("../models/product.model");
var User = require("../models/user.model");
var Category = require("../models/category.model");
var cloudinary = require("../cloudinary");
var Variant = require("../models/variant.model");
var jwt = require("jsonwebtoken");

module.exports.getall = async (req, res) => {
  var variants = await Variant.find();
  var data = [];

  for (var variant of variants) {
    var product = await Product.findOne({ _id: variant.product_id });
    var item = {
      id: variant.id,
      product_id: variant.product_id,
      size: variant.size, //kích cỡ
      smell: variant.smell, //hương vị
      color: variant.color, //màu sắc
      amount: variant.amount, //số lượng
      mfg: variant.mfg, //ngày sản xuất
      exp: variant.exp, //hạn sử dụng
      measure: variant.measure, //đơn vị tính
      import_price: variant.import_price, //gia nhap
      price: variant.price,
      amount: variant.amount,
      origin: product.orgin,
      image: product.image,
      name: product.name,
    };
    data.push(item);
  }
  console.log(data);

  res.render("variant/getall", {
    variants: data,
  });
};
module.exports.getCreate = async (req, res) => {
  var product = await Product.findOne({ _id: req.params.id });
  res.render("variant/create", {
    product_id: req.params.id,
    name: product.name,
  });
};

module.exports.create = async (req, res) => {
  console.log(req.body.product_id);
  var data = {
    product_id: req.body.product_id,
    size: req.body.size, //kích cỡ
    smell: req.body.smell, //hương vị
    color: req.body.color, //màu sắc
    amount: req.body.amount, //số lượng
    mfg: req.body.mfg, //ngày sản xuất
    exp: req.body.exp, //hạn sử dụng
    measure: req.body.measure, //đơn vị tính
    import_price: req.body.import_price, //gia nhap
    price: req.body.price,
    date: req.body.date,
    quantily: req.body.quantily,
  };
  await Variant.create(data);
};

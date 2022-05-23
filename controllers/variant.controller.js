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
  const urls = [];
  console.log(req);
  const files = req.files;
  console.log(files);
  for (var file of files) {
    const path = file.path;
    const newPath = await cloudinary.uploader.upload(path);
    urls.push(newPath.secure_url);
  }

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
    image: urls,
  };
  await Variant.create(data);
  res.redirect("/products/getall");
};
module.exports.getUpdate = async (req, res) => {
  var variant = await Variant.findOne({ _id: req.params.id });
  console.log(variant);
  res.render("variant/update", {
    variant: variant,
  });
};
module.exports.postUpdate = async (req, res)=>{
  var product_id = req.params.id;
  
  var variant = await Variant.findOne({ _id: product_id });
  const urls = [];
  const files = req.files;
  for (var file of files) {
    const path = file.path;
    const newPath = await cloudinary.uploader.upload(path);
    urls.push(newPath.secure_url);
  }
   (variant.image = urls.length?urls:variant.image),
    (variant.size = req.body.size),
     (variant.amount = req.body.amount),
    (variant.import_price = parseInt(req.body.import_price)), //gia nhap
    (variant.price = parseInt(req.body.price)),
    (variant.mfg = req.body.mfg), 
    (variant.exp = req.body.exp),
    (variant.measure = req.body.measure)
  await variant.save();
  console.log(variant)
  res.redirect("/products/getall");
}
module.exports.delete = async (req, res) => {
  var id = req.params.id;
  var product = await Variant.findOne({ _id: id });
  if (!product) {
    return;
  } else {
    await Variant.deleteOne({ _id: id });
    res.redirect("/products/getall");
  }
};

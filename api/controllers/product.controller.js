var Product = require("../../models/product.model");
var cloudinary = require("../../cloudinary");
var Category = require("../../models/category.model");
var Variant = require('../../models/variant.model')

module.exports.getAll = async function(req, res) {
  var products = await Product.find();
  res.json(products);
};
module.exports.createProduct = async (req, res) => {
  
  if(!(req.body.name && req.body.import_price && req.body.price && req.body.category && req.body.quantily)){
    res.send('Khai bao thong tin chua day du');
    return;
  }else{
    var image = await cloudinary.uploader.upload(req.file.path);
    var data = {
      name: req.body.name,
      packaging: req.body.packaging,  //quy cach
      import_price: req.body.import_price,  //gia nhap
      price: req.body.price,
      ingredients: req.body.ingredients,  //thanhphan
      weight: req.body.weight,
      date: req.body.date, 
      preserve: req.body.preserve,  // bao quan
      source: req.body.source,
      certificate: req.body.certificate,  //chung chi
      warning: req.body.warning,
      origin: req.body.origin,
      detail: req.body.detail,  //chi tiet
      quantily: req.body.quantily,  //soluong
      category: req.body.category,  
      image: image.secure_url
    }
  }
  
  var product = await Product.create(data);
  res.json(product);
};
module.exports.getProductCategory = async (req, res)=>{
  var category = await Category.findOne({_id:req.params.id })
  var products = await Product.find({category: category.name})
  res.json(products)
}
module.exports.getProductById = async (req, res) => {
  var product = await Product.findOne({ _id: req.params.product_id });
  if (product) {
    res.json(product);
  } else {
    res.json("Khong tim thay");
  }
};
module.exports.getDetail = async (req, res)=>{
  var id= req.params.id;
  console.log(id)
  var product = await Product.findOne({_id: id})
  var variants = await Variant.find({product_id: id})
  var data = [];
  for(var variant of variants){
    var object = {
      _id:variant.id,
      product_id: variant.product_id,
      image: variant.image,
      name: product.name,
      size: variant.size,
      smell: variant.smell,
      color: variant.color,
      amount: variant.amount,
      mfg: variant.mfg,
      exp: variant.exp,
      measure: variant.measure,
      import_price: variant.import_price,
      price: variant.price,
      ingredients: product.ingredients,
      preserve: product.preserve,
      soure: product.soure,
      certificate: product.certificate,
      warning: product.warning,
      origin: product.origin,
      detail: product.detail,
      category: product.category
    }
      data.push(object)
  }
  res.json(data)
}

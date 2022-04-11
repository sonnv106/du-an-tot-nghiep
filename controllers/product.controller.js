var Product = require("../models/product.model");
var User = require("../models/user.model");
var Category = require("../models/category.model");
var cloudinary = require("../cloudinary");
var jwt = require("jsonwebtoken");

module.exports.getIndex = async (req, res, next) => {
  var products = await Product.find();
  var decode = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
  var user = await User.findOne({ email: decode.email });
  res.render("products", {
    products: products,
    user: user,
  });
};

module.exports.getCreate = async (req, res) => {
  var categories = await Category.find();
  res.render("product/create", {
    categories: categories,
  });
};

module.exports.postCreate = async (req, res, next) => {
  var products = await Product.find();
  var categories = await Category.find();
  // var image = await cloudinary.uploader.upload(req.file.path);
  const urls = [];
  const files = req.files;
  for (var file of files) {
    const path = file.path;
    const newPath = await cloudinary.uploader.upload(path);
    urls.push(newPath.secure_url);
  }

  var errors = [];
  if (!req.body.name) {
    errors.push("Name is required");
  }
  if (!req.body.import_price) {
    errors.push("import_price is required");
  }
  if (!req.body.price) {
    errors.push("price is required");
  }
  if (!req.body.quantily) {
    errors.push("quantily is required");
  }

  if (errors.length) {
    res.render("product/create", {
      errors: errors,
      products: products,
      values: req.body,
      categories: categories,
    });
  }

  var data = {
    name: req.body.name,
    packaging: req.body.packaging, //quy cach
    import_price: parseInt(req.body.import_price), //gia nhap
    price: parseInt(req.body.price),
    ingredients: req.body.ingredients, //thanhphan
    weight: req.body.weight,
    date: req.body.date,
    preserve: req.body.preserve, // bao quan
    source: req.body.source,
    certificate: req.body.certificate, //chung chi
    warning: req.body.warning,
    origin: req.body.origin,
    detail: req.body.detail, //chi tiet
    quantily: req.body.quantily, //soluong
    category: req.body.category,
    image: urls,
  };
  console.log(data);
  await Product.create(data).then((result) => console.log(result));
  res.redirect("/products");
};
module.exports.getDetailProduct = async (req, res, next) => {
  var id = req.params.id;
  var product = await Product.findOne({ _id: id });

  res.render("product/product-detail", {
    product: product,
  });
  next();
};

module.exports.getall = async (req, res) => {
  var products = await Product.find();
  var decode = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
  var user = await User.findOne({ email: decode.email });
  res.render("product/getall", {
    products: products,
    user: user,
  });
};
module.exports.getupdate = async (req, res) => {
  var id = req.params.id;
  var product = await Product.findOne({ _id: id });
  var categories = await Category.find();
  res.render("product/update", {
    product: product,
    categories: categories,
  });
};
module.exports.postupdate = async (req, res) => {
  var id = req.params.id;
  var product = await Product.findOne({ _id: id });
  var categories = await Category.find();
  const urls = [];
  const files = req.files;
  for (var file of files) {
    const path = file.path;
    const newPath = await cloudinary.uploader.upload(path);
    urls.push(newPath.secure_url);
  }
  (product.name = req.body.name),
    (product.packaging = req.body.packaging), //quy cach
    (product.import_price = parseInt(req.body.import_price)), //gia nhap
    (product.price = parseInt(req.body.price)),
    (product.ingredients = req.body.ingredients), //thanhphan
    (product.weight = req.body.weight),
    (product.date = req.body.date),
    (product.preserve = req.body.preserve), // bao quan
    (product.source = req.body.source),
    (product.certificate = req.body.certificate), //chung chi
    (product.warning = req.body.warning),
    (product.origin = req.body.origin),
    (product.detail = req.body.detail), //chi tiet
    (product.quantily = req.body.quantily), //soluong
    (product.category = req.body.category),
    (product.image = urls),
    console.log(product)
    await product.save();
    res.redirect("/products/getall");
};
module.exports.deleteProduct = async (req, res)=>{
  var id = req.params.id;
  var product = await Product.findOne({ _id: id });
  if (!product) {
    return;
  } else {
    await Product.deleteOne({ _id: id });
    res.redirect("/products/getall");
    console.log("Delete success!");
  }
}
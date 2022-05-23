var Product = require("../models/product.model");
var User = require("../models/user.model");
var Category = require("../models/category.model");
var Variant = require("../models/variant.model")
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
  var productExists = await Product.findOne({name: req.body.name})
  
  var errors = [];
  if (!req.body.name) {
    errors.push("Tên phải được khai báo");
  }
  if (!req.body.ingredients) {
    errors.push("Thành phần phải được khai báo");
  }
  if(productExists){
    errors.push("Sản phẩm đã tồn tại")
  }
  
  if (errors.length) {
    res.render("product/create", {
      errors: errors,
      products: products,
      values: req.body,
      categories: categories,
    });
  }
  const urls = [];
  const files = req.files;
  for (var file of files) {
    const path = file.path;
    const newPath = await cloudinary.uploader.upload(path);
    urls.push(newPath.secure_url);
  }
  var data = {
    name: req.body.name,
    packaging: req.body.packaging, //quy cach
    ingredients: req.body.ingredients, //thanhphan
    preserve: req.body.preserve, // bao quan
    source: req.body.source,
    certificate: req.body.certificate, //chung chi
    warning: req.body.warning,
    origin: req.body.origin,
    detail: req.body.detail, //chi tiet
    category: req.body.category,
    image: urls,
  };
  
  await Product.create(data).then((result) => console.log(result));
  res.redirect("/products/getall");
};
module.exports.getDetailProduct = async (req, res, next) => {
  var id = req.params.id;
  var product = await Product.findOne({ _id: id });
  var variants = await Variant.find({product_id: id})
  res.render("product/product-detail", {
    product: product,
    variants: variants
  });
};

module.exports.getall = async (req, res) => {
  var products = await Product.find();
  var categories = await Category.find();
  
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;
  var start = (page - 1) * perPage;
  var end = page * perPage;
  var countProducts = products.length;
  
  res.render("product/getall", {
    products: products.slice(start, end),
    categories: categories,
    currentPage: page,
    pages: Math.ceil(countProducts / perPage)
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
  console.log(product)
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
    (product.image = urls.length?urls:product.image),
    console.log(product);
  await product.save();
  res.redirect("/products/getall");
};
module.exports.deleteProduct = async (req, res) => {
  var id = req.params.id;
  var product = await Product.findOne({ _id: id });
  if (!product) {
    return;
  } else {
    await Product.deleteOne({ _id: id });
    res.redirect("/products/getall");
    console.log("Delete success!");
  }
};
module.exports.search = async (req, res) => {
  var query = req.query.name.trim();
  var products = await Product.find();
  var categories = await Category.find()
  
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;
  var start = (page - 1) * perPage;
  var end = page * perPage;
  var countProducts = products.length;
  
  var productQuery = products.filter((item) => {
    return item.name.toLowerCase().trim().indexOf(query.toLowerCase()) !== -1;
  });
  if (productQuery) {
    res.render("product/getall", {
      products: productQuery,
      categories: categories,
      currentPage: page,
    pages: Math.ceil(countProducts / perPage)
    });
  } else {
    res.render("product/getall", {
      products: products,
      categories: categories
    });
  }
};
module.exports.filter = async (req, res) => {
  var category = req.body.category;
  var categories = await Category.find()
  var products = await Product.find({ category: category });
  res.render("product/getall", {
    products: products,
    categories: categories
  });
};
module.exports.hide = async (req, res)=>{
  
}
module.exports.createCombo = async (req, res)=>{
  var products = await Product.find()
  var variants = await Variant.find();
  var combo = await Product.findOne({name: 'Combo'})
  var errors =[]
  var id1 = req.body.sp1[0];
  var sl1 = req.body.sp1[1]
  var id2 = req.body.sp2[0];
  var sl2 = req.body.sp2[1];
  var id3 = req.body.sp3[0];
  var sl3 = req.body.sp3[1];
  var sp1 = await Variant.findOne({_id: id1});
  var sp2 = await Variant.findOne({_id: id2})
  var sp3 = await Variant.findOne({_id: id3})
  if(sp1 === sp2 | sp1 === sp3 | sp2 === sp3){
    errors.push('Sản phẩm lựa chọn giống nhau')
    var listProduct = []
    for(let variant of variants){
      var product = await Product.findOne({_id: variant.product_id})
      var data = {
        variant_id: variant.id,
        product_id: variant.product_id,
        name: product.name
      }
      listProduct.push(data)
    }
    res.render('product/createcombo',{
      variants: listProduct,
      errors: errors
    })
    return;
  }else{
    var discount = req.body.discount;
    var data = {
      product_id: combo.id,
      image: [...sp1.image,...sp2.image, ...sp3.image],
      size: req.body.name,
      smell: '',
      color: '',
      amount: req.body.amount,
      mfg: sp1.mfg,
      exp: sp1.exp,
      import_price: sp1.import_price*sl1 + sp2.import_price*sl2 + sp3.import_price*sl3,
      price: sp1.price*sl1 + sp2.price*sl2 + sp3.price*sl3 - discount,
      measure: 'Combo'
    }
    console.log(data)
    await Variant.create(data);
    
    var categories = await Category.find();

    var page = parseInt(req.query.page) || 1;
    var perPage = 8;
    var start = (page - 1) * perPage;
    var end = page * perPage;
    var countProducts = products.length;

    res.render('product/getall', {
      products: products.slice(start, end),
      categories: categories,
      currentPage: page,
      pages: Math.ceil(countProducts / perPage)
      
    })
  }
  
}
module.exports.getCreateCombo = async (req, res)=>{
  var variants = await Variant.find();
  var combo = await Product.findOne({name: 'Combo'})
  var listProduct = []
  for(var variant of variants){
    console.log(variant.product_id)
    var product = await Product.findOne({_id: variant.product_id})
    console.log(product)
    var data = {
      variant_id: variant.id,
      product_id: variant.product_id,
      name: product.name + ' ' + variant.size
    }
    listProduct.push(data)
  }
  
  res.render('product/createcombo',{
    variants: listProduct,
    combo: combo
  })
}
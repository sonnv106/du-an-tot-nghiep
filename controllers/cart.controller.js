var Product = require("../models/product.model");
var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var jwt = require("jsonwebtoken");



module.exports.getCart = async (req, res) => {
  var user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).id;
  var cart = await Cart.findOne({user_id: user_id});
  res.render("cart",{
    products : cart.products
  });
};
module.exports.addToCart = async (req, res) => {
  
  var product_id = req.params.id;
  var amount = req.body.amount;
  var decode = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
  
  var product = await Product.findOne({ _id: product_id });
  
  var user_id = decode.id;
//tim gio hang cua user
  var cart = await Cart.findOne({ user_id: user_id });
//tim san pham duy nhat
  var product_only = cart.products.find((item) => {
    return item.product_id === product_id;
  });
  // neu san pham da ton tai trong gio hang thi update
  if (product_only) {
    var index = cart.products.indexOf(product_only);
    var data = { 
      product_id: product_id, 
      product_name: product.name, 
      amount: parseInt(amount),  
      price: product.price
    };
    cart.products.splice(index, 1, data);
    await cart.save();
  } else {
    // neu khong ton tai trong gio hang thi them vao
    cart.products.push({ 
      product_id: product_id, 
      product_name: product.name, 
      amount: parseInt(amount),  
      price: product.price
    });
    await cart.save();
  }
  var sum=[]
  for(var i=0;i<cart.products.length;i++){
    sum.push(cart.products[i].price * cart.products[i].amount)
  }
   var total = sum.reduce((a,b)=> {
     return a+b
  },0)
   console.log(total)
  cart.total = total;
  await cart.save()
  res.redirect("/products");
};

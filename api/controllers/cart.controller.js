var Category = require("../../models/category.model");
var Product = require("../../models/product.model");
var User = require("../../models/user.model");
var Cart = require("../../models/cart.model");

var jwt = require("jsonwebtoken");
// lay gio hang
module.exports.getCart = async (req, res) => {
  var user_id = jwt.verify(
    req.params.token,
    process.env.ACCESS_TOKEN_SECRET
  ).id;
  var cart = await Cart.findOne({ user_id: user_id });
  res.json(cart);
};
//them mot sp vao gio hang
module.exports.addToCart = async (req, res) => {
  var product_id = req.params.id;
  var amount = req.body.amount;
  var decode = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);
  var product = await Product.findOne({ _id: product_id });
  console.log(product);
  var user_id = decode.id;
  //tim gio hang cua user
  var cart = await Cart.findOne({ user_id: user_id });

  //tim san pham duy nhat
  var product_only = cart.products.find((item) => {
    return item.product_id === product_id;
  });

  if (amount > product.quantily) {
    res.json("So luong dat hang lon hon so luong trong kho");
    return;
  } else {
    // neu san pham da ton tai trong gio hang thi update
    if (product_only) {
      var index = cart.products.indexOf(product_only);
      var data = {
        product_id: product_id,
        product_name: product.name,
        amount: parseInt(amount),
        price: product.price,
      };
      cart.products.splice(index, 1, data);
      await cart.save();
    } else {
      // neu khong ton tai trong gio hang thi them vao
      cart.products.push({
        product_id: product_id,
        product_name: product.name,
        amount: parseInt(amount),
        price: product.price,
      });
      await cart.save();
    }
    var sum = [];
    for (var i = 0; i < cart.products.length; i++) {
      sum.push(cart.products[i].price * cart.products[i].amount);
    }
    var total = sum.reduce((a, b) => {
      return a + b;
    }, 0);
    console.log(total);
    cart.total = total;
    await cart.save();
    res.json(cart);
  }
};

//update toan bo gio hang
module.exports.update = async (req, res) => {
  if (req.body.token && req.body.products) {
    var user_id = jwt.verify(
      req.body.token,
      process.env.ACCESS_TOKEN_SECRET
    ).id;
    var cart = await Cart.findOne({ user_id: user_id });

    cart.products = req.body.products;
    await cart.save();
    var sum = [];
    for (var i = 0; i < cart.products.length; i++) {
      sum.push(cart.products[i].price * cart.products[i].amount);
    }
    var total = sum.reduce((a, b) => {
      return a + b;
    }, 0);
    cart.total = total;
    console.log(cart);
    await cart.save();
    res.json(cart);
  } else {
    res.json("errors");
    return;
  }
};
//xóa sản phảm trong giỏ hàng
module.exports.delete = async (req, res) => {
  if (!req.body.token) {
    res.json("errors. not permission");
  } else {
    var product_id = req.params.id;
    var decode = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);
    var user_id = decode.id;
    //tim gio hang cua user
    var cart = await Cart.findOne({ user_id: user_id });
    
    var product_only = cart.products.find((item) => {
      return item.product_id === product_id;
    });
    if(!product_only){
      res.json('Sản phẩm không tồn tại trong giỏ hàng')
      return;
    }else{
      var index = cart.products.indexOf(product_only);
      cart.products.splice(index, 1);
      var sum = [];
      for (var i = 0; i < cart.products.length; i++) {
        sum.push(cart.products[i].price * cart.products[i].amount);
      }
      var total = sum.reduce((a, b) => {
        return a + b;
      }, 0);
      cart.total = total;
      await cart.save();
      res.json(cart)
    }
    
  }
};

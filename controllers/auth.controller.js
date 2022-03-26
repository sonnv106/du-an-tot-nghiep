const bcrypt = require("bcrypt");
var User = require("../models/user.model");
var Product  = require("../models/product.model")
var Cart  = require('../models/cart.model')
var jwt = require('jsonwebtoken');
module.exports.getLogin = (req, res, next) => {
  res.render("login");
};
module.exports.redirect = (req, res)=>{
  res.redirect('/login')
}
module.exports.postLogin = async (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var user = await User.findOne({ email: email });
  if (!user) {
    res.render("login", {
      errors: ["Nguoi dung khong ton tai"],
      values: req.body,
    });
    return;
  } else {
    bcrypt.compare(password, user.password, async (err, result) => {
      if (result) {
        // const token = jwt.sign(
        //   { id: user._id, email: email},
        //     process.env.ACCESS_TOKEN_SECRET,
        // );
        // user.token = token;
        // await user.save();
        
        res.cookie("token", user.token);
        var cart = await Cart.findOne({user_id: user.id})
        if(!cart){
          await Cart.create({
            user_id: user.id,
            products: [],
            total: 0
          })
        }
        res.redirect('/products')
       return
      }
      res.render("login", {
        errors: ["Wrong password"],
        values: req.body,
      });
      return;
    });
  }
};

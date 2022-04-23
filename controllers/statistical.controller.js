var Product = require("../models/product.model");
var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var Bill = require("../models/bill.model")
var jwt = require("jsonwebtoken");

module.exports.index = async(req, res)=>{
  var bills = await Bill.find({bill_status: true});
  var doanhThu =0;
  for (var bill of bills){
    doanhThu+= bill.total
  }
  var listProduct = [];
  for (var i = 0; i < bills.length; i++){
    for (var j =0 ; j< bills[i].products.length;j++){
      listProduct.push((bills[i].products[j]))
      
    }
  }
  
  var total = listProduct;
  
  res.render('statistical', {doanhThu: doanhThu})
}

var Product = require("../models/product.model");
var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var Bill = require("../models/bill.model")
var jwt = require("jsonwebtoken");

module.exports.getall = async (req, res)=>{
  var bills = await Bill.find({})
  res.render('bill/getall', {
    bills: bills
  })
}
module.exports.confirm = async (req, res)=>{
  console.log(req.cookies.token)
  var user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).id;
  var id = req.params.id;
  var bill = await Bill.findOne({_id: id});
  var products = bill.products

  for(let i = 0;i<products.length; i++){
    //tìm kiếm sản phẩm trong kho và trừ đi phần người dùng đã mua sản phẩm
    var product = await Product.findOne({_id: products[i].product_id}) 
    product.quantily-=products[i].amount;
    await product.save()
  }
  bill.bill_status = true;
  bill.transporting = true;
  await bill.save();
  res.redirect('/bills');
}

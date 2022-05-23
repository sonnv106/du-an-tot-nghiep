var Product = require("../models/product.model");
var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var Bill = require("../models/bill.model")
var Variant = require('../models/variant.model')
var jwt = require("jsonwebtoken");

module.exports.getall = async (req, res)=>{
  var bills = await Bill.find({})
  res.render('bill/getall', {
    bills: bills,
  })
}
module.exports.confirm = async (req, res)=>{
  var user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).id;
  var id = req.params.id;
  var bill = await Bill.findOne({_id: id});
  var products = bill.products
  for(let i = 0;i<products.length; i++){
    //tìm kiếm sản phẩm trong kho và trừ đi phần người dùng đã mua sản phẩm
    var product = await Variant.findOne({_id: products[i].variant_id}) 
    console.log(product)
    product.amount-=products[i].amount;
    await product.save()
  }
  bill.bill_status = !bill.bill_status;

  bill.transporting = !bill.transporting;
  var today = new Date()
  bill.start_at = today.getHours() + ":" + today.getMinutes();
  await bill.save();
  res.redirect('/bills');
}
module.exports.detailBill = async (req, res)=>{
  var bill_id = req.params.id;
  var bill = await Bill.findOne({_id: bill_id});
  console.log(bill)
  res.render('bill/detail',{
    bill: bill
  })
}
module.exports.delete = async (req, res)=>{
  var bill_id = req.params.id;
  var bill = await Bill.findOne({ _id: bill_id });

  if (!bill) {
    return;
  } else {
    await Bill.deleteOne({ _id: bill_id });
    var users = await User.find({});
    res.redirect("/bills");
    console.log("Delete success!");
  }
}
module.exports.searchId = async (req, res)=>{
  var query = req.query.id;
  var bills = await Bill.find();
  var billQuery = bills.filter((item) => {
    return item.id.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  });
  console.log(billQuery);
  res.render("bill/getall", { bills: billQuery });
}
module.exports.searchDate = async (req, res)=>{
  var query = req.query.date;
  var year = query.substring(0,4);
  var month = parseInt(query.substring(5,7));
  var day = query.substring(8,10);
  var newDay = month+'/'+day+'/'+year
  
  var bills = await Bill.find();
  
  var billQuery = bills.filter((item) => {
    return item.date.toLowerCase().indexOf(newDay.toLowerCase()) !== -1;
  });
  res.render("bill/getall", { bills: billQuery });
}
module.exports.searchName = async (req, res)=>{
  var query = req.query.name;
  var bills = await Bill.find();
  
  var billQuery = bills.filter((item) => {
    return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  });
  console.log(billQuery);
  res.render("bill/getall", { bills: billQuery });
}
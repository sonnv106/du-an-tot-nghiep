var Bill = require("../../models/bill.model");
var Cart = require("../../models/cart.model");
var User = require("../../models/user.model");
var Cart = require("../../models/cart.model");
var Product = require("../../models/product.model");
var History = require('../../models/history.model')
var Variant = require('../../models/variant.model')
var jwt = require("jsonwebtoken");

module.exports.get = async (req, res) => {
  var user_id = jwt.verify(
    req.params.token,
    process.env.ACCESS_TOKEN_SECRET
  ).id;
  var user = await User.findOne({_id: user_id})
  var bill = await Bill.find({ user_id: user_id });
  
  res.json(bill);
};
// Tạo đơn đặt hàng
module.exports.add = async (req, res) => {
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  
  var address = req.params.address;
  var phone = req.params.phone;
  var email = req.params.email;
  var name = req.params.name;
  
  var cart = await Cart.findOne({ user_id: user_id });
  var user = await User.findOne({ _id: user_id });
  if(cart.products.length == 0){
    res.status(404).json('Không có sản phẩm nào trong rỏ');
    return;
  }
   for(var variant of cart.products){
  
    var findVariant = await Variant.findOne({_id: variant.variant_id})
    variant.image = [...findVariant.image]
    if(variant.amount>findVariant.amount){
      res.status(404).json('Het hang')
      return;
    }
  }
  var date = new Date();
  var data = {
    user_id: user_id, //id người dùng
    date: date.toLocaleString().substring(0,9), // ngày ghi hóa đơn, dat hang
    user_address: address ? address : user.address, //địa chỉ người dùng
    phone: phone,
    email: email? email: user.email,
    username: name, // tên người dùng
    products: cart.products, //danh sách sản phẩm đã đặt
    total: cart.total, // tổng tiền
    payment_type: "Tiền mặt", //kiểu thanh toán
    payment_status: false, // tình trạng thanh toán
    bill_status: false, //Tình trạng đơn hàng
    transporting: false, // trang thái vận chuyển
    verifier: "", // người xác nhận hóa đơn
    transporter: null, //người vận chuyển
    start_at: "", //Khởi hành lúc nào
    finish_at: "", //Hoàn thành lúc nào
    feedback: "", //Đánh giá
  };
  var bill = await Bill.create(data);
  await Cart.findOneAndRemove({ user_id: user_id });
  await Cart.create({
    user_id: user.id,
    products: [],
    total: 0,
  });
  res.json(bill);
};
// Hủy đơn đặt hàng
module.exports.cancel = async (req, res) => {
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  var bill = await Bill.findOne({ _id: req.body.bill_id });
  if (user_id === bill.user_id && bill.bill_status === false) {
    await Bill.deleteOne({ _id: bill._id });
    res.json("Deleted!");
    return;
  } else {
    res.json("Errors");
    return;
  }
};
//xác nhận rỏ hàng
module.exports.confirm = async (req, res) => {
  if(!req.body.token){
    res.status(404).json('thieu token');
    return
  }
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  var id = req.params.id;
  var bill = await Bill.findOne({ _id: id });
  var products = bill.products;

  for (let i = 0; i < products.length; i++) {
    //tìm kiếm sản phẩm trong kho và trừ đi phần người dùng đã mua sản phẩm
    var product = await Product.findOne({ _id: products[i].product_id });
    product.quantily -= products[i].amount;
    await product.save();
  }
  bill.bill_status = true;
  bill.start_at = new Date().getHours() + "-" + new Date().getMunites();
  
  await bill.save();
};
module.exports.transporting = async (req, res) => {
  var user_id = jwt.verify(
    req.params.token,
    process.env.ACCESS_TOKEN_SECRET
  ).id;
  var bill = await Bill.find({ user_id: user_id });
  var bill_transporting = bill.filter((item) => {
    return item.transporting === true;
  });
  if (bill_transporting) {
    res.json(bill_transporting);
  } else {
    res.json("Không có đơn hàng nào được giao");
    return;
  }
};
//hoan thanh don dat hang
module.exports.complete = async (req, res)=>{
  if(!req.body.token){
    res.status(404).json('thieu token');
    return;
  }
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  var bill_id = req.params.id;
  console.log(bill_id)
  var bill = await Bill.findOne({ _id: bill_id });
  console.log(bill)
  const date = new Date();
  if(bill.user_id!==user_id){
    res.json('errors');
    return;
    
  }else{
    bill.payment_status =true
    bill.transporting=false
    bill.finish_at = date.toLocaleString();
    await bill.save();
    // var data_bill = {
    //   user_id: bill.user_id, //id người dùng
    //   date: bill.date, // ngày ghi hóa đơn
    //   phone: bill.phone,
    //   email: bill.email,
    //   username: bill.username, // tên người dùng
    //   user_address: bill.user_address,  //địa chỉ người dùng
    //   products: bill.products, //danh sách sản phẩm đã đặt
    //   total: bill.total, // tổng tiền
    //   payment_type: bill.payment_type, //kiểu thanh toán
    //   payment_status: bill.payment_status, // tình trạng thanh toán
    //   bill_status: bill.bill_status, //Trang thai đơn hàng
    //   transporting: bill.transporting, //Đang vận chuyển
    //   verifier: bill.verifier, // người xác nhận hóa đơn
    //   transporter: bill.transporter, //người vận chuyển
    //   start_at: bill.start_at, //Khởi hành lúc nào
    //   finish_at: date.toLocaleString(), //Hoàn thành lúc nào
    //   feedback: bill.feedback,
    // }
    // await History.create(data_bill);
    res.json(bill)
  }
}
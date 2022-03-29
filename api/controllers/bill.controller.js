var Bill = require("../../models/bill.model");
var Cart = require("../../models/cart.model");
var User = require("../../models/user.model");
var Cart = require("../../models/cart.model");
var Product = require("../../models/product.model");
var jwt = require("jsonwebtoken");

module.exports.get = async (req, res) => {
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  var bill = await Bill.findOne({ user_id: user_id });
  res.json(bill);
};
module.exports.add = async (req, res) => {
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  var cart = await Cart.findOne({ user_id: user_id });
  var user = await User.findOne({ _id: user_id });
  
  const date = new Date();
  
  var data = {
    user_id: user_id, //id người dùng
    date: date.toLocaleDateString(), // ngày ghi hóa đơn, dat hang
    username: user.name ? user.name : user.email, // tên người dùng
    user_address: user.address, //địa chỉ người dùng
    products: cart.products, //danh sách sản phẩm đã đặt
    total: cart.total, // tổng tiền
    payment_type: "Tiền mặt", //kiểu thanh toán
    payment_status: false, // tình trạng thanh toán
    bill_status: false, //Tình trạng đơn hàng
    verifier: "", // người xác nhận hóa đơn
    transporter: null, //người vận chuyển
    start_at: null, //Khởi hành lúc nào
    finish_at: null, //Hoàn thành lúc nào
    feedback: "", //Đánh giá
  };
  
  var bill = await Bill.create(data);
  res.json(bill);
};
module.exports.cancel = async (req, res)=>{
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  var bill = await Bill.findOne({ _id: req.body.bill_id });
  if(user_id === bill.user_id){
    await Bill.deleteOne({ _id: bill._id})
    res.json("Delete success!")
    return;
  }else{
    res.json("Errors")
    return;
  }
  
}
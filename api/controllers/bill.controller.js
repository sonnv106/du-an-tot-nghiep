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
// Tạo đơn đặt hàng
module.exports.add = async (req, res) => {
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  var address = req.body.address;
  var phone = req.body.phone;
  var email = req.body.email;
  var username = req.body.name?req.body.name: user_id.email;
  var cart = await Cart.findOne({ user_id: user_id });
  var user = await User.findOne({ _id: user_id });
  
  const date = new Date();
  
  var data = {
    user_id: user_id, //id người dùng
    date: date.toLocaleDateString(), // ngày ghi hóa đơn, dat hang
    username: user.name, // tên người dùng
    user_address: address ? address:user.address, //địa chỉ người dùng
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
  await Cart.findOneAndRemove({user_id: user_id})
  await Cart.create({
            user_id: user.id,
            products: [],
            total: 0
          })
  res.json(bill);
};
// Hủy đơn đặt hàng
module.exports.cancel = async (req, res)=>{
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
  var bill = await Bill.findOne({ _id: req.body.bill_id });
  if(user_id === bill.user_id && bill.bill_status ===false){
    await Bill.deleteOne({ _id: bill._id})
    res.json("Deleted!")
    return;
  }else{
    res.json("Errors")
    return;
  }
  
}
//xác nhận rỏ hàng
module.exports.confirm = async (req, res)=>{
  var user_id = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).id;
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
  await bill.save();
  res.redirect('/bills');
}

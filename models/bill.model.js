var mongoose = require ('mongoose');
const billSchema = new mongoose.Schema({
  user_id: String, //id người dùng
  date: String, // ngày ghi hóa đơn
  phone: String,
  email: String,
  username: String, // tên người dùng
  user_address: String,  //địa chỉ người dùng
  products: Array, //danh sách sản phẩm đã đặt
  total: Number, // tổng tiền
  payment_type: String, //kiểu thanh toán
  payment_status: Boolean, // tình trạng thanh toán
  bill_status: Boolean, //Trang thai đơn hàng
  transporting: Boolean, //Đang vận chuyển
  verifier: String, // người xác nhận hóa đơn
  transporter: Object, //người vận chuyển
  start_at: String, //Khởi hành lúc nào
  finish_at: String, //Hoàn thành lúc nào
  feedback: String,  //Đánh giá
})
var Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
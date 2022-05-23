var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const variantSchema = new Schema({
  product_id: String,
  size: String,  //kích cỡ
  smell: String, //hương vị 
  color: String,  //màu sắc
  amount: Number, //số lượng
  mfg: Date,  //ngày sản xuất
  exp: Date, //hạn sử dụng
  measure: String, //đơn vị tính
  import_price: Number,  //gia nhap
  price: Number,
  quantily: Number,   
  image: Array,
});

const Variant = mongoose.model("variants", variantSchema);
module.exports = Variant;
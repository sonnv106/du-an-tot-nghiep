var mongoose = require("mongoose");
var Schema = mongoose.Schema;



const productSchema = new Schema({
  name: String,
  packaging: String,  //quy cach
  import_price: Number,  //gia nhap
  price: Number,
  ingredients: String,  //thanhphan
  weight: String,
  date: String, 
  preserve: String,  // bao quan
  source: String,
  certificate: String,  //chung chi
  warning: String,
  origin: String,
  detail: String,  //chi tiet
  quantily: Number,  //soluong
  category: String,  
  image: Array,
});

const Product = mongoose.model("products", productSchema);
module.exports = Product;

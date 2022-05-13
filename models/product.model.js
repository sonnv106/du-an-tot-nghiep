var mongoose = require("mongoose");
var Schema = mongoose.Schema;


const productSchema = new Schema({
  name: String,
  ingredients: String,  //thanhphan
  preserve: String,  // bao quan
  source: String,
  certificate: String,  //chung chi
  warning: String,
  origin: String,
  detail: String,  //chi tiet
  category: String,  
  image: Array,
});

const Product = mongoose.model("products", productSchema);
module.exports = Product;

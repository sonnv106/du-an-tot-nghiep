var mongoose = require ('mongoose');
const cartSchema = new mongoose.Schema({
  user_id: String,
  products: Array,
  total: Number,
})
var Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
var mongoose = require ('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  avatar: String,
  active: Boolean,
  address: String, 
  token: String,
  permission: String,
  favorite: Array,
  date_created: Date,
})
var User = mongoose.model('User', userSchema);
module.exports = User;
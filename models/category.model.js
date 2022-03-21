var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  detail: String,
  postion: String,
  image: String,
});

const Category = mongoose.model("categories", categorySchema);
module.exports = Category;

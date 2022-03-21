var Category = require("../../models/category.model");
var cloudinary = require("../../cloudinary");

module.exports.getall = async function (req, res) {
  var categories = await Category.find();
  res.json(categories);
};
module.exports.createCategory = async function(req, res) {
  try{
    if (!req.body.name) {
    res.send("Ten phai duoc khai bao");
    return;
  } else {
    var image = await cloudinary.uploader.upload(req.file.path);
    var data = {
      name: req.body.name,
      detail: req.body.detail,
      postion: req.body.position,
      image: image.secure_url,
    };
    
  }
  var category = await Category.create(data);
    res.json(category);
  
  }catch(err){
    console.log(err)
  }
};

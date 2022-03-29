const express = require("express");
var router = express.Router();
var controller = require("../controllers/product.controller");
var upload = require("../../multer");
var authenToken = require("../middlewares/authenToken.middleware")
router.get("/getall",controller.getAll)
router.post("/create",upload.single("image"), controller.createProduct);
router.get("/category/:id", controller.getProductCategory)
router.get("/:product_id", controller.getProductById)
module.exports = router;

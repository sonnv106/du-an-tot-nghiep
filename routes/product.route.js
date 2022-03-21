const express = require("express");
var router = express.Router();
var controller = require("../controllers/product.controller");
var upload = require("../multer");

router.get("/", controller.getIndex);
router.get('/create', controller.getCreate);
router.post('/create', upload.array("image", 10), controller.postCreate);
router.get('/detail/:id', controller.getDetailProduct)
// router.post("/", upload.single("image"), controller.postIndex);
// router.get("/:id/delete", controller.delete);
// router.get("/:title/update", controller.getUpdate);
// router.post("/:title/update", controller.postUpdate);

module.exports = router;

const express = require("express");
var router = express.Router();
var controller = require("../controllers/product.controller");
var upload = require("../multer");

router.get("/", controller.getIndex);
router.get('/create', controller.getCreate);
router.post('/create', upload.array("image", 10), controller.postCreate);
router.get('/detail/:id', controller.getDetailProduct)
router.get('/getall',controller.getall)
router.get('/update/:id',controller.getupdate)
router.post('/update/:id',upload.array("image", 10),controller.postupdate)
router.get('/delete/:id', controller.deleteProduct)
// router.post("/", upload.single("image"), controller.postIndex);
// router.get("/:id/delete", controller.delete);
// router.get("/:title/update", controller.getUpdate);

// router.post("/:title/update", controller.postUpdate);

module.exports = router;

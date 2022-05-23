const express = require("express");
var router = express.Router();
var controller = require("../controllers/variant.controller");
var upload = require("../multer");


router.get("/getall", controller.getall);
router.get("/create/:id", controller.getCreate);
router.post('/create',upload.array("image", 10), controller.create)
router.get('/update/:id', controller.getUpdate)
router.post('/update/:id',upload.array("image", 10), controller.postUpdate)
router.get('/delete/:id', controller.delete)
// router.post("/", upload.single("image"), controller.postIndex);
// router.get("/:id/delete", controller.delete);
// router.get("/:title/update", controller.getUpdate);

// router.post("/:title/update", controller.postUpdate);

module.exports = router;
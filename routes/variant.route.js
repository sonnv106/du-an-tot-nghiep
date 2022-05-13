const express = require("express");
var router = express.Router();
var controller = require("../controllers/variant.controller");



router.get("/getall", controller.getall);
router.get("/create/:id", controller.getCreate);
router.post('/create', controller.create)

// router.post("/", upload.single("image"), controller.postIndex);
// router.get("/:id/delete", controller.delete);
// router.get("/:title/update", controller.getUpdate);

// router.post("/:title/update", controller.postUpdate);

module.exports = router;
const express = require("express");
var router = express.Router();
var controller = require("../controllers/category.controller");
var upload = require("../multer");

router.get('/getall', controller.getall)
router.get('/update/:id', controller.getUpdate)
router.get('/delete/:id', controller.delete)
router.post('/update/:id',upload.single("image"), controller.postUpdate)
router.get('/detail/:name', controller.detailCategory)
module.exports = router;
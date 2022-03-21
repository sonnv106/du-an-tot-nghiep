const express = require("express");
var router = express.Router();
var controller = require('../controllers/category.controller.js')
var upload = require("../../multer");

router.get('/getall', controller.getall)
router.post('/create', upload.single("image"),controller.createCategory)


module.exports = router;
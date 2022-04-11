const express = require("express");
var router = express.Router();
var controller = require("../controllers/category.controller");
var upload = require("../multer");

router.get('/getall', controller.getall)

module.exports = router;
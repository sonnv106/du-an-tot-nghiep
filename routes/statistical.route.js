const express = require("express");
var router = express.Router();
var controller = require("../controllers/statistical.controller");

router.get('/', controller.index);

module.exports = router;
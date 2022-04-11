const express = require("express");
var router = express.Router();
var controller = require("../controllers/bill.controller");

router.get('/', controller.getall);
router.get('/confirm/:id', controller.confirm)
module.exports = router;
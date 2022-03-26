const express = require("express");
var router = express.Router();
var controller = require('../controllers/bill.controller.js')

router.get('/getall', controller.getall)
router.post('/add', controller.add)

module.exports = router;
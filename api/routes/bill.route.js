const express = require("express");
var router = express.Router();
var controller = require('../controllers/bill.controller.js')

router.get('/get', controller.get)
router.post('/add', controller.add)
router.post('/cancel',controller.cancel)
module.exports = router;
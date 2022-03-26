const express = require("express");
var router = express.Router();
var controller = require('../controllers/cart.controller.js')

router.get('/getcart', controller.getCart)
router.post('/add/:id',controller.addToCart)
router.post('/update', controller.update)

module.exports = router;
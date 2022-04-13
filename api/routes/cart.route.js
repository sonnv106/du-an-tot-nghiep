const express = require("express");
var router = express.Router();
var controller = require('../controllers/cart.controller.js')

router.get('/getcart/:token', controller.getCart)
router.post('/add/:id',controller.addToCart)
router.post('/update', controller.update)
router.post('/delete/:id', controller.delete)

module.exports = router;
const express = require("express");
var router = express.Router();
var controller = require("../controllers/cart.controller");

router.get('/', controller.getCart);
router.post('/add/:id', controller.addToCart)

module.exports = router;
const express = require("express");
var router = express.Router();
var controller = require("../controllers/statistical.controller");

router.get('/', controller.index);
router.get('/top', controller.top);
router.get('/topcustomer', controller.topcustomer)
router.get('/inventory', controller.inventory)
module.exports = router;
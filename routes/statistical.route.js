const express = require("express");
var router = express.Router();
var controller = require("../controllers/statistical.controller");

router.get('/', controller.index);
router.get('/top', controller.top);
router.get('/topcustomer', controller.topcustomer)
router.get('/top/month', controller.topMonth)
router.get('/inventory', controller.inventory)
router.get('/daymonth', controller.daymonth)
router.get('/expired', controller.expired)
module.exports = router;
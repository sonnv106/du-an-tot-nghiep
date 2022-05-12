const express = require("express");
var router = express.Router();
var controller = require("../controllers/bill.controller");

router.get('/', controller.getall);
router.get('/confirm/:id', controller.confirm)
router.get('/detail/:id', controller.detailBill)
router.get('/delete/:id', controller.delete)
router.get('/search/id', controller.searchId)
router.get('/search/date', controller.searchDate)
router.get('/search/name', controller.searchName)
module.exports = router;
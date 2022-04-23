const express = require("express");
var router = express.Router();
var controller = require('../controllers/bill.controller.js')

router.get('/get/:token', controller.get)
router.post('/add/:address/:phone/:email/:name', controller.add)
router.post('/cancel',controller.cancel)
router.post('/confirm/:id', controller.confirm)
router.get('/transporting/:token', controller.transporting)
router.post('/complete/:id', controller.complete)
module.exports = router;
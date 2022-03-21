const express = require("express");
var router = express.Router();
var controller = require("../controllers/user.controller");

router.get('/create',controller.signup);
router.post('/create', controller.postCreateUser);

router.get('/verify/:email', controller.verifyEmail)

// router.get('/login', controller.getLogin)
// router.post('/login', controller.postLogin)
module.exports = router;
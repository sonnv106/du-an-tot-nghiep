const express = require('express');
const router = express.Router();

var controller = require('../controllers/user.controller')
//lay thong tin
router.get('/getall',controller.getAll)
//tao user khach hang
router.post('/create',controller.createUser);
//tao user admin
router.post('/create/admin',controller.createAdmin);
//login
router.post('/login', controller.login);

//thay doi password
router.post('/change/password', controller.changePassword)

// quen mat khau
router. post('/forgot/password', controller.forgotPassword )

// thay doi thong tin
router.post('/updateInfo', controller.updateInfo)


module.exports = router;
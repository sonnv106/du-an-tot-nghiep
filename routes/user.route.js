const express = require("express");
var router = express.Router();
var controller = require("../controllers/user.controller");
var upload = require("../multer");

router.get('/', controller.redirect)
router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);

router.get('/home', controller.home);
router.get('/users/create',controller.signup);
router.post('/users/create', upload.single("avatar"),controller.postCreateUser);
router.get('/users/delete/:id',controller.deleteAccount)

router.get('/users/update/:id', controller.getUpdateInfoOfUser)
router.post('/users/update/:id', upload.single('avatar'),controller.updateInfoOfUser)

router.get('/users/verify/:email', controller.verifyEmail)

// router.get('/login', controller.getLogin)

module.exports = router;
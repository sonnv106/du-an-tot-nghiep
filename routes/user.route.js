const express = require("express");
var router = express.Router();
var controller = require("../controllers/user.controller");
var upload = require("../multer");
var middleware = require('../middlewares/authenToken.middleware')


router.get('/', controller.redirect)
router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);

router.get('/home',middleware.requireAuth, controller.home);
router.get('/users/create',middleware.requireAuth,controller.signup);
router.post('/users/create',middleware.requireAuth, upload.single("avatar"),controller.postCreateUser);
router.get('/users/delete/:id',middleware.requireAuth,controller.deleteAccount)

router.get('/users/update/:id',middleware.requireAuth, controller.getUpdateInfoOfUser)
router.post('/users/update/:id',middleware.requireAuth, upload.single('avatar'),controller.updateInfoOfUser)

router.get('/users/verify/:email', controller.verifyEmail)
router.get('/users/bill/detail/:id',middleware.requireAuth,controller.detailBillUser)
router.get('/users/search',middleware.requireAuth, controller.search);
router.get('/users/logout',middleware.requireAuth, controller.logout)
router.get('/users/searchEmail',middleware.requireAuth, controller.searchEmail)

// router.get('/login', controller.getLogin)

module.exports = router;
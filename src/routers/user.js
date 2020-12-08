const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let user_controller=require('../controller/user')

//forgot password
router.post('/sendOTP',user_controller.sendOTP);
router.post('/resetPassword',user_controller.resetPassword);
router.post('/users',user_controller.register);
router.get('/users/me', auth, user_controller.getUserInfo);
router.post('/users/login', user_controller.login);
router.post('/users/logout', auth, user_controller.logOut);
router.post('/users/logoutAll', auth, user_controller.logOutAll);
router.patch('/users/changePass',auth, user_controller.changePass);
router.patch('/users/me', auth, user_controller.changePersonalInformation);
router.post('/upload',user_controller.upload.single("avatar"),user_controller.uploadAvatar)
router.get('/image/:filename',user_controller.getImageInfo)
module.exports = router;

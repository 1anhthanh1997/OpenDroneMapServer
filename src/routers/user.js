const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URL;
// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

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
module.exports = router;

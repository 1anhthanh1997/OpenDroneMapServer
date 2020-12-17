const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let group_controller=require('../controller/groups')


// router.post('/upload',user_controller.upload.single("avatar"),user_controller.uploadAvatar)
// router.get('/image/:filename',user_controller.getImageInfo)
router.get('/tripList',auth,group_controller.getTripList)
router.post('/trip',auth,group_controller.createTrip)
router.patch('/editTrip/:id',auth,group_controller.editTrip)
router.patch('/joinTrip/:groupId',auth,group_controller.joinTrip)

module.exports = router;

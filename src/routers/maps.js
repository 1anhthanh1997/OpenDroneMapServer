const express = require('express');
const {User} = require('../models/user');
const {Map} = require('../models/maps')
const router = express.Router();
const auth = require('../middleware/auth');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URL;
const randomString = require('randomstring')
const nodeMailer = require('nodemailer')
// Create mongo connection
const conn = mongoose.createConnection(mongoURI);
router.get('/projects', auth, async (req, res) => {
    try {
        let map1 = await Map.find({username: req.user.username});
        res.send(map1)
    } catch (e) {
        res.status(404).send(e)
    }

});
router.post('/projects', auth, async (req, res) => {
    try {
        let map = new Map({
            username: req.user.username,
            project: req.body
        })
        await map.save();
        res.send(map)
    } catch (e) {
        res.send(e)
    }
});

router.get('/projects/:projectId/tasks', auth, async (req, res) => {
    try {
        console.log(req.params.projectId)
        let map = await Map.find({username:req.user.username,"project.projectId":req.params.projectId});
        res.send(map)
    } catch (e) {
        res.status(404).send(e)
    }

});
router.post('/projects/:projectId/tasks', auth, async (req, res) => {
    try {
        // console.log(req.params.projectId)
        let map = await Map.findOne({username: req.user.username, "project.projectId": req.params.projectId});
        // console.log(map)
        map.project.tasks.unshift(req.body)
       await map.save()
        res.send(map)
    } catch (e) {
        res.status(404).send(e)
    }
});
router.post('/projects/:projectId/tasks/:taskId/marker',auth,async (req,res)=>{
    try{
        let map=await Map.findOne({"project.tasks.taskId": req.params.taskId})
        map.project.tasks[0].markers.unshift(req.body)
        console.log(map)
        map.save()
        res.send(map)
    }catch (e) {
        res.send(e)
    }
})
router.get('/us',async (req,res)=>{
    try {
        res.send("Hi")
    }catch (e) {

    }

})
module.exports = router

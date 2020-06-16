const express = require('express');
const {User} = require('../models/user');
const {Map} = require('../models/maps')
const {Task} = require('../models/tasks')
const {Marker} = require('../models/markers')
const {Road} = require('../models/roads')
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URL;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI)

// Project
// Get list project of user
router.get('/projects', auth, async (req, res) => {
    try {
        let map1 = await Map.find({username: req.user.username});
        res.send(map1)
    } catch (e) {
        res.status(404).send(e)
    }

});
router.get('/allProjects', auth, async (req, res) => {
    try {
        let map1 = await Map.find();
        res.send(map1)
    } catch (e) {
        res.status(404).send(e)
    }

});
// Create project
router.post('/projects', auth, async (req, res) => {
    try {
        let map = await new Map({
            username: req.user.username,
            projectId: req.body.projectId,
            projectName: req.body.projectName,
            description: req.body.description
        });
        await map.save();
        res.send(map)
    } catch (e) {
        res.send(e)
    }
});

// Edit project
router.patch('/projects/:projectId', auth, async (req, res) => {
    try {
        let map = await Map.findOne({projectId: req.params.projectId});
        map.projectName = req.body.projectName;
        map.description = req.body.description;
        map.save()
        res.send(map)
    } catch (e) {
        res.send(e)
    }
});

// Delete project
router.delete('/projects/:projectId', auth, async (req, res) => {
    try {
        await console.log(req.params.projectId)
        let map = await Map.findOneAndRemove({projectId: req.params.projectId});
        res.send(map)
    } catch (e) {
        res.send(e)
    }
})

// Task
// Get list task of project
router.get('/projects/:projectId/tasks', auth, async (req, res) => {
    try {
        console.log(req.params.projectId)
        let tasks = await Task.find({projectId: req.params.projectId});
        res.send(tasks)
    } catch (e) {
        res.status(404).send(e)
    }

});

// Add task
router.post('/projects/:projectId/tasks', auth, async (req, res) => {
    try {
        await console.log("input")
        await console.log(req.body)
        let map = await Map.findOne({projectId: req.params.projectId});
        console.log(map)
        await map.tasks.unshift(req.body.taskId);
        await map.save();
        let task = new Task({
            projectId: req.params.projectId,
            taskId: req.body.taskId,
            taskName: req.body.taskName
        });
        task.save();
        res.send(task)
    } catch (e) {
        res.status(404).send(e)
    }
});

// Add link of tile of task
router.patch('/projects/:projectId/tasks/:taskId/link', auth, async (req, res) => {
    try {
        console.log(req.body)
        let task = await Task.findOne({taskId: req.params.taskId});
        let isInList=false
        task.link.map((link)=>{
            if(link.username===req.user.username){
                link.link=req.body.link
                isInList=true
            }
        })
        if(isInList===false){
            task.link.unshift({
                username:req.user.username,
                link:req.body.link
            })
        }
        // task.tmpLink[req.user.username]=req.body.link
        console.log(task)
        task.save();
        res.send(task)
    } catch (e) {
        res.send(e)
    }
});

router.patch('/projects/:projectId/tasks/:taskId/schedule', auth, async (req, res) => {
    try {
        let task = await Task.findOne({taskId: req.params.taskId});
        task.schedule=req.body.schedule;
        task.save();
        res.send(task)
    } catch (e) {
        res.send(e)
    }
});

// router.patch('/projects/:projectId/tasks/:taskId/tmpLink',auth, async (req, res)=>{
//     try {
//         let task=await Task.findOne({taskId: req.params.taskId});
//         task.tmpLink[req.user.username]=req.body.link
//         task.save();
//         res.send(task)
//     }catch (e) {
//
//     }
// })

// Delete task
router.delete('/projects/:projectId/tasks/:taskId', auth, async (req, res) => {
    try {
        let map = await Map.findOne({projectId: req.params.projectId});
        map.tasks.filter((task) => {
            return task !== req.params.taskId
        });
        map.save();
        let task = await Task.findOneAndRemove({taskId: req.params.taskId});
        res.send(task)
    } catch (e) {
        res.send(e)
    }
})


// Get info of task
router.get('/projects/:projectId/tasks/:taskId', auth, async (req, res) => {
    try {
        let task = await Task.findOne({taskId: req.params.taskId})
        let markers = await Marker.find({taskId: req.params.taskId})
        let roads = await Road.find({taskId: req.params.taskId})
        let link='';
        await task.link.map((links)=>{
            if(links.username===req.user.username){
                link=links.link
            }
        })
        let schedule=await task.schedule
        let data = {
            link: link,
            markers: markers,
            polylines: roads,
            schedule:schedule
        }
        console.log(data)
        res.send(data)
    } catch (e) {
        res.send(e)
    }
})

// Marker
// Get list makers of task
router.get('/projects/:projectId/tasks/:taskId/markers', auth, async (req, res) => {
    try {
        let makers = await Marker.find({taskId: req.params.taskId})
        res.send(makers)
    } catch (e) {
        res.send(e)
    }
});

// Add marker
router.post('/projects/:projectId/tasks/:taskId/marker', auth, async (req, res) => {
    try {
        console.log(req.body)
        let task = await Task.findOne({taskId: req.params.taskId});
        task.markers.unshift(req.body.markerId);
        task.save();
        let marker = new Marker({
            taskId: req.params.taskId,
            coordinate:
                {
                    latitude: req.body.coordinate.latitude,
                    longitude: req.body.coordinate.longitude
                },
            description: req.body.description,
            markerId: req.body.markerId,
            markerType: req.body.markerType,
            title: req.body.title,
            dateTime:req.body.dateTime
        });
        marker.save();
        res.send(marker)
    } catch (e) {
        res.send(e)
    }
})

// Edit info of marker
router.patch('/projects/:projectId/tasks/:taskId/markers/:markerId', auth, async (req, res) => {
    try {

        let marker = await Marker.findOne({markerId: req.params.markerId});
        console.log(marker);
        marker.title = req.body.title;
        marker.description = req.body.description;
        marker.dateTime.date=req.body.dateTime.date;
        marker.dateTime.time=req.body.dateTime.time;
        marker.save();
        res.send(marker)
    } catch (e) {
        res.send(e)
    }
});

// Delete marker
router.delete('/projects/:projectId/tasks/:taskId/markers/:markerId', auth, async (req, res) => {
    try {
        console.log(req.params.markerId)
        let task = await Task.findOne({taskId: req.params.taskId});
        await task.markers.filter((marker) => {
            return marker !== req.params.markerId
        });
        task.save();
        let marker = await Marker.findOneAndRemove({markerId: req.params.markerId});
        let road=await Road.find()
        // let road=await Road.find()
        road=await road.filter((road)=>{
            return road.coordinates[0].markerId===req.params.markerId || road.coordinates[1].markerId===req.params.markerId
        })
        await road.map(async (road)=>{
            await Road.findOneAndRemove({roadId:road.roadId})
        })

        res.send(marker)
    } catch (e) {
        res.send(e)
    }
})

router.patch('/projects/:projectId/tasks/:taskId/roads', auth, async (req, res) => {
    try {
        console.log(req.body)
        req.body.map(async (line) => {
                let lineTest = await Road.findOne({roadId: line.roadId})
                if (lineTest == null) {
                    console.log(lineTest == null)
                    let lat1 = line.coordinates[0].latitude;
                    let lat2 = line.coordinates[1].latitude;
                    let long1 = line.coordinates[0].longitude;
                    let long2 = line.coordinates[1].longitude;
                    let R = 6371e3; // metres
                    let φ1 = lat1 * Math.PI / 180; // φ, λ in radians
                    let φ2 = lat2 * Math.PI / 180;
                    let Δφ = (lat2 - lat1) * Math.PI / 180;
                    let Δλ = (long2 - long1) * Math.PI / 180;
                    let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    let d = R * c; // in metres
                    let marker1=await Marker.findOne({markerId:line.coordinates[0].markerId})
                    let marker2=await Marker.findOne({markerId:line.coordinates[1].markerId})
                    let dangerous=false
                    let weight=1
                    if(marker1.markerType===3||marker2.markerType===3){
                        weight=100000
                        dangerous=true
                    }
                    let road = await new Road({
                        taskId: req.params.taskId,
                        roadId: line.roadId,
                        coordinates: [
                            {
                                markerId: line.coordinates[0].markerId,
                                latitude: lat1,
                                longitude: long1
                            },
                            {
                                markerId: line.coordinates[1].markerId,
                                latitude: lat2,
                                longitude: long2
                            }
                        ],
                        length: d,
                        weight:weight,
                        dangerous: dangerous,
                        strokeColor: '#000'
                    });
                    console.log(road)
                    road.save();
                }
            }
        )
        res.send(req.body)

    } catch (e) {
        res.send(e)
    }
})
router.delete('/projects/:projectId/tasks/:taskId/roads/:roadId', auth, async (req, res) => {
    try {
        let road = await Road.findOneAndRemove({roadId: req.params.roadId})
        console.log(road)
        res.send(road)
    } catch (e) {

    }
})

module.exports = router;

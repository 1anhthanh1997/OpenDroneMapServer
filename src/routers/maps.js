const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URL;
let map_controller=require('../controller/maps')
let task_controller=require('../controller/tasks')
let marker_controller= require('../controller/markers')
let road_controller=require('../controller/roads')

// Create mongo connection
const conn = mongoose.createConnection(mongoURI)

// Project
// Get list project of user
router.get('/projects', auth, map_controller.getProjectsOfUser);
router.get('/allProjects', auth, map_controller.getAllProjects);
// Create project
router.post('/projects', auth, map_controller.createProject);

// Edit project
router.patch('/projects/:projectId', auth, map_controller.editProject);

// Delete project
router.delete('/projects/:projectId', auth, map_controller.deleteProject)

// Task
// Get list task of project
router.get('/projects/:projectId/tasks', auth, task_controller.getTaskList);

// Add task
router.post('/projects/:projectId/tasks', auth, task_controller.addTask);

// Add link of tile of task
router.patch('/projects/:projectId/tasks/:taskId/link', auth, task_controller.getTileLinkOfTask);

router.patch('/projects/:projectId/tasks/:taskId/schedule', auth, task_controller.updateSchedule);

// Delete task
router.delete('/projects/:projectId/tasks/:taskId', auth, task_controller.deleteTask);


// Get info of task
router.get('/projects/:projectId/tasks/:taskId', auth, task_controller.getTaskInfo)

// Marker
// Get list makers of task
router.get('/projects/:projectId/tasks/:taskId/markers', auth, marker_controller.getMarkerList);

// Add marker
router.post('/projects/:projectId/tasks/:taskId/marker', auth, marker_controller.addMarker);

// Edit info of marker
router.patch('/projects/:projectId/tasks/:taskId/markers/:markerId', auth, marker_controller.editMarkerInfo);

// Delete marker
router.delete('/projects/:projectId/tasks/:taskId/markers/:markerId', auth, marker_controller.deleteMarker)
router.patch('/projects/:projectId/tasks/:taskId/roads', auth, road_controller.editRoadList)
router.delete('/projects/:projectId/tasks/:taskId/roads/:roadId', auth, road_controller.deleteRoad)

module.exports = router;

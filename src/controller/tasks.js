const {Map} = require('../models/maps')
const {Task} = require('../models/tasks')
const {Marker} = require('../models/markers')
const {Road} = require('../models/roads')


exports.getTaskList=async (req, res) => {
    try {
        console.log(req.params.projectId)
        let tasks = await Task.find({projectId: req.params.projectId});
        res.send(tasks)
    } catch (e) {
        res.status(404).send(e)
    }

};
exports.addTask=async (req, res) => {
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
};
exports.getTileLinkOfTask=async (req, res) => {
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
};
exports.updateSchedule=async (req, res) => {
    try {
        let task = await Task.findOne({taskId: req.params.taskId});
        task.schedule=req.body.schedule;
        task.save();
        res.send(task)
    } catch (e) {
        res.send(e)
    }
}
exports.deleteTask=async (req, res) => {
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
};
exports.getTaskInfo=async (req, res) => {
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
}


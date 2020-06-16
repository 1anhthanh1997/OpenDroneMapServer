const {Task} = require('../models/tasks')
const {Marker} = require('../models/markers')
const {Road} = require('../models/roads')

exports.getMarkerList=async (req, res) => {
    try {
        let makers = await Marker.find({taskId: req.params.taskId})
        res.send(makers)
    } catch (e) {
        res.send(e)
    }
}
exports.addMarker=async (req, res) => {
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
}
exports.editMarkerInfo=async (req, res) => {
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
}
exports.deleteMarker=async (req, res) => {
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
}

const {Map} = require('../models/maps')


exports.getProjectsOfUser=async (req, res) => {
    try {
        let map1 = await Map.find({username: req.user.username});
        res.send(map1)
    } catch (e) {
        res.status(404).send(e)
    }

}
exports.getAllProjects=async (req, res) => {
    try {
        let map1 = await Map.find();
        res.send(map1)
    } catch (e) {
        res.status(404).send(e)
    }

}
exports.createProject=async (req, res) => {
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
}
exports.editProject=async (req, res) => {
    try {
        let map = await Map.findOne({projectId: req.params.projectId});
        map.projectName = req.body.projectName;
        map.description = req.body.description;
        map.save()
        res.send(map)
    } catch (e) {
        res.send(e)
    }
}
exports.deleteProject=async (req, res) => {
    try {
        await console.log(req.params.projectId)
        let map = await Map.findOneAndRemove({projectId: req.params.projectId});
        res.send(map)
    } catch (e) {
        res.send(e)
    }
}

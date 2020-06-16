const {Marker} = require('../models/markers')
const {Road} = require('../models/roads')

exports.editRoadList=async (req, res) => {
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
}
exports.deleteRoad=async (req, res) => {
    try {
        let road = await Road.findOneAndRemove({roadId: req.params.roadId})
        console.log(road)
        res.send(road)
    } catch (e) {

    }
}

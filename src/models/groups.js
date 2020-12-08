let {mongoose} = require('../db/mongoose');
let autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
let groupSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    groupDescription: {
        type: String,
    },
    groupAvatar: {
        type: String,
    },
    members: {
        type: Array,
    },
    schedule: [{
        destinationId: {
            type: String
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        destinationName: {
            type: String
        },
        arrivedTime: {
            type: String
        },
        leavingTime: {
            type: String
        },
        activities: {
            type: Array
        }
    }]
})
groupSchema.plugin(autoIncrement.plugin, 'groups')
const Group = mongoose.model('group', groupSchema)
module.exports = {Group}


let {mongoose} = require('../db/mongoose');
let autoIncrement = require('mongoose-auto-increment');
const jwt = require('jsonwebtoken')
autoIncrement.initialize(mongoose);
let markerSchema = new mongoose.Schema({
    taskId:{
      type:String
    },
    markerId:{
        type:String,
    },
    markerType:{
        type:Number
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    coordinate:{
        latitude:{
            type:Number
        },
        longitude:{
            type:Number
        }
    },
    dateTime:{
        date:{
            type:String
        },
        time:{
            type:String
        }
    }


})
// userSchema.methods.getPublicInformation = async function () {
//     const user = this
//     const userObject = user.toObject()
//     delete userObject.password
//     delete userObject.tokens
//     console.log(userObject)
//     return userObject
// }
// userSchema.statics.findByEmail = async (email) => {
//     // console.log("Hello World")
//     const user = await User.findOne({email: email})
//     if (!user) {
//         throw new Error('Unable to login')
//     }
//     return user
// }
// //Sử dụng model User
// userSchema.statics.findByCredentials = async (username, password) => {
//     // console.log("Hello World")
//     const user = await User.findOne({username: username})
//     if (!user) {
//         throw new Error('Unable to login')
//     }
//     const isMatch = await bcript.compare(password, user.password)
//     if (!isMatch) throw new Error('Unable to login')
//     return user
// }
// //Sử dụng instance của User là user
// userSchema.methods.generateAuthToken = async function () {
//     const user = this
//     const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')
//     user.tokens = user.tokens.concat({token})
//     await user.save()
//     return token
// }
// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         user.password = await bcript.hash(user.password, 1);
//         console.log(user.password);
//     }
//     next();
// })
markerSchema.plugin(autoIncrement.plugin, 'markers')
const Marker = mongoose.model('marker', markerSchema)
module.exports = {Marker}


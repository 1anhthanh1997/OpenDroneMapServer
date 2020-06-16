let {mongoose} = require('../db/mongoose');
let autoIncrement = require('mongoose-auto-increment');
const jwt = require('jsonwebtoken')
autoIncrement.initialize(mongoose);
let taskSchema = new mongoose.Schema({
    projectId:{
        type:String,
        required: true
    },
    taskId: {
        type:String,
        required:true
    },
    taskName: {
        type:String,
        required:true
    },
    description: {
        type:String
    },
    link:[{
        username:{
            type:String
        },
        link:{
            type:String
        }
    }],
    schedule:[{
        id:{
            type:String
        },
        name:{
            type:String
        }
    }],
    markers:[String],
    roads:[String],
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
taskSchema.plugin(autoIncrement.plugin, 'tasks')
const Task = mongoose.model('task', taskSchema)
module.exports = {Task}


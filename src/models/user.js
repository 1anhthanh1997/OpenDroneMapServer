var {mongoose} = require('../db/mongoose');
const bcript = require('bcrypt');
// let ObjectId=mongoose.Schema.Types.ObjectId;
let autoIncrement = require('mongoose-auto-increment');
const jwt = require('jsonwebtoken')
autoIncrement.initialize(mongoose);
let userSchema = new mongoose.Schema({
    // _id:{
    //     type:Number
    // },
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        // index: {unique: true}
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: (value) => {
                if(value.length<8){
                    throw new Error("Password is invalid");
                }
                // let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                //
                // if (value.toLowerCase() == value || !format.test(value) || !/\d/.test(value)) {
                //     throw new Error("Password is invalid");
                // }

            },
            message: 'Password is invalid'
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    gender:{
      type:String,
      required:true,
      trim:true
    },
    dateOfBirth:{
      type:String,
      required:true,
      trim:true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 9
    },

    tokens: [{
        token: {
            type: String,
        }
    }],


})
userSchema.methods.getPublicInformation = async function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    console.log(userObject)
    return userObject
}
userSchema.statics.findByEmail = async (email) => {
    // console.log("Hello World")
    const user = await User.findOne({email:email})
    if (!user) {
        throw new Error('Unable to login')
    }
    return user
}
//Sử dụng model User
userSchema.statics.findByCredentials = async (username, password) => {
    // console.log("Hello World")
    const user = await User.findOne({username: username})
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcript.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login')
    return user
}
//Sử dụng instance của User là user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcript.hash(user.password, 1);
        console.log(user.password);
    }
    next();
})
userSchema.plugin(autoIncrement.plugin, 'user')
const User = mongoose.model('user', userSchema)
module.exports = {User}

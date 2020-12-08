const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const randomString=require('randomstring')
const nodeMailer=require('nodemailer')
const mongoose = require('mongoose');
const multer = require('multer')
const path = require('path');
const crypto = require('crypto');
// Create mongo connection
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoURI = process.env.MONGODB_URL;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;
let filename;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
exports.upload = multer({storage});


exports.getImageInfo=async (req,res)=>{
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            const readstream2 = gfs.createReadStream(file.filename)
            readstream2.pipe(res);
            // res.status(404).json({
            //     err: 'Not an image'
            // });
        }
    });
}

exports.uploadAvatar=async (req,res)=>{
    try {
        let avatarLink="https://fierce-oasis-19381.herokuapp.com/image/"+filename
        // req.user.avatar=avatarLink
        // await req.user.save();
        res.send(avatarLink)
        // res.redirect('/')
    }catch (e) {
        res.status(400).send(e)
    }
}

exports.register=async (req,res)=>{
    try {
        // console.log("Hello")
        let user = new User(req.body)
        console.log(req.body)
        await user.save()
        // console.log(user._id)
        // const token = jwt.sign({ _id: "1" }, 'thisismynewcourse')
        // const token = await user.generateAuthToken()
        // console.log(token)
        res.status(201).send(user)
    } catch (e) {
        // console.log(e)
        if(e.code===11000){
            res.status(409).send({})
        }
        res.status(400).send(e)
    }
}
exports.getUserInfo=async (req, res) => {
    res.send(req.user)
}
exports.login=async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        console.log("User:")
        if(!user) throw new Error("Hihi")
        const token = await user.generateAuthToken()
        const publicUser = await user.getPublicInformation()
        console.log(publicUser)
        res.send({user: publicUser, token})
    } catch (e) {
        res.status(404).send(e)

    }

}
exports.logOut=async (req, res) => {
    try {
        console.log(req.token)
        req.user.tokens = await req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
}
exports.logOutAll=async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}
exports.changePass=async (req, res) => {
    try {


        // console.log(user.password)
        // console.log("oldPass:"+req.body.oldPassword)

        const isMatch= await bcrypt.compare(req.body.oldPassword,req.user.password)
        console.log(isMatch)
        if(!isMatch){
            res.status(404).send()
        }else{
            req.user.password=req.body.newPassword
            req.user.save()
            res.send()
        }

        // user.save()

    } catch (e) {
        res.status(404).send(e)
    }

}
exports.changePersonalInformation=async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'gender','phoneNumber','email','dateOfBirth']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}
exports.resetPassword=async (req,res)=>{
    try {
        let originPassword=await randomString.generate(8)
        console.log(originPassword)
        let user=await User.findByEmail(req.body.email)
        user.password=originPassword;
        await user.save();
        let transporter = await nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: '4anhthanh1997@gmail.com',
                pass: 'anhthanh1997'
            }
        });
        let mailOptions = {
            from: '4anhthanh1997@gmail.com',
            to: req.body.email,
            subject: 'Reset Password',
            text: 'Mật khẩu mới của bạn là: '+originPassword
        };
        let response=await transporter.sendMail(mailOptions)
        res.send(response)

    }catch (e) {
        res.status(400).send(e)
    }
};
exports.sendOTP=async (req,res)=>{
    try{
        console.log(req.body.email)
        let user=await User.findByEmail(req.body.email);
        let OTP=await randomString.generate({
            length:6,
            charset:'0123456789'
        })
        let transporter = await nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: '4anhthanh1997@gmail.com',
                pass: 'anhthanh1997'
            }
        });
        let mailOptions = {
            from: '4anhthanh1997@gmail.com',
            to: req.body.email,
            subject: 'Mã OTP',
            text: 'Mã OTP của bạn là:'+OTP
        };
        let response=await transporter.sendMail(mailOptions)

        res.send({OTP:OTP})
    }catch (e) {
        res.status(400).send(e)
    }
};

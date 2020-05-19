const express = require('express')
require('./src/db/mongoose')
const bodyParser=require('body-parser')
const userRouter = require('./src/routers/user')
const mapRouter=require('./src/routers/maps')
const cors = require('cors')
const app = express()
const port = process.env.PORT
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(userRouter)
app.use(mapRouter)
app.get('/u',(req,res)=>{
    res.send("Hello")
})
app.listen(port, () => {
    console.log('Started on port '+port);
});


const express = require('express');
require('dotenv/config');
const connectDB = require('./config/mongodb.js');
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoute.js');
const adminRouter = require('./routes/adminRoute.js')


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()

// middlewares
app.use(express.json())

// api endpoints
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/admin', adminRouter)



app.get('/',(req,res)=>{
    res.send("API WORKING")
})

app.listen(port, ()=> console.log("Server Started",port))
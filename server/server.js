const exp=require("express")
const app=exp();
app.use(exp.json())
require('dotenv').config()
const mongoose=require("mongoose");
const authApp = require('./apis/authApi')
const expertApp = require('./apis/expertApi')
const bookingApp = require('./apis/bookingApi')
const { autoRejectPendingBookings } = require('./controllers/bookingController');
const cors=require('cors')
app.use(cors())

const port=process.env.PORT || 4000

mongoose.connect(process.env.DBURL)
.then(()=>{
    setInterval(autoRejectPendingBookings, 60 * 60 * 1000);
    app.listen(port,()=>console.log(`serer listening on port ${port}..`))
    console.log("DB connection success")
})
.catch(err=> console.log("Error in DB connection",err))

app.use(exp.json())
app.use('/auth-api', authApp)
app.use('/expert-api', expertApp)
app.use('/booking-api', bookingApp)
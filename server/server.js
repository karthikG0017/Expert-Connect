const exp=require("express")
const app=exp();
require('dotenv').config()
const mongoose=require("mongoose");
const cors=require('cors')
app.use(cors())

const port=process.env.PORT || 4000

mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console,log(`serer listening on port ${port}..`))
    console.log("DB connection success")
})
.catch(err=> console.log("Error in DB connection",err))



app.use(exp.json())
const mongoose=require('mongoose')

const bookingSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', 
        required: true
    },
    expertId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Expert', 
        required: true 
    },
    date:{
        type: String,
        required: true
    }, 
    time:{
        type:String, 
        required: true
    },
    isConfirmed:{
        type: Boolean, 
        default: true
    },
    meetLink:{
        type:String
    }
})

module.exports=mongoose.model('Booking',bookingSchema)
const mongoose=require('mongoose')

const bookingSchema=new mongoose.Schema({
    userId:{
        type:mongoose>Schema.Types.ObjectId,
        ref:'User'
    },
    expertId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Expert'
    },
    dateTime:{
        type:Date,
    },
    status:{
        type:String,
        enum:['pending','confirmed','completed'],
        default:'pending'
    },
    meetLink:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Booking',bookingSchema)
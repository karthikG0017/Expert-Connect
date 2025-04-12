const mongoose=require('mongoose')

const expertSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bio:{
        type:String
    },
    domain:{
        type:String
    },
    price:{
        type:Number
    },
    availability:{
        type:[String]
    },
    rating:{
        type:Number,
        default:0
    },
    tags:{
        type:[String]
    }
})

module.exports=mongoose.model('Expert',expertSchema)
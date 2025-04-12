const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:['user','expert'],
        default:'user'
    }
})

module.exports=mongoose.model('User',userSchema)
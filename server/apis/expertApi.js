// const exp = require('express')
// const expertApp = exp.Router()
// const {createOrUpdateExpert, getAllExperts, getExpertById} = require('../controllers/expertController')
// const verifyToken = require('../middleware/authMiddleware')

// expertApp.post('/experts', verifyToken, createOrUpdateExpert)
// expertApp.get('/expert', getAllExperts)
// expertApp.get('/expert/:id', getExpertById)

// module.exports = expertApp
const exp = require('express')
const Experts=require('../models/expertModel')
const expertApp = exp.Router()
const {createOrUpdateExpert, getAllExperts, getExpertById} = require('../controllers/expertController')
const verifyToken = require('../middleware/authMiddleware')

expertApp.post('/experts', verifyToken, createOrUpdateExpert)
expertApp.get('/expert', getAllExperts)
expertApp.get('/expert/:id', getExpertById)

expertApp.get('/exp/:user_id',async(req,res)=>{
    try{
        const user_id = req.params.user_id
        const expert=await Experts.find({userId:user_id})
        if(expert.length===0)
        {
            res.send({message:'Expert Not Found'})
        }
        else
        res.send({message:'Expert Found',payload:expert})
    }catch(err){
        res.status(500).send({message:'Server Error'})
    }
})

module.exports = expertApp
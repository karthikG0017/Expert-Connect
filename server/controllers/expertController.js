const Expert = require('../models/expertModel')
const expressAsyncHandler = require('express-async-handler')

const createOrUpdateExpert = expressAsyncHandler(async(req, res) => {
    const {bio, domain, price, availability, tags} = req.body
    const userId = req.user.id
    try {
        let expert = await Expert.findOne({userId})
        if (expert) {
            expert.bio = bio
            expert.domain = domain
            expert.price = price
            expert.availability = availability
            expert.tags = tags
            await expert.save()
        } else {
            expert = await Expert.create({
                userId, bio, domain, price, availability, tags
            })
        }
        res.send({payload:expert})
    } catch(err) {
        res.status(500).send({message: "Error saving expert profile"})
    }
})

const getAllExperts = expressAsyncHandler(async(req, res) => {
    try {
        const {domain, minPrice, maxPrice, tag} = req.query
        let filter = {}
        if (domain) filter.domain = domain
        if (minPrice || maxPrice) filter.price = {$gte: minPrice || 0, $lte: maxPrice || 100000}
        if (tag) filter.tags = {$in: [tag]}

        const experts = await Expert.find(filter).populate("userId", "name email")
        res.send({payload: experts})
    } catch(err) {
        res.status(500).send({message: "Error fetching experts"})
    }
})

const getExpertById = expressAsyncHandler(async(req, res) => {
    try {
        const expert = await Expert.findById(req.params.id).populate("userId", "name email")
        if (!expert) return res.send({message: "Expert not found"})
        res.send({payload: expert})
    }catch(err) {
        res.status(404).send({message: "Expert not found"})
    }
})

module.exports = {createOrUpdateExpert, getAllExperts, getExpertById}
const Expert = require('../models/expertModel')
const expressAsyncHandler = require('express-async-handler')

const createOrUpdateExpert = expressAsyncHandler(async(req, res) => {
  const { bio, domain, price, tags, address } = req.body
  const userId = req.user.id
  
  // Validate required fields
  if (!bio || !domain || !price || !address) {
    return res.status(400).send({ message: "Missing required fields" })
  }
  
  // Validate address
  if (!address.streetAddress || !address.city || !address.state) {
    return res.status(400).send({ message: "Complete address is required" })
  }
  
  try {
    let expert = await Expert.findOne({ userId })
    
    if (expert) {
      // Update existing expert
      expert.bio = bio
      expert.domain = domain
      expert.price = price
      expert.tags = tags || []
      expert.address = address
      await expert.save()
    } else {
      // Create new expert
      expert = await Expert.create({
        userId, 
        bio, 
        domain, 
        price, 
        tags: tags || [],
        address
      })
    }
    
    res.send({ message: "Expert profile updated successfully", payload: expert })
  } catch(err) {
    console.error('Error in createOrUpdateExpert:', err);
    res.status(500).send({ message: "Error saving expert profile", error: err.message })
  }
})

const getAllExperts = expressAsyncHandler(async(req, res) => {
  try {
    const { domain, minPrice, maxPrice, tag, city, state } = req.query
    let filter = {}
    
    if (domain) filter.domain = domain
    if (minPrice || maxPrice) filter.price = { 
      $gte: minPrice ? Number(minPrice) : 0, 
      $lte: maxPrice ? Number(maxPrice) : 1000000 
    }
    if (tag) filter.tags = { $in: [tag] }
    if (city) filter['address.city'] = city
    if (state) filter['address.state'] = state

    const experts = await Expert.find(filter).populate("userId", "name email")
    res.send({ payload: experts })
  } catch(err) {
    console.error('Error in getAllExperts:', err);
    res.status(500).send({ message: "Error fetching experts", error: err.message })
  }
})

const getExpertById = expressAsyncHandler(async(req, res) => {
  try {
    const expert = await Expert.findById(req.params.id).populate("userId", "name email")
    if (!expert) return res.status(404).send({ message: "Expert not found" })
    res.send({ payload: expert })
  } catch(err) {
    console.error('Error in getExpertById:', err);
    res.status(404).send({ message: "Expert not found", error: err.message })
  }
})

const getExpertProfile = expressAsyncHandler(async(req, res) => {
  try {
    const userId = req.user.id
    const expert = await Expert.find({ userId })
    res.send({ payload: expert })
  } catch(err) {
    console.error('Error in getExpertProfile:', err);
    res.status(500).send({ message: "Error fetching expert profile", error: err.message })
  }
})

module.exports = {
  createOrUpdateExpert,
  getAllExperts,
  getExpertById,
  getExpertProfile
}
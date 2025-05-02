const express = require('express')
const expertApp = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const {
  createOrUpdateExpert,
  getAllExperts,
  getExpertById,
  getExpertProfile
} = require('../controllers/expertController')

// Create or update expert profile
expertApp.post('/expert', verifyToken, createOrUpdateExpert)

// Get all experts (with optional filtering)
expertApp.get('/expert', getAllExperts)

// Get expert by ID
expertApp.get('/expert/:id', getExpertById)

// Get logged-in expert's profile
expertApp.get('/expert-profile', verifyToken, getExpertProfile)

module.exports = expertApp
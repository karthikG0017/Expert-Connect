const exp = require('express')
const expertApp = exp.Router()
const {createOrUpdateExpert, getAllExperts, getExpertById} = require('../controllers/expertController')
const verifyToken = require('../middleware/authMiddleware')

expertApp.post('/experts', verifyToken, createOrUpdateExpert)
expertApp.get('/expert', getAllExperts)
expertApp.get('/expert/:id', getExpertById)

module.exports = expertApp
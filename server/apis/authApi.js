const exp = require('express')
const authApp = exp.Router()
const {register, login} = require('../controllers/authController')

authApp.post('/register', register)
authApp.post('/login', login)

module.exports = authApp
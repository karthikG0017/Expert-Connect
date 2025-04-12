const exp = require('express')
const bookingApp = exp.Router()
const {bookAppointment, getUserBookings, getExpertBookings} = require('../controllers/bookingController')
const verifyToken = require('../middleware/authMiddleware')

bookingApp.post('/bookings', verifyToken, bookAppointment)
bookingApp.get('/user-bookings', verifyToken, getUserBookings)
bookingApp.get('/expert-bookings', verifyToken, getExpertBookings)

module.exports = bookingApp
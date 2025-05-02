const express = require('express')
const bookingApp = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const {
  bookAppointment,
  getUserBookings,
  getExpertBookings,
  updateBookingStatus,
  getBookingsByExpertAndDate
} = require('../controllers/bookingController')

// Create a booking
bookingApp.post('/bookings', verifyToken, bookAppointment)

// Get user's bookings
bookingApp.get('/user-bookings', verifyToken, getUserBookings)

// Get expert's bookings
bookingApp.get('/expert-bookings', verifyToken, getExpertBookings)

// Update booking status (approve/reject)
bookingApp.post('/update-status', verifyToken, updateBookingStatus)

// Get bookings for a specific expert on a specific date
bookingApp.get('/timings/:id/:date', getBookingsByExpertAndDate)

module.exports = bookingApp
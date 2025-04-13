const exp = require('express')
const Booking = require('../models/bookingModel')
const bookingApp = exp.Router()
const {bookAppointment, getUserBookings, getExpertBookings} = require('../controllers/bookingController')
const verifyToken = require('../middleware/authMiddleware')

bookingApp.post('/bookings', verifyToken, bookAppointment)
bookingApp.get('/user-bookings', verifyToken, getUserBookings)
bookingApp.get('/expert-bookings', verifyToken, getExpertBookings)

bookingApp.get('/avail-bookings/:id', async (req, res) => {
    try {
      const expId = req.params.id;
      const bookings = await Booking.find({ 'expertId': expId });
  
      res.send({ payload: bookings });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      res.status(500).send({ message: 'Server Error' });
    }})

    bookingApp.get('/timings/:id/:date', async (req, res) => {
    try{
      const { id, date } = req.params;
      const bookings = await Booking.find({
        "expertId": id,
        "date": date
      });
      res.send({ payload: bookings });
    }catch(err){
      console.error('Error fetching bookings:', err);
    }
    });

module.exports = bookingApp
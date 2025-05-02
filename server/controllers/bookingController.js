const Booking = require('../models/bookingModel')
const Expert = require('../models/expertModel')
const expressAsyncHandler = require('express-async-handler')

const bookAppointment = expressAsyncHandler(async(req, res) => {
  const { expertId, date, Time } = req.body
  const userId = req.user.id

  if (!expertId || !date || !Time) {
    return res.status(400).send({ message: "All booking details are required" })
  }

  try {
    // Check if slot is already booked
    const alreadyBooked = await Booking.findOne({
      expertId, 
      date: new Date(date), 
      Time,
      status: { $in: ['approved', 'pending'] } // Check both approved and pending
    })
    
    if (alreadyBooked) {
      return res.status(400).send({ message: "Slot already booked" })
    }

    // Get expert details
    const expert = await Expert.findById(expertId).populate("userId", "name email")
    
    if (!expert) {
      return res.status(404).send({ message: "Expert not found" })
    }
    
    // Create new booking (always pending for offline appointments)
    const newBooking = await Booking.create({
      userId, 
      expertId, 
      date: new Date(date), 
      Time, 
      expertName: expert?.userId.name,
      status: 'pending'
    })
    
    res.status(201).send({
      message: "Appointment booking request sent",
      payload: newBooking
    })
  } catch(err) {
    console.error('Error in bookAppointment:', err);
    res.status(500).send({
      message: "Booking failed", 
      error: err.message
    })
  }
})

const getUserBookings = expressAsyncHandler(async(req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'expertId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ date: 1 })
    
    res.send({ payload: bookings })
  } catch(err) {
    console.error('Error in getUserBookings:', err);
    res.status(500).send({ message: "Error fetching user bookings", error: err.message })
  }
})

const getExpertBookings = expressAsyncHandler(async(req, res) => {
  try {
    const expert = await Expert.findOne({ userId: req.user.id })
    
    if (!expert) {
      return res.status(404).send({ message: "Expert profile not found" })
    }

    const bookings = await Booking.find({ expertId: expert._id })
      .populate("userId", "name email")
      .sort({ date: 1 })
    
    res.send({ payload: bookings })
  } catch(err) {
    console.error('Error in getExpertBookings:', err);
    res.status(500).send({ message: "Error fetching expert bookings", error: err.message })
  }
})

const updateBookingStatus = expressAsyncHandler(async(req, res) => {
  const { bookingId, status, responseMessage = '' } = req.body
  
  if (!bookingId || !status) {
    return res.status(400).send({ message: "Booking ID and status are required" })
  }
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).send({ message: "Invalid status. Must be 'approved' or 'rejected'" })
  }
  
  try {
    const booking = await Booking.findById(bookingId)
    
    if (!booking) {
      return res.status(404).send({ message: "Booking not found" })
    }
    
    // Verify that this expert owns this booking
    const expert = await Expert.findOne({ userId: req.user.id })
    
    if (!expert || booking.expertId.toString() !== expert._id.toString()) {
      return res.status(403).send({ message: "Unauthorized to update this booking" })
    }
    
    // If approving, reject all other pending bookings for the same time slot
    if (status === 'approved') {
      // Find and reject all other pending bookings for this time slot
      await Booking.updateMany(
        { 
          _id: { $ne: bookingId }, // Not this booking
          expertId: booking.expertId,
          date: booking.date,
          Time: booking.Time,
          status: 'pending'
        },
        { 
          status: 'rejected',
          responseMessage: 'This time slot is no longer available'
        }
      )
    }
    
    // Update this booking's status
    booking.status = status
    booking.responseMessage = responseMessage
    await booking.save()
    
    res.send({
      message: `Booking ${status} successfully`,
      payload: booking
    })
  } catch(err) {
    console.error('Error in updateBookingStatus:', err);
    res.status(500).send({ message: "Status update failed", error: err.message })
  }
})

// Function to auto-reject pending bookings older than 24 hours
const autoRejectPendingBookings = async () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  try {
    const result = await Booking.updateMany(
      { 
        status: 'pending', 
        createdAt: { $lt: yesterday }
      },
      { 
        status: 'rejected',
        responseMessage: 'Automatically rejected due to no response from expert'
      }
    )
    
    console.log(`Auto-rejected ${result.modifiedCount} old pending bookings`)
  } catch (err) {
    console.error('Error auto-rejecting bookings:', err)
  }
}

const getBookingsByExpertAndDate = expressAsyncHandler(async(req, res) => {
  try {
    const { id, date } = req.params
    
    if (!id || !date) {
      return res.status(400).send({ message: "Expert ID and date are required" })
    }
    
    const bookings = await Booking.find({
      expertId: id,
      date: new Date(date),
      status: { $in: ['approved', 'pending'] } // Only return approved and pending bookings
    })
    
    res.send({ payload: bookings })
  } catch(err) {
    console.error('Error in getBookingsByExpertAndDate:', err);
    res.status(500).send({ message: "Error fetching bookings", error: err.message })
  }
})

module.exports = {
  bookAppointment,
  getUserBookings,
  getExpertBookings,
  updateBookingStatus,
  autoRejectPendingBookings,
  getBookingsByExpertAndDate
}
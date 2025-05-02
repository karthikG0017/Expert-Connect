const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  Time: {
    type: String,
    required: true
  },
  expertName: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  responseMessage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Booking', bookingSchema)
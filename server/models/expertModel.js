const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  streetAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  }
}, { _id: false })

const expertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
  address: {
    type: addressSchema,
    required: true
  },
  availability: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Expert', expertSchema)
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  carId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Car', 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  basePrice: { 
    type: Number, 
    required: true 
  },
  serviceCharge: { 
    type: Number, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  paymentReference: {
    type: String,
    default: null
  },
  currency: {
    type: String,
    default: 'GHS'
  },
  // Additional fields for context-aware booking
  serviceType: { type: String },
  flightNumber: { type: String },
  terminal: { type: String },
  return: { type: Boolean },
  airportReturnDate: { type: String },
  airportReturnTime: { type: String },
  airportPassengers: { type: Number },
  from: { type: String },
  to: { type: String },
  dailyPickup: { type: String },
  dailyPassengers: { type: Number },
  withDriver: { type: Boolean },
  outTownCity: { type: String },
  outTownPickup: { type: String },
  outTownDays: { type: String },
  outTownPassengers: { type: Number },
  outTownReturn: { type: Boolean },
  pickupAddress: { type: String },
  duration: { type: String },
  hourlyPassengers: { type: Number }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Booking', bookingSchema);

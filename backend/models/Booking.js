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
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Booking', bookingSchema);

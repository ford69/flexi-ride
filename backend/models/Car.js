const mongoose = require('mongoose');

const carServiceTypeSchema = new mongoose.Schema({
  serviceTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceType',
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const carSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  make: String,
  model: String,
  year: Number,
  type: String,
  description: String,
  // dailyRate field removed - pricing is now handled by serviceTypes
  location: String,
  images: [String],
  features: [String],
  availability: { type: Boolean, default: true },
  serviceTypes: [carServiceTypeSchema], // New field for multiple service types
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Car', carSchema);

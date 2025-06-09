const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  make: String,
  model: String,
  year: Number,
  type: String,
  description: String,
  dailyRate: Number,
  location: String,
  images: [String],
  features: [String],
  availability: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Car', carSchema);

const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  code: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  defaultPrice: { 
    type: Number, 
    default: 0 
  },
  pricingType: { 
    type: String, 
    enum: ['per_day', 'per_hour', 'per_trip', 'per_km'],
    default: 'per_day'
  },
  icon: { 
    type: String, 
    default: 'car' 
  },
  sortOrder: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema); 
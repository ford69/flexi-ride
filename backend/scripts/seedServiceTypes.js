require('dotenv').config();
const mongoose = require('mongoose');
const ServiceType = require('../models/ServiceType');

const serviceTypes = [
  {
    name: 'Airport Transfer',
    code: 'airport',
    description: 'Transportation to and from the airport',
    defaultPrice: 150,
    pricingType: 'per_trip',
    icon: 'plane',
    sortOrder: 1
  },
  {
    name: 'Daily Rental',
    code: 'daily',
    description: 'Car rental for daily use',
    defaultPrice: 200,
    pricingType: 'per_day',
    icon: 'calendar',
    sortOrder: 2
  },
  {
    name: 'Out of Town',
    code: 'out-of-town',
    description: 'Long distance trips outside the city',
    defaultPrice: 300,
    pricingType: 'per_day',
    icon: 'map-pin',
    sortOrder: 3
  },
  {
    name: 'Hourly Ride',
    code: 'hourly',
    description: 'Short duration rides within the city',
    defaultPrice: 50,
    pricingType: 'per_hour',
    icon: 'clock',
    sortOrder: 4
  }
];

const seedServiceTypes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing service types
    await ServiceType.deleteMany({});
    console.log('Cleared existing service types');

    // Insert new service types
    const insertedServiceTypes = await ServiceType.insertMany(serviceTypes);
    console.log(`Inserted ${insertedServiceTypes.length} service types:`);
    
    insertedServiceTypes.forEach(st => {
      console.log(`- ${st.name} (${st.code}): ${st.defaultPrice} ${st.pricingType}`);
    });

    console.log('✅ Service types seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding service types:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script if called directly
if (require.main === module) {
  seedServiceTypes();
}

module.exports = seedServiceTypes; 
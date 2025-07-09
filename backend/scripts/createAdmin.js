require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Parse command-line arguments
const args = process.argv.slice(2);
const argObj = args.reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value;
  return acc;
}, {});

const name = argObj.name || 'Admin';
const email = argObj.email;
const password = argObj.password || 'password123';

if (!email) {
  console.error('❌ Please provide an email using --email="admin@example.com"');
  process.exit(1);
}

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      console.log('⚠️ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      status: 'active'
    });

    console.log('✅ Admin user created successfully:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 
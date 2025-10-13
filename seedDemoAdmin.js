require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const seedDemoAdmin = async () => {
  try {
    console.log(' Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');

    // Check if demo admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sevaconnect.com' });
    
    if (existingAdmin) {
      console.log(' Demo admin user already exists');
      process.exit(0);
    }

    // Create demo admin user
    const demoAdmin = await User.create({
      name: 'Seva Connect Admin',
      email: 'admin@sevaconnect.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      isVerified: true
    });

    console.log(' Demo admin user created successfully!');
    console.log(' Email: admin@sevaconnect.com');
    console.log(' Password: admin123');
    console.log(' Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error(' Error creating demo admin:', error);
    process.exit(1);
  }
};

seedDemoAdmin();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const Enquiry = require('../models/Enquiry');

dotenv.config({ path: __dirname + '/../.env' });

const sampleProperties = [
  {
    title: 'Skyline Luxury Boys PG & Hostel',
    description: 'Modern luxury PG for students and working professionals. Includes 3 times nutritious meals, high-speed optical fiber WiFi, daily housekeeping, and 24/7 power backup.',
    rent: 8500,
    location: 'Vijay Nagar',
    address: '102, Scheme 54, Near C21 Mall, Vijay Nagar, Indore',
    roomType: 'Single',
    facilities: ['WiFi', 'Food', 'AC', 'Parking', 'CCTV', 'Laundry', 'Housekeeping', 'Electricity'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    availableRooms: 3,
    genderPreference: 'Male',
  },
  {
    title: 'Comfort Stay Girls Hostel & PG',
    description: 'Safe and peaceful accommodation exclusively for women. Biometric access, CCTV monitoring, homemade hygienic food, and attached balcony in every room.',
    rent: 6500,
    location: 'Bhawarkua',
    address: '45, Professor Colony, Near IT Park, Bhawarkua, Indore',
    roomType: 'Double',
    facilities: ['WiFi', 'Food', 'CCTV', 'Laundry', 'Housekeeping', 'Electricity'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80'
    ],
    availableRooms: 5,
    genderPreference: 'Female',
  },
  {
    title: 'Green View Co-Living Space',
    description: 'Premium unisex co-living PG with spacious AC rooms, modern gaming lounge, rooftop cafeteria, and gym facility.',
    rent: 11000,
    location: 'Palasia',
    address: '88, Old Palasia, Near Industry House, Indore',
    roomType: 'Single',
    facilities: ['WiFi', 'AC', 'Food', 'Parking', 'Laundry', 'CCTV', 'Electricity', 'Housekeeping'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80'
    ],
    availableRooms: 2,
    genderPreference: 'Any',
  },
  {
    title: 'Budget Executive Room & PG',
    description: 'Affordable sharing PG rooms near engineering colleges. Clean environment, individual study tables, and regular water supply.',
    rent: 4500,
    location: 'Rau',
    address: '12, Bypass Road, Opposite IPS Academy, Rau, Indore',
    roomType: 'Triple',
    facilities: ['WiFi', 'Parking', 'Electricity', 'CCTV'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80'
    ],
    availableRooms: 6,
    genderPreference: 'Male',
  },
  {
    title: 'Royal Palms Premium Studio Apartments',
    description: 'Fully furnished studio apartments with kitchenette, air conditioning, smart TV, and private parking. Perfect for corporate employees.',
    rent: 14000,
    location: 'Bengali Square',
    address: '77, World Cup Square, Ring Road, Bengali Square, Indore',
    roomType: 'Single',
    facilities: ['WiFi', 'AC', 'Parking', 'CCTV', 'Electricity', 'Housekeeping'],
    images: [
      'https://images.unsplash.com/photo-1502672016978-43d9c79219f7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    availableRooms: 4,
    genderPreference: 'Any',
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staynest');
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Property.deleteMany();
    await Favorite.deleteMany();
    await Enquiry.deleteMany();

    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create default owner
    const owner = await User.create({
      name: 'Rajesh Sharma (Owner)',
      email: 'owner@staynest.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'owner',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    // Create default tenant
    const tenant = await User.create({
      name: 'Aman Verma (Tenant)',
      email: 'tenant@staynest.com',
      password: hashedPassword,
      phone: '9123456789',
      role: 'tenant',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    });

    // Add properties
    const propertiesWithOwner = sampleProperties.map(p => ({ ...p, owner: owner._id }));
    const createdProperties = await Property.insertMany(propertiesWithOwner);

    // Create sample favorite
    await Favorite.create({
      user: tenant._id,
      property: createdProperties[0]._id,
    });

    // Create sample enquiry
    await Enquiry.create({
      tenant: tenant._id,
      owner: owner._id,
      property: createdProperties[0]._id,
      message: 'Hello, I am interested in visiting this PG this weekend. Are rooms currently available?',
      status: 'Pending',
    });

    console.log('Data Seeding Completed Successfully!');
    console.log('====================================');
    console.log('Default Owner Account: owner@staynest.com / 123456');
    console.log('Default Tenant Account: tenant@staynest.com / 123456');
    console.log('====================================');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:', error.message);
    console.error('----------------------------------------------------');
    console.error('👉 Please make sure MongoDB service is running locally on port 27017,');
    console.error('   or provide a valid MONGO_URI in your backend/.env file!');
    console.error('----------------------------------------------------\n');
    process.exit(1);
  }
};

seedData();

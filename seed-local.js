require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Scheme = require('./models/Scheme');

const dbUri = process.env.APP_MONGODB_URI || process.env.MONGODB_URI;

const seedDB = async () => {
  try {
    console.log('--- Seeding Local MongoDB... ---');
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB');

    const data = JSON.parse(fs.readFileSync('./schemes.JSON', 'utf-8'));
    
    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log('🗑️  Cleared existing schemes');
    
    // Insert new schemes
    await Scheme.insertMany(data.schemes);
    console.log(`✅ Seeded ${data.schemes.length} schemes successfully`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Error:', err);
    process.exit(1);
  }
};

seedDB();

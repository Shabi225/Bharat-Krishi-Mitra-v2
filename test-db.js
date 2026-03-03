require('dotenv').config();
const mongoose = require('mongoose');

console.log('--- FINAL CONNECTION TEST: DNS BYPASS STRATEGY ---');

const uri = process.env.APP_MONGODB_URI || process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI/APP_MONGODB_URI is not defined in .env');
  process.exit(1);
}

// We add a tiny bit more configuration for stability
const options = {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4
};

console.log('🔄 Attempting to connect to explicit shards...');

mongoose.connect(uri, options)
  .then(() => {
    console.log('\n✅✅ CONNECTION ESTABLISHED SUCCESSFULLY! ✅✅');
    console.log('Database name:', mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ CRITICAL FAILURE:', err.message);
    console.log('\nFinal diagnosis:');
    console.log('1. Check if "admin" and "admin321" are correct credentials.');
    console.log('2. Ensure your IP is whitelisted in Atlas (Network Access).');
    console.log('3. Your network might be blocking Port 27017 entirely (common in libraries/office Wi-Fi).');
    process.exit(1);
  });

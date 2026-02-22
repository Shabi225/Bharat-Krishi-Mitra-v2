require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Scheme = require('./models/Scheme');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Auth Routes ---

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  console.log('--- Signup Attempt ---');
  console.log('Data received:', req.body);
  try {
    const { fullName, mobileNumber, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (user) {
      console.log('Signup failed: User already exists');
      return res.status(400).json({ message: 'User already exists with this email or mobile number' });
    }

    user = new User({ fullName, mobileNumber, email, password });
    await user.save();
    console.log('✅ User registered successfully:', email);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Signup Error Detail:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Sign In
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { loginKey, password } = req.body; // loginKey can be email or mobileNumber
    
    const user = await User.findOne({ 
      $or: [{ email: loginKey }, { mobileNumber: loginKey }] 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Schemes Routes ---

// Get all schemes
app.get('/api/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json({ schemes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed data (one-time use or utility)
app.get('/api/schemes/seed', async (req, res) => {
  try {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('./schemes.JSON', 'utf-8'));
    
    // Clear existing schemes
    await Scheme.deleteMany({});
    
    // Insert new schemes
    await Scheme.insertMany(data.schemes);
    
    res.json({ message: 'Data seeded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Seed failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ministry: String,
  category: String,
  gender: String,
  caste: String,
  age: String,
  state: String,
  status: String,
  cardPoints: [String],
  description: String,
  applySteps: [String],
  documents: [String],
  notes: String,
  applyLink: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scheme', SchemeSchema);

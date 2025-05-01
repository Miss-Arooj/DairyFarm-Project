const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  animalId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  type: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Animal', AnimalSchema);
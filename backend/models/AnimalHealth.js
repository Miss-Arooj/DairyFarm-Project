const mongoose = require('mongoose');

const AnimalHealthSchema = new mongoose.Schema({
  animalId: {
    type: String,
    required: true
  },
  animalName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  treatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  dateRecorded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnimalHealth', AnimalHealthSchema);
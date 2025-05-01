const mongoose = require('mongoose');

const MilkProductionSchema = new mongoose.Schema({
  productionDate: {
    type: Date,
    required: true
  },
  animalId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Poor'],
    default: 'Good'
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MilkProduction', MilkProductionSchema);
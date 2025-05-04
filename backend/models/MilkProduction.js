const mongoose = require('mongoose');

const MilkProductionSchema = new mongoose.Schema({
    productionDate: {
      type: Date,
      required: [true, 'Please add a production date'],
      max: [Date.now, 'Production date cannot be in the future']
    },
    animalId: {
      type: String,
      required: [true, 'Please add an animal ID'],
      trim: true,
      uppercase: true
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      min: [0.1, 'Quantity must be at least 0.1 KG'],
      max: [50, 'Quantity cannot exceed 50 KG']
    },
    quality: {
      type: String,
      enum: {
        values: ['Excellent', 'Good', 'Average', 'Poor'],
        message: 'Please select valid quality'
      },
      default: 'Good'
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });
  
  // Add index for better performance on frequent queries
  MilkProductionSchema.index({ productionDate: -1 });
  MilkProductionSchema.index({ animalId: 1 });

module.exports = mongoose.model('MilkProduction', MilkProductionSchema);
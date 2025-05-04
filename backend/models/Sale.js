const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  saleId: {
    type: String,
    required: true,
    unique: true
  },
  saleDate: {
    type: Date,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  dateRecorded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sale', SaleSchema);
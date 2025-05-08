const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  totalRevenue: {
    type: Number,
    required: true
  },
  totalExpense: {
    type: Number,
    required: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRecorded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Finance', FinanceSchema);
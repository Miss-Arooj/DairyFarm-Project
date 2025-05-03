const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'completed', 'cancelled'] },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
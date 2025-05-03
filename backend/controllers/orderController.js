const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  const { customerInfo, cart, total } = req.body;

  if (!customerInfo || !cart || !total) {
    res.status(400);
    throw new Error('Please provide all order details');
  }

  const order = await Order.create({
    customerName: customerInfo.name,
    customerContact: customerInfo.contact,
    customerAddress: customerInfo.address,
    products: cart.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: total,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Manager
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = {
  createOrder,
  getOrders
};
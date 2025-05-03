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

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Manager
const getOrderStats = asyncHandler(async (req, res) => {
    try {
      const stats = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" }
          }
        },
        {
          $project: {
            _id: 0,
            totalOrders: 1,
            totalRevenue: 1,
            avgOrderValue: { $round: ["$avgOrderValue", 2] }
          }
        }
      ]);
  
      res.json({
        success: true,
        data: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          avgOrderValue: 0
        }
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      res.status(500);
      throw new Error('Server error while fetching order statistics');
    }
  });

module.exports = {
  createOrder,
  getOrders,
  getOrderStats
};
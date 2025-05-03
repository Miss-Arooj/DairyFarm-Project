const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  const { customerInfo, cart, total } = req.body;

  // Get manager ID from the first product (in a real app, you'd have a better way)
  const managerId = '65c0a8e9a1b2c3d4e5f6g7h'; // This should be dynamic in production

  const order = await Order.create({
    customerInfo,
    items: cart.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    total,
    manager: managerId
  });

  res.status(201).json({
    success: true,
    message: 'Order received successfully',
    order
  });
});

// @desc    Get all orders for a manager
// @route   GET /api/orders
// @access  Private/Manager
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ manager: req.user.id }).sort({ date: -1 });
  res.json(orders);
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Manager
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    { $match: { manager: mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$total" }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);

  res.json(stats);
});

module.exports = {
  createOrder,
  getOrders,
  getOrderStats
};
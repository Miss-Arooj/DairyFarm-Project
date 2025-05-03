const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  const { customerInfo, cart, total } = req.body;

  // Get manager ID from product (in real app, you'd associate products with managers)
  // For demo, we'll use the first manager
  const manager = await User.findOne({ role: 'manager' });
  if (!manager) {
    res.status(400);
    throw new Error('No manager found to associate order with');
  }

  const orderItems = cart.map(item => ({
    productId: item.id.toString(),
    name: item.name,
    quantity: item.quantity,
    price: item.price
  }));

  const order = await Order.create({
    customerInfo,
    items: orderItems,
    totalAmount: total,
    manager: manager._id
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders for manager
// @route   GET /api/orders
// @access  Private/Manager
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ manager: req.user.id })
    .sort({ date: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Manager
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $match: { manager: mongoose.Types.ObjectId(req.user.id) }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" }
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
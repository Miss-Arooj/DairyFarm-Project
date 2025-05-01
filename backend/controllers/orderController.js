const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  const { customerInfo, cart, total } = req.body;

  // In a real app, you would save to database here
  console.log('New order received:', { customerInfo, cart, total });

  res.status(201).json({
    success: true,
    message: 'Order received successfully',
    order: { customerInfo, cart, total }
  });
});

module.exports = {
  createOrder
};
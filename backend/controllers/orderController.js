const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    // Validate required fields
    const requiredCustomerFields = ['name', 'contact', 'address'];
    const missingCustomerFields = requiredCustomerFields.filter(field => !customer[field]);
    
    if (missingCustomerFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing customer fields: ${missingCustomerFields.join(', ')}` 
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Validate each product in the order
    const validatedItems = [];
    let calculatedTotal = 0;
    
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: 'Invalid item data' });
      }

      const product = await Product.findOne({ productId: item.productId });
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      // Use current product price (not the one sent from client)
      const itemPrice = product.pricePerUnit;
      validatedItems.push({
        productId: product.productId,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity
      });

      calculatedTotal += itemPrice * item.quantity;
    }

    // Verify total amount matches calculated total
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ 
        message: 'Total amount mismatch',
        calculatedTotal,
        receivedTotal: totalAmount
      });
    }

    // Create the order
    const order = new Order({
      customer,
      items: validatedItems,
      totalAmount: calculatedTotal
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order.orderId
    });
  } catch (error) {
    console.error('Order creation error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      message: 'Server error while creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};
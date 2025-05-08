const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order (no authentication required)
router.post('/', orderController.createOrder);

// These would still be protected for employees/managers
// router.get('/', protect, employeeOnly, orderController.getOrders);
// router.put('/:id/status', protect, employeeOnly, orderController.updateOrderStatus);

module.exports = router;
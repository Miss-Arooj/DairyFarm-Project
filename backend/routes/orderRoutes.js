const express = require('express');
const router = express.Router();
const { protect, managerOnly } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrderStats
} = require('../controllers/orderController');

router.route('/')
  .post(createOrder)
  .get(protect, managerOnly, getOrders);

router.route('/stats')
  .get(protect, managerOnly, getOrderStats);

module.exports = router;
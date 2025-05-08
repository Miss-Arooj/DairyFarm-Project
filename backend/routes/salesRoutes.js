const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const salesController = require('../controllers/salesController');

router.route('/')
  .post(protect, salesController.addSale)
  .get(protect, salesController.getSales);

router.route('/stats')
  .get(protect, salesController.getSalesStats);

// In salesRoutes.js
console.log('salesController:', salesController);
console.log('getSalesStats exists:', typeof salesController.getSalesStats === 'function');

module.exports = router;
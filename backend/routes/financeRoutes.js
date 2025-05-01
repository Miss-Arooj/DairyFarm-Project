const express = require('express');
const router = express.Router();
const { protect, managerOnly } = require('../middleware/auth');
const {
  addFinanceRecord,
  getFinanceRecords,
  getFinanceStats
} = require('../controllers/financeController');

router.route('/')
  .post(protect, managerOnly, addFinanceRecord)
  .get(protect, managerOnly, getFinanceRecords);

router.route('/stats')
  .get(protect, managerOnly, getFinanceStats);

module.exports = router;
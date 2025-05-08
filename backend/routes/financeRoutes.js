// financeRoutes.js
const express = require('express');
const router = express.Router();
const { protect, managerOnly, employeeOnly } = require('../middleware/auth');
const {
  addFinanceRecord,
  getFinanceRecords,
  getFinanceStats
} = require('../controllers/financeController');

router.route('/')
  .post(protect, employeeOnly, addFinanceRecord) // accessible to all authenticated employees
  .get(protect, managerOnly, getFinanceRecords); // manager-only

router.route('/stats')
  .get(protect, managerOnly, getFinanceStats); // manager-only

module.exports = router;
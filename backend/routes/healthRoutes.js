const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addHealthReport,
  getHealthReports
} = require('../controllers/healthController');

router.route('/')
  .post(protect, addHealthReport)
  .get(protect, getHealthReports);

module.exports = router;
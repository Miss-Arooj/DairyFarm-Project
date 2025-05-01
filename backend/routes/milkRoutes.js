const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addMilkRecord,
  getMilkRecords,
  getMilkStats
} = require('../controllers/milkController');

router.route('/')
  .post(protect, addMilkRecord)
  .get(protect, getMilkRecords);

router.route('/stats')
  .get(protect, getMilkStats);

module.exports = router;
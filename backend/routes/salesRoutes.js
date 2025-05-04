const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addSale,
  getSales
} = require('../controllers/salesController');

router.route('/')
  .post(protect, addSale)
  .get(protect, getSales);

module.exports = router;
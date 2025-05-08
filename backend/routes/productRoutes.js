const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, employeeOnly } = require('../middleware/auth');

// Add new product (Employee only)
router.post('/', protect, employeeOnly, productController.addProduct);

// Get all products (Employee only)
router.get('/', protect, productController.getProducts);

// Get product by ID (Employee only)
router.get('/:id', protect, employeeOnly, productController.getProductById);

module.exports = router;
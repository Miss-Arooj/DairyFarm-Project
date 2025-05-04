const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Add new product (Employee only)
router.post('/', authMiddleware.employeeAuth, productController.addProduct);

// Get all products (Employee only)
router.get('/', authMiddleware.employeeAuth, productController.getProducts);

// Get product by ID (Employee only)
router.get('/:id', authMiddleware.employeeAuth, productController.getProductById);

module.exports = router;
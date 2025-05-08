const Product = require('../models/Product');
const Employee = require('../models/Employee');

// Add new product
const addProduct = async (req, res) => {
  try {
    const { productId, name, pricePerUnit, availability, productionDate, expirationDate } = req.body;
    
    // Validate required fields
    if (!productId || !name || !pricePerUnit || !availability || !productionDate || !expirationDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this ID already exists' });
    }

    // Validate dates
    if (new Date(productionDate) > new Date(expirationDate)) {
      return res.status(400).json({ message: 'Expiration date must be after production date' });
    }

    // Create new product
    const product = new Product({
      productId,
      name,
      pricePerUnit,
      availability,
      productionDate,
      expirationDate,
      createdBy: req.employee._id // Changed from req.employee.id to req.employee._id
    });

    await product.save();

    res.status(201).json({
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id })
      .populate('createdBy', 'name');
      
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message // Send the actual error message to frontend
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById
};
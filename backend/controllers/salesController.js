const Sale = require('../models/Sale');
const asyncHandler = require('express-async-handler');

// @desc    Add new sale
// @route   POST /api/sales
// @access  Private/Employee
const addSale = asyncHandler(async (req, res) => {
  const { saleId, saleDate, customerName, productId, totalCost } = req.body;

  // Validate required fields
  if (!saleId || !saleDate || !customerName || !productId || !totalCost) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Validate total cost is a positive number
  if (isNaN(totalCost)) {
    res.status(400);
    throw new Error('Total cost must be a number');
  }
  if (parseFloat(totalCost) <= 0) {
    res.status(400);
    throw new Error('Total cost must be greater than 0');
  }

  // Check if sale already exists
  const saleExists = await Sale.findOne({ saleId });
  if (saleExists) {
    res.status(400);
    throw new Error('Sale with this ID already exists');
  }

  // Create new sale
  const sale = await Sale.create({
    saleId,
    saleDate,
    customerName,
    productId,
    totalCost: parseFloat(totalCost),
    recordedBy: req.user._id
  });

  res.status(201).json(sale);
});

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = asyncHandler(async (req, res) => {
  const { saleId } = req.query;
  let query = {};

  if (saleId) {
    query.saleId = { $regex: saleId, $options: 'i' };
  }

  const sales = await Sale.find(query)
    .sort({ saleDate: -1 })
    .populate('recordedBy', 'name');
  
  res.json(sales);
});

const getSalesStats = asyncHandler(async (req, res) => {
  const stats = await Sale.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
        totalSales: { $sum: "$totalCost" },
        count: { $sum: 1 },
        productsSold: { $addToSet: "$productId" }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);

  res.json(stats);
});

module.exports = {
  addSale,
  getSales,
  getSalesStats
};
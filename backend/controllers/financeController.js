const Finance = require('../models/Finance');
const asyncHandler = require('express-async-handler');

// @desc    Add finance record
// @route   POST /api/finance
// @access  Private/Manager
const addFinanceRecord = asyncHandler(async (req, res) => {
  const { date, totalRevenue, totalExpense } = req.body;

  const financeRecord = await Finance.create({
    date,
    totalRevenue,
    totalExpense,
    recordedBy: req.user._id
  });

  res.status(201).json(financeRecord);
});

// @desc    Get finance records
// @route   GET /api/finance
// @access  Private/Manager
const getFinanceRecords = asyncHandler(async (req, res) => {
  const { date } = req.query;
  let query = {};

  if (date) {
    query.date = {
      $gte: new Date(new Date(date).setHours(0, 0, 0)),
      $lt: new Date(new Date(date).setHours(23, 59, 59))
    };
  }

  const financeRecords = await Finance.find(query).sort({ date: -1 });
  res.json(financeRecords);
});

// @desc    Get finance statistics
// @route   GET /api/finance/stats
// @access  Private/Manager
const getFinanceStats = asyncHandler(async (req, res) => {
  // Group by month and calculate totals
  const stats = await Finance.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        totalRevenue: { $sum: "$totalRevenue" },
        totalExpense: { $sum: "$totalExpense" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 12 }
  ]);

  res.json(stats);
});

module.exports = {
  addFinanceRecord,
  getFinanceRecords,
  getFinanceStats
};
const mongoose = require('mongoose');
const Finance = require('../models/Finance');
const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');

// @desc    Add finance record
// @route   POST /api/finance
// @access  Private (Both Employee and Manager)
const addFinanceRecord = asyncHandler(async (req, res) => {
  const { date, totalRevenue, totalExpense } = req.body;

  // Validation
  if (!date || totalRevenue === undefined || totalExpense === undefined) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (isNaN(totalRevenue) || isNaN(totalExpense)) {
    res.status(400);
    throw new Error('Revenue and expense must be numbers');
  }

  // Get employee details to get manager reference
  const employee = await Employee.findById(req.employee._id);
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const financeRecord = await Finance.create({
    date,
    totalRevenue: parseFloat(totalRevenue),
    totalExpense: parseFloat(totalExpense),
    recordedBy: req.employee._id,
    manager: employee.manager
  });

  res.status(201).json(financeRecord);
});

// @desc    Get finance records
// @route   GET /api/finance
// @access  Private/Manager
const getFinanceRecords = asyncHandler(async (req, res) => {
  const { date } = req.query;
  let query = {manager: req.user._id};

  if (date) {
    query.date = {
      $gte: new Date(new Date(date).setHours(0, 0, 0)),
      $lt: new Date(new Date(date).setHours(23, 59, 59))
    };
  }

  const financeRecords = await Finance.find(query)
    .populate('recordedBy', 'name employeeId')
    .sort({ date: -1 });
  
  res.json(financeRecords);
});

// @desc    Get finance statistics
// @route   GET /api/finance/stats
// @access  Private/Manager
const getFinanceStats = asyncHandler(async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: 'Invalid manager ID' });
    }

    const stats = await Finance.aggregate([
      {
        $match: { 
          manager: new mongoose.Types.ObjectId(req.user._id),
          date: { $exists: true }
        }
      },
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
  } catch (error) {
    console.error('Error in getFinanceStats:', error);
    res.status(500).json({ 
      message: 'Error generating finance statistics',
      error: error.message 
    });
  }
});

module.exports = {
  addFinanceRecord,
  getFinanceRecords,
  getFinanceStats
};
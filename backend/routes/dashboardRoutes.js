const express = require('express');
const router = express.Router();
const { protect, managerOnly } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');
const Animal = require('../models/Animal');
const Employee = require('../models/Employee');
const MilkProduction = require('../models/MilkProduction');
const Order = require('../models/Order');
const Finance = require('../models/Finance');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Manager
router.get('/stats', protect, managerOnly, asyncHandler(async (req, res) => {
  try {
    // Get counts for all data related to this manager
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Promise.all([
      Animal.countDocuments(),
      Employee.countDocuments({ manager: req.user.id }),
      MilkProduction.aggregate([
        {
          $match: {
            productionDate: { $gte: today, $lt: tomorrow }
          }
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$quantity" }
          }
        }
      ]),
      Finance.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalRevenue" },
            totalExpense: { $sum: "$totalExpense" }
          }
        }
      ])
    ]);

    res.json({
      totalAnimals: stats[0],
      totalEmployees: stats[1],
      todayMilkProduction: stats[2][0]?.totalQuantity || 0,
      totalRevenue: stats[3][0]?.totalRevenue || 0,
      totalExpense: stats[3][0]?.totalExpense || 0
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500);
    throw new Error('Server error while fetching dashboard stats');
  }
}));

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');
const Animal = require('../models/Animal');
const MilkProduction = require('../models/MilkProduction');
const Order = require('../models/Order');
const Finance = require('../models/Finance');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, asyncHandler(async (req, res) => {
  const [totalEmployees, totalAnimals, todayMilkProduction, monthlyRevenue] = await Promise.all([
    Employee.countDocuments({ manager: req.user.id }),
    Animal.countDocuments(),
    MilkProduction.aggregate([
      {
        $match: {
          productionDate: {
            $gte: new Date(new Date().setHours(0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59))
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]),
    Order.aggregate([
      {
        $match: {
          manager: mongoose.Types.ObjectId(req.user.id),
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" }
        }
      }
    ])
  ]);

  res.json({
    totalEmployees,
    totalAnimals,
    todayMilkProduction: todayMilkProduction[0]?.total || 0,
    monthlyRevenue: monthlyRevenue[0]?.total || 0
  });
}));

module.exports = router;
const Animal = require('../models/Animal');
const Employee = require('../models/Employee');
const MilkProduction = require('../models/MilkProduction');
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Manager
const getDashboardStats = asyncHandler(async (req, res) => {
  // Today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start of month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  try {
    // Get total animals
    const totalAnimals = await Animal.countDocuments({ manager: req.user.id });
    
    // Get total employees
    const totalEmployees = await Employee.countDocuments({ manager: req.user.id });
    
    // Get today's milk production
    const todayMilk = await MilkProduction.aggregate([
      {
        $match: { 
          manager: mongoose.Types.ObjectId(req.user.id),
          productionDate: { 
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" }
        }
      }
    ]);
    
    // Get monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $match: { 
          manager: mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalAnimals,
        totalEmployees,
        todayMilkProduction: todayMilk[0]?.totalQuantity || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500);
    throw new Error('Server error while fetching dashboard stats');
  }
});

module.exports = {
  getDashboardStats
};
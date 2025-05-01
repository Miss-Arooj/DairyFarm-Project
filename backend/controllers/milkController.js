const MilkProduction = require('../models/MilkProduction');
const asyncHandler = require('express-async-handler');

// @desc    Add milk production record
// @route   POST /api/milk
// @access  Private/Employee
const addMilkRecord = asyncHandler(async (req, res) => {
  const { productionDate, animalId, quantity, quality } = req.body;

  const milkRecord = await MilkProduction.create({
    productionDate,
    animalId,
    quantity,
    quality,
    recordedBy: req.user._id
  });

  res.status(201).json(milkRecord);
});

// @desc    Get milk production records
// @route   GET /api/milk
// @access  Private
const getMilkRecords = asyncHandler(async (req, res) => {
  const { animalId, date } = req.query;
  let query = {};

  if (animalId) {
    query.animalId = { $regex: animalId, $options: 'i' };
  }

  if (date) {
    query.productionDate = {
        $gte: new Date(new Date(date).setHours(0, 0, 0)),
      $lt: new Date(new Date(date).setHours(23, 59, 59))
    };
  }

  const milkRecords = await MilkProduction.find(query).sort({ productionDate: -1 });
  res.json(milkRecords);
});

// @desc    Get milk production statistics
// @route   GET /api/milk/stats
// @access  Private/Manager
const getMilkStats = asyncHandler(async (req, res) => {
  // Group by date and calculate total quantity
  const stats = await MilkProduction.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$productionDate" } },
        totalQuantity: { $sum: "$quantity" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);

  res.json(stats);
});

module.exports = {
  addMilkRecord,
  getMilkRecords,
  getMilkStats
};
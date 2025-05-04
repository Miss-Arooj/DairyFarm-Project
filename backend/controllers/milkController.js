const MilkProduction = require('../models/MilkProduction');
const asyncHandler = require('express-async-handler');

// @desc    Add milk production record
// @route   POST /api/milk
// @access  Private/Employee
const addMilkRecord = asyncHandler(async (req, res) => {
    const { productionDate, animalId, quantity, quality } = req.body;
  
    // Validation
    if (!productionDate || !animalId || !quantity) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
  
    if (isNaN(quantity) || parseFloat(quantity) <= 0) {
      return res.status(400).json({ message: 'Please provide a valid quantity' });
    }
  
    if (new Date(productionDate) > new Date()) {
      return res.status(400).json({ message: 'Production date cannot be in the future' });
    }
  
    const milkRecord = await MilkProduction.create({
      productionDate,
      animalId: animalId.toUpperCase().trim(),
      quantity: parseFloat(quantity).toFixed(2),
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
  
    const milkRecords = await MilkProduction.find(query)
      .sort({ productionDate: -1 })
      .populate('recordedBy', 'name');
      
    res.json(milkRecords);
  });
  
  // Update the getMilkStats to include average quality
  const getMilkStats = asyncHandler(async (req, res) => {
    const stats = await MilkProduction.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$productionDate" } },
          totalQuantity: { $sum: "$quantity" },
          count: { $sum: 1 },
          avgQuality: { 
            $avg: {
              $switch: {
                branches: [
                  { case: { $eq: ["$quality", "Excellent"] }, then: 4 },
                  { case: { $eq: ["$quality", "Good"] }, then: 3 },
                  { case: { $eq: ["$quality", "Average"] }, then: 2 },
                  { case: { $eq: ["$quality", "Poor"] }, then: 1 }
                ],
                default: 0
              }
            } 
          }
        }
      },
      { 
        $addFields: {
          qualityRating: {
            $switch: {
              branches: [
                { case: { $gte: ["$avgQuality", 3.5] }, then: "Excellent" },
                { case: { $gte: ["$avgQuality", 2.5] }, then: "Good" },
                { case: { $gte: ["$avgQuality", 1.5] }, then: "Average" },
                { case: { $lt: ["$avgQuality", 1.5] }, then: "Poor" }
              ],
              default: "Unknown"
            }
          }
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
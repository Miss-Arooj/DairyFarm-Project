const MilkProduction = require('../models/MilkProduction');
const asyncHandler = require('express-async-handler');

// @desc    Add milk production record
// @route   POST /api/milk
// @access  Private/Employee
const addMilkRecord = asyncHandler(async (req, res) => {
    console.log('Received POST to /api/milk with body:', req.body);
    const { productionDate, animalId, quantity, quality } = req.body;
  
    // Basic validation
    if (!productionDate || !animalId || quantity === undefined) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }
  
    if (isNaN(quantity)) {
      return res.status(400).json({ 
        message: 'Quantity must be a number' 
      });
    }
  
    if (parseFloat(quantity) <= 0) {
      return res.status(400).json({ 
        message: 'Quantity must be greater than 0' 
      });
    }
  
    try {
      // Convert productionDate to Date object
      const productionDateObj = new Date(productionDate);
      if (isNaN(productionDateObj.getTime())) {
        return res.status(400).json({
          message: 'Invalid production date format'
        });
      }

      const milkRecord = await MilkProduction.create({
        productionDate: productionDateObj,
        animalId: animalId.toUpperCase(), // Ensure uppercase as per schema
        quantity: parseFloat(quantity),
        quality: quality || 'Good',
        recordedBy: req.user._id
      });
  
      res.status(201).json(milkRecord);
    } catch (error) {
      console.error('Error creating milk record:', error); // Add logging
      res.status(500).json({ 
        message: 'Server error creating milk record',
        error: error.message 
      });
    }
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
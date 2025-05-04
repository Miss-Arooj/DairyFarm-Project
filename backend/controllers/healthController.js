const AnimalHealth = require('../models/AnimalHealth');
const asyncHandler = require('express-async-handler');

// @desc    Add health report
// @route   POST /api/health
// @access  Private/Employee
const addHealthReport = asyncHandler(async (req, res) => {
  const { animalId, animalName, date, treatment, cost } = req.body;

  // Validate required fields
  if (!animalId || !animalName || !date || !treatment || !cost) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Validate cost is a positive number
  if (isNaN(cost) || parseFloat(cost) <= 0) {
    res.status(400);
    throw new Error('Cost must be a positive number');
  }

  const healthReport = await AnimalHealth.create({
    animalId,
    animalName,
    date,
    treatment,
    cost: parseFloat(cost),
    treatedBy: req.user._id
  });

  res.status(201).json(healthReport);
});

// @desc    Get health reports
// @route   GET /api/health
// @access  Private
const getHealthReports = asyncHandler(async (req, res) => {
  const { animalId } = req.query;
  let query = {};

  if (animalId) {
    query.animalId = { $regex: animalId, $options: 'i' };
  }

  const healthReports = await AnimalHealth.find(query)
    .sort({ date: -1 })
    .populate('treatedBy', 'name');
  
  res.json(healthReports);
});

module.exports = {
  addHealthReport,
  getHealthReports
};
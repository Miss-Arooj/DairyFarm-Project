const AnimalHealth = require('../models/AnimalHealth');
const asyncHandler = require('express-async-handler');

// @desc    Add health report
// @route   POST /api/health
// @access  Private/Employee
const addHealthReport = asyncHandler(async (req, res) => {
  const { animalId, animalName, date, treatment, cost } = req.body;

  const healthReport = await AnimalHealth.create({
    animalId,
    animalName,
    date,
    treatment,
    cost,
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

  const healthReports = await AnimalHealth.find(query).sort({ date: -1 });
  res.json(healthReports);
});

module.exports = {
  addHealthReport,
  getHealthReports
};
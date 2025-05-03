const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');
const { generateEmployeeId } = require('../utils/generator');

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private/Manager
const addEmployee = asyncHandler(async (req, res) => {
  const { name, gender, contact, salary, username, password } = req.body;

  // Check if employee already exists
  const employeeExists = await Employee.findOne({ 
    $or: [
      { username },
      { contact }
    ] 
  });

  if (employeeExists) {
    res.status(400);
    throw new Error(employeeExists.username === username 
      ? 'Username already exists' 
      : 'Contact number already registered');
  }

  // Generate employee ID
  const employeeId = await generateEmployeeId();

  // Create employee
  const employee = await Employee.create({
    employeeId,
    name,
    gender,
    contact,
    salary,
    username,
    password,
    manager: req.user.id
  });

  // Return employee data without password
  const employeeData = employee.toObject();
  delete employeeData.password;

  res.status(201).json({
    success: true,
    data: employeeData
  });
});

// @desc    Get all employees for current manager
// @route   GET /api/employees
// @access  Private/Manager
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({ manager: req.user.id })
    .select('-password')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: employees.length,
    data: employees
  });
});

module.exports = {
  addEmployee,
  getEmployees
};
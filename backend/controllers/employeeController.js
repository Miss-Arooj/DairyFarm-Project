const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private/Manager
const addEmployee = asyncHandler(async (req, res) => {
  const { employeeId, name, gender, contact, salary, username, password } = req.body;

  // Check if employee already exists
  const employeeExists = await Employee.findOne({ employeeId });
  if (employeeExists) {
    res.status(400);
    throw new Error('Employee already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const employee = await Employee.create({
    employeeId,
    name,
    gender,
    contact,
    salary,
    username,
    password: hashedPassword,
    role: 'employee'
  });

  if (employee) {
    res.status(201).json({
      _id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      gender: employee.gender,
      contact: employee.contact,
      salary: employee.salary,
      username: employee.username,
      role: employee.role
    });
  } else {
    res.status(400);
    throw new Error('Invalid employee data');
  }
});

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Manager
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({}).select('-password');
  res.json(employees);
});

// @desc    Search employees
// @route   GET /api/employees/search
// @access  Private/Manager
const searchEmployees = asyncHandler(async (req, res) => {
  const { term } = req.query;
  
  const employees = await Employee.find({
    $or: [
      { employeeId: { $regex: term, $options: 'i' } },
      { name: { $regex: term, $options: 'i' } }
    ]
  }).select('-password');

  res.json(employees);
});

module.exports = {
  addEmployee,
  getEmployees,
  searchEmployees
};
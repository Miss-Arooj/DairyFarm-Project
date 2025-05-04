const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { generateEmployeeId } = require('../utils/generator');

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private/Manager
const addEmployee = asyncHandler(async (req, res) => {
  const { name, gender, contact, salary, username, password } = req.body;

  // Validate required fields
  if (!name || !gender || !contact || !salary || !username || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // Check if employee already exists
  const employeeExists = await Employee.findOne({ username });
  if (employeeExists) {
    res.status(400);
    throw new Error('Username already exists');
  }

  // Generate employee ID
  const employeeId = await generateEmployeeId();

  // Create employee (password stored in plain text - NOT recommended for production)
  const employee = await Employee.create({
    employeeId,
    name,
    gender,
    contact,
    salary: Number(salary),
    username,
    password, // Storing plain text password
    role: 'employee',
    manager: req.user.id
  });

  if (employee) {
    res.status(201).json({
      _id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      username: employee.username,
      gender: employee.gender,
      contact: employee.contact,
      salary: employee.salary,
      role: employee.role,
      manager: employee.manager
    });
  } else {
    res.status(400);
    throw new Error('Invalid employee data');
  }
});

// @desc    Get all employees for current manager
// @route   GET /api/employees
// @access  Private/Manager
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({ manager: req.user.id })
    .select('-password')
    .sort({ createdAt: -1 });

  res.json(employees);
});

// @desc    Search employees
// @route   GET /api/employees/search
// @access  Private/Manager
const searchEmployees = asyncHandler(async (req, res) => {
  const { term } = req.query;

  if (!term) {
    res.status(400);
    throw new Error('Please provide a search term');
  }

  const employees = await Employee.find({
    manager: req.user.id,
    $or: [
      { employeeId: { $regex: term, $options: 'i' } },
      { name: { $regex: term, $options: 'i' } },
      { contact: { $regex: term, $options: 'i' } }
    ]
  }).select('-password');

  res.json(employees);
});

const resetEmployeePassword = asyncHandler(async (req, res) => {
    const { employeeId, newPassword } = req.body;
    
    // Validate input
    if (!employeeId || !newPassword) {
      res.status(400);
      throw new Error('Please provide employee ID and new password');
    }
  
    const employee = await Employee.findOne({ employeeId });
    
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
  
    // This will trigger the pre-save hook to hash the password
    employee.password = newPassword;
    await employee.save();
    
    res.status(200).json({ 
      success: true,
      message: 'Password reset successfully',
      employeeId: employee.employeeId
    });
  });

module.exports = {
  addEmployee,
  getEmployees,
  searchEmployees,
  resetEmployeePassword
};
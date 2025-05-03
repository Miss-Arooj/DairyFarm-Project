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

  try {
    // Generate unique employee ID
    const employeeId = await generateEmployeeId();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create employee
    const employee = await Employee.create({
      employeeId,
      name,
      gender,
      contact,
      salary: Number(salary),
      username,
      password: hashedPassword,
      role: 'employee',
      manager: req.user.id // Associate with the logged-in manager
    });

    res.status(201).json({
      _id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      gender: employee.gender,
      contact: employee.contact,
      salary: employee.salary,
      username: employee.username,
      role: employee.role,
      manager: employee.manager
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500);
    throw new Error('Server error while creating employee');
  }
});

// @desc    Get all employees for current manager
// @route   GET /api/employees
// @access  Private/Manager
const getEmployees = asyncHandler(async (req, res) => {
  try {
    const employees = await Employee.find({ manager: req.user.id })
      .select('-password -__v')
      .sort({ createdAt: -1 });

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500);
    throw new Error('Server error while fetching employees');
  }
});

// @desc    Search employees
// @route   GET /api/employees/search
// @access  Private/Manager
const searchEmployees = asyncHandler(async (req, res) => {
  const { term } = req.query;

  if (!term || term.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a search term'
    });
  }

  try {
    const employees = await Employee.find({
      manager: req.user.id,
      $or: [
        { employeeId: { $regex: term, $options: 'i' } },
        { name: { $regex: term, $options: 'i' } },
        { contact: { $regex: term, $options: 'i' } }
      ]
    }).select('-password -__v');

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error searching employees:', error);
    res.status(500);
    throw new Error('Server error while searching employees');
  }
});

module.exports = {
  addEmployee,
  getEmployees,
  searchEmployees
};
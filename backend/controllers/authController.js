const User = require('../models/User');
const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register manager
// @route   POST /api/auth/register
// @access  Public
const registerManager = asyncHandler(async (req, res) => {
  const { username, fullName, password, contact } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    fullName,
    password: hashedPassword,
    contact,
    role: 'manager'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      contact: user.contact,
      role: user.role,
      token: generateToken(user._id, 'manager')
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate manager
// @route   POST /api/auth/login
// @access  Public
const loginManager = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check for user
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      contact: user.contact,
      role: user.role,
      token: generateToken(user._id, 'manager')
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Authenticate employee
// @route   POST /api/auth/employee-login
// @access  Public
const loginEmployee = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.status(400);
      throw new Error('Please provide both username and password');
    }
  
    const employee = await Employee.findOne({ username }).select('+password');
    
    if (!employee) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  
    // Simple password comparison (for development)
    const isPasswordValid = password === employee.password;
    
    if (!isPasswordValid) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  
    const token = generateToken(employee._id, 'employee');
  
    res.status(200).json({
      _id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      username: employee.username,
      role: employee.role,
      token
    });
  });

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  registerManager,
  loginManager,
  loginEmployee
};
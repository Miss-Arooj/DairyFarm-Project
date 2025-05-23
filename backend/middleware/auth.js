const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Employee = require('../models/Employee');

// General protection middleware (for both employees and managers)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user/employee from the token
      let user;
      if (decoded.role === 'manager') {
        user = await User.findById(decoded.id).select('-password');
      } else if (decoded.role === 'employee') {
        user = await Employee.findById(decoded.id).select('-password');
      }

      if (!user) {
        res.status(401);
        throw new Error('Not authorized');
      }

      req.user = user;
      req.user.role = decoded.role;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Manager-only middleware
const managerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as manager');
  }
};

// Employee-only middleware
const employeeOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employee') {
    req.employee = req.user; // Alias as req.employee for clarity in employee routes
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as employee');
  }
};

module.exports = { 
  protect, 
  managerOnly,
  employeeOnly 
};
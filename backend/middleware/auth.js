const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Employee = require('../models/Employee');

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
      if (decoded.role === 'manager') {
        req.user = await User.findById(decoded.id).select('-password');
      } else if (decoded.role === 'employee') {
        req.user = await Employee.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
      }

      req.user.role = decoded.role;
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const managerOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as manager');
  }
});

module.exports = { protect, managerOnly };
const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginEmployee = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const employee = await Employee.findOne({ username });
  if (!employee) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    _id: employee._id,
    name: employee.name,
    username: employee.username,
    token: generateToken(employee._id)
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = { loginEmployee };
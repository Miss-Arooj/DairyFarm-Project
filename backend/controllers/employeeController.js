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
      manager: req.user.id
    });

    // Return employee data without password
    const employeeData = employee.toObject();
    delete employeeData.password;

    res.status(201).json({
      success: true,
      data: employeeData
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500);
    throw new Error('Server error while creating employee');
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
  
      res.status(200).json({
        success: true,
        count: employees.length,
        data: employees
      });
    } catch (error) {
      console.error('Error searching employees:', error);
      res.status(500);
      throw new Error('Server error while searching employees');
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

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500);
    throw new Error('Server error while fetching employees');
  }
});

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private/Manager
const getEmployee = asyncHandler(async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      manager: req.user.id
    }).select('-password -__v');

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500);
    throw new Error('Server error while fetching employee');
  }
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Manager
const updateEmployee = asyncHandler(async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      manager: req.user.id
    });

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    const { name, gender, contact, salary, username } = req.body;

    // Update fields if provided
    if (name) employee.name = name;
    if (gender) employee.gender = gender;
    if (contact) employee.contact = contact;
    if (salary) employee.salary = salary;
    
    if (username) {
      const usernameExists = await Employee.findOne({ 
        username,
        _id: { $ne: req.params.id } 
      });
      if (usernameExists) {
        res.status(400);
        throw new Error('Username already in use');
      }
      employee.username = username;
    }

    const updatedEmployee = await employee.save();
    const employeeData = updatedEmployee.toObject();
    delete employeeData.password;

    res.status(200).json({
      success: true,
      data: employeeData
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500);
    throw new Error('Server error while updating employee');
  }
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Manager
const deleteEmployee = asyncHandler(async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      manager: req.user.id
    });

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Employee deleted successfully',
        employeeId: employee.employeeId
      }
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500);
    throw new Error('Server error while deleting employee');
  }
});

module.exports = {
  addEmployee,
  searchEmployees,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
};
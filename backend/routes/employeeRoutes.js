const express = require('express');
const router = express.Router();
const { protect, managerOnly } = require('../middleware/auth');
const {
  addEmployee,
  getEmployees,
  searchEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// POST /api/employees - Add new employee
router.post('/', protect, managerOnly, addEmployee);

// GET /api/employees - Get all employees
router.get('/', protect, managerOnly, getEmployees);

// GET /api/employees/search - Search employees
router.get('/search', protect, managerOnly, searchEmployees);

// GET /api/employees/:id - Get single employee
router.get('/:id', protect, managerOnly, getEmployee);

// PUT /api/employees/:id - Update employee
router.put('/:id', protect, managerOnly, updateEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', protect, managerOnly, deleteEmployee);

module.exports = router;
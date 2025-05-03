const express = require('express');
const router = express.Router();
const { protect, managerOnly } = require('../middleware/auth');
const {
  addEmployee,
  getEmployees,
  getEmployee,
  searchEmployees,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// Define routes with proper handlers
router.route('/')
  .post(protect, managerOnly, addEmployee)
  .get(protect, managerOnly, getEmployees);

router.route('/search')
  .get(protect, managerOnly, searchEmployees);

router.route('/:id')
  .get(protect, managerOnly, getEmployee)
  .put(protect, managerOnly, updateEmployee)
  .delete(protect, managerOnly, deleteEmployee);

module.exports = router;
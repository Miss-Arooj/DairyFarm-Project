const express = require('express');
const router = express.Router();
const { protect, managerOnly } = require('../middleware/auth');
const {
  addEmployee,
  getEmployees,
  searchEmployees
} = require('../controllers/employeeController');

router.route('/')
  .post(protect, managerOnly, addEmployee)
  .get(protect, managerOnly, getEmployees);

router.route('/search')
  .get(protect, managerOnly, searchEmployees);

module.exports = router;
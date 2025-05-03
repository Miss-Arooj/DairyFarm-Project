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

// Protect all employee routes
router.use(protect);
router.use(managerOnly);

// Employee routes
router.route('/')
  .post(addEmployee)
  .get(getEmployees);

router.route('/search')
  .get(searchEmployees);

router.route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
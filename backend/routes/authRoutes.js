const express = require('express');
const router = express.Router();
const {
  registerManager,
  loginManager
} = require('../controllers/authController');
const { loginEmployee } = require('../controllers/employeeAuthController');

router.post('/employee-login', loginEmployee);
router.post('/register', registerManager);
router.post('/login', loginManager);

module.exports = router;
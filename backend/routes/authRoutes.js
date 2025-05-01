const express = require('express');
const router = express.Router();
const {
  registerManager,
  loginManager,
  loginEmployee
} = require('../controllers/authController');

router.post('/register', registerManager);
router.post('/login', loginManager);
router.post('/employee-login', loginEmployee);

module.exports = router;
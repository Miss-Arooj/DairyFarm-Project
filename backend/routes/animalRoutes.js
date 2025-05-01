const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addAnimal,
  getAnimals,
  searchAnimals
} = require('../controllers/animalController');

router.route('/')
  .post(protect, addAnimal)
  .get(protect, getAnimals);

router.route('/search')
  .get(protect, searchAnimals);

module.exports = router;
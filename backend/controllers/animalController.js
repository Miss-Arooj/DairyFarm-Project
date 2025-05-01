const Animal = require('../models/Animal');
const asyncHandler = require('express-async-handler');

// @desc    Add new animal
// @route   POST /api/animals
// @access  Private/Employee
const addAnimal = asyncHandler(async (req, res) => {
  const { animalId, name, weight, gender, type, age } = req.body;

  const animalExists = await Animal.findOne({ animalId });
  if (animalExists) {
    res.status(400);
    throw new Error('Animal already exists');
  }

  const animal = await Animal.create({
    animalId,
    name,
    weight,
    gender,
    type,
    age
  });

  res.status(201).json(animal);
});

// @desc    Get all animals
// @route   GET /api/animals
// @access  Private
const getAnimals = asyncHandler(async (req, res) => {
  const animals = await Animal.find({}).sort({ animalId: 1 });
  res.json(animals);
});

// @desc    Search animals
// @route   GET /api/animals/search
// @access  Private
const searchAnimals = asyncHandler(async (req, res) => {
  const { term } = req.query;
  
  const animals = await Animal.find({
    $or: [
      { animalId: { $regex: term, $options: 'i' } },
      { name: { $regex: term, $options: 'i' } },
      { type: { $regex: term, $options: 'i' } }
    ]
  });

  res.json(animals);
});

module.exports = {
  addAnimal,
  getAnimals,
  searchAnimals
};
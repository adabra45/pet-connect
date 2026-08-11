const express = require('express');
const router = express.Router();
const {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPets);
router.get('/:id', getPetById);

// Protected routes
router.post('/', protect, createPet);
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);

module.exports = router;
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
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getAllPets);
router.get('/:id', getPetById);

// Protected routes
router.post('/', protect, upload.single('image'), createPet);
router.put('/:id', protect, upload.single('image'), updatePet);
router.delete('/:id', protect, deletePet);

module.exports = router;
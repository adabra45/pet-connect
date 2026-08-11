const Pet = require('../models/Pet');

// CREATE a new pet
const createPet = async (req, res) => {
  try {
    const { name, breed, age, gender, category, description, location, images } = req.body;

    const pet = await Pet.create({
      name,
      breed,
      age,
      gender,
      category,
      description,
      location,
      images: images || [],
      listedBy: req.user.id, // We will get this from authentication middleware later
    });

    res.status(201).json({
      message: 'Pet listed successfully',
      pet,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all pets (with search & filters)
const getAllPets = async (req, res) => {
  try {
    const { category, breed, location, status } = req.query;

    // Build filter object
    let filter = {};

    if (category) filter.category = category;
    if (breed) filter.breed = { $regex: breed, $options: 'i' }; // case-insensitive search
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (status) filter.status = status;

    const pets = await Pet.find(filter)
      .populate('listedBy', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: pets.length,
      pets,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate(
      'listedBy',
      'name email phone location'
    );

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE pet
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Only the user who listed the pet can update it
    if (pet.listedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this pet' });
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Pet updated successfully',
      pet: updatedPet,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE pet
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.listedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this pet' });
    }

    await pet.deleteOne();

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
};
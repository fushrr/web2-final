const Pet = require("../models/Pet");

const createPet = async (req, res, next) => {
  try {
    const pet = await Pet.create({ ...req.body, owner: req.user.id });
    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
};

const getMyPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    next(err);
  }
};

const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (err) {
    next(err);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPet, getMyPets, getPetById, updatePet, deletePet };

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createPetSchema, updatePetSchema } = require("../validators/pet.validators");

const {
  createPet,
  getMyPets,
  getPetById,
  updatePet,
  deletePet,
} = require("../controllers/pet.controller");

router.post("/", auth, validate(createPetSchema), createPet);
router.get("/", auth, getMyPets);
router.get("/:id", auth, getPetById);
router.put("/:id", auth, validate(updatePetSchema), updatePet);
router.delete("/:id", auth, deletePet);

module.exports = router;

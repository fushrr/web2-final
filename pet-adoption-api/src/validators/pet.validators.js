const Joi = require("joi");

const createPetSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  species: Joi.string().valid("dog", "cat", "other").required(),
  breed: Joi.string().max(50).allow("", null),
  age: Joi.number().min(0).allow(null),
  gender: Joi.string().valid("male", "female", "unknown").optional(),
  description: Joi.string().max(500).allow("", null),
  status: Joi.string().valid("available", "pending", "adopted").optional(),
});

const updatePetSchema = createPetSchema.fork(["name", "species"], (field) => field.optional());

module.exports = { createPetSchema, updatePetSchema };

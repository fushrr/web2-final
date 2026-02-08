const Joi = require("joi");

const updateProfileSchema = Joi.object({
  username: Joi.string().min(2).max(30).trim().optional(),
  email: Joi.string().email().lowercase().trim().optional(),
}).min(1); 

module.exports = { updateProfileSchema };

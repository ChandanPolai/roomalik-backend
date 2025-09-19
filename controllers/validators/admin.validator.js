const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone: Joi.string().min(10).required(),
  role: Joi.string().valid('admin', 'superadmin').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().min(10).optional(),
  avatar: Joi.string().uri().optional(),
  role: Joi.string().valid('admin', 'superadmin').optional(),
  permissions: Joi.array().items(Joi.string()).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema
};
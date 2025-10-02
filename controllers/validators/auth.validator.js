// validators/auth.validator.js
const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
  }),
  phone: Joi.string().min(10).required().messages({
    'string.min': 'Phone number must be at least 10 digits',
    'any.required': 'Phone number is required',
  }),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    pincode: Joi.string().optional(),
  }).optional(),
  role: Joi.string().valid('admin', 'superadmin').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().min(10).optional().messages({
    'string.min': 'Phone number must be at least 10 digits',
  }),
  avatar: Joi.string().uri().optional().messages({
    'string.uri': 'Avatar must be a valid URL',
  }),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    pincode: Joi.string().optional(),
  }).optional(),
  role: Joi.string().valid('admin', 'superadmin').optional(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  resetPasswordSchema,
};
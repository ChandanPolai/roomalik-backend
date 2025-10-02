// validators/contact.validator.js
const Joi = require('joi');

const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Contact name is required',
  }),
  type: Joi.string().required().messages({
    'any.required': 'Contact type is required',
  }),
  phone: Joi.string().min(10).required().messages({
    'string.min': 'Phone number must be at least 10 digits',
    'any.required': 'Phone number is required',
  }),
});

const updateContactSchema = Joi.object({
  name: Joi.string().optional(),
  type: Joi.string().optional(),
  phone: Joi.string().min(10).optional(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
};
// validators/room.validator.js
const Joi = require('joi');

const createRoomSchema = Joi.object({
  number: Joi.string().required().messages({
    'any.required': 'Room number is required',
  }),
  size: Joi.number().required().messages({
    'any.required': 'Room size is required',
    'number.base': 'Room size must be a number',
  }),
  type: Joi.string().required().messages({
    'any.required': 'Room type is required',
  }),
  rent: Joi.number().required().messages({
    'any.required': 'Rent amount is required',
    'number.base': 'Rent amount must be a number',
  }),
  deposit: Joi.number().required().messages({
    'any.required': 'Deposit amount is required',
    'number.base': 'Deposit amount must be a number',
  }),
  furnished: Joi.string()
    .valid('furnished', 'semi-furnished', 'unfurnished')
    .required()
    .messages({
      'any.required': 'Furnished status is required',
      'any.only': 'Furnished must be one of: furnished, semi-furnished, unfurnished',
    }),
  floor: Joi.number().optional(),
  facing: Joi.string().optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  status: Joi.string()
    .valid('available', 'occupied', 'maintenance', 'reserved')
    .optional(),
  plotId: Joi.string().required().messages({
    'any.required': 'Plot ID is required',
  }),
});

const updateRoomSchema = Joi.object({
  number: Joi.string().optional(),
  size: Joi.number().optional(),
  type: Joi.string().optional(),
  rent: Joi.number().optional(),
  deposit: Joi.number().optional(),
  furnished: Joi.string()
    .valid('furnished', 'semi-furnished', 'unfurnished')
    .optional(),
  floor: Joi.number().optional(),
  facing: Joi.string().optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  status: Joi.string()
    .valid('available', 'occupied', 'maintenance', 'reserved')
    .optional(),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
};
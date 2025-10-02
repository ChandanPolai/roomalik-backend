// validators/electricityBill.validator.js
const Joi = require('joi');

const createBillSchema = Joi.object({
  roomId: Joi.string().required().messages({
    'any.required': 'Room ID is required',
  }),
  month: Joi.string().required().messages({
    'any.required': 'Month is required',
  }),
  units: Joi.number().required().messages({
    'any.required': 'Units consumed is required',
    'number.base': 'Units must be a number',
  }),
  rate: Joi.number().required().messages({
    'any.required': 'Rate per unit is required',
    'number.base': 'Rate must be a number',
  }),
  amount: Joi.number().optional(), // Auto-calculated
  paid: Joi.boolean().optional(),
});

const updateBillSchema = Joi.object({
  units: Joi.number().optional(),
  rate: Joi.number().optional(),
  amount: Joi.number().optional(),
  paid: Joi.boolean().optional(),
});

module.exports = {
  createBillSchema,
  updateBillSchema,
};
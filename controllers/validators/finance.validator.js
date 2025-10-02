// validators/finance.validator.js
const Joi = require('joi');

const createFinanceSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.required': 'Finance type is required',
    'any.only': 'Type must be either income or expense',
  }),
  amount: Joi.number().required().messages({
    'any.required': 'Amount is required',
    'number.base': 'Amount must be a number',
  }),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  category: Joi.string().required().messages({
    'any.required': 'Category is required',
  }),
  plotId: Joi.string().required().messages({
    'any.required': 'Plot ID is required',
  }),
  roomId: Joi.string().optional(),
  tenantId: Joi.string().optional(),
});

const updateFinanceSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').optional(),
  amount: Joi.number().optional(),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  category: Joi.string().optional(),
  roomId: Joi.string().optional(),
  tenantId: Joi.string().optional(),
});

module.exports = {
  createFinanceSchema,
  updateFinanceSchema,
};
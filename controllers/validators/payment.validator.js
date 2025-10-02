// validators/payment.validator.js
const Joi = require('joi');

const createPaymentSchema = Joi.object({
  tenantId: Joi.string().required().messages({
    'any.required': 'Tenant ID is required',
  }),
  amount: Joi.number().required().messages({
    'any.required': 'Amount is required',
    'number.base': 'Amount must be a number',
  }),
  date: Joi.date().optional(),
  method: Joi.string()
    .valid('cash', 'online', 'cheque')
    .required()
    .messages({
      'any.required': 'Payment method is required',
      'any.only': 'Method must be one of: cash, online, cheque',
    }),
  receipt: Joi.string().uri().optional(),
  status: Joi.string()
    .valid('pending', 'completed', 'failed')
    .optional(),
});

const updatePaymentSchema = Joi.object({
  amount: Joi.number().optional(),
  date: Joi.date().optional(),
  method: Joi.string()
    .valid('cash', 'online', 'cheque')
    .optional(),
  receipt: Joi.string().uri().optional(),
  status: Joi.string()
    .valid('pending', 'completed', 'failed')
    .optional(),
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};
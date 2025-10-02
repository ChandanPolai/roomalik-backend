// validators/plot.validator.js
const Joi = require('joi');

const createPlotSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Plot name is required',
  }),
  address: Joi.object({
    street: Joi.string().required().messages({
      'any.required': 'Street is required',
    }),
    city: Joi.string().required().messages({
      'any.required': 'City is required',
    }),
    state: Joi.string().required().messages({
      'any.required': 'State is required',
    }),
    country: Joi.string().required().messages({
      'any.required': 'Country is required',
    }),
    pincode: Joi.string().required().messages({
      'any.required': 'Pincode is required',
    }),
  }).required(),
  totalArea: Joi.number().required().messages({
    'any.required': 'Total area is required',
    'number.base': 'Total area must be a number',
  }),
  constructionYear: Joi.number().optional(),
  facilities: Joi.array().items(Joi.string()).optional(),
  location: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
  }).optional(),
});

const updatePlotSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    pincode: Joi.string().optional(),
  }).optional(),
  totalArea: Joi.number().optional(),
  constructionYear: Joi.number().optional(),
  facilities: Joi.array().items(Joi.string()).optional(),
  location: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
  }).optional(),
});

module.exports = {
  createPlotSchema,
  updatePlotSchema,
};
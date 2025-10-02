// validators/tenant.validator.js
const Joi = require('joi');

const createTenantSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Tenant name is required',
  }),
  mobile: Joi.string().min(10).required().messages({
    'string.min': 'Mobile number must be at least 10 digits',
    'any.required': 'Mobile number is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  addresses: Joi.object({
    permanent: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().optional(),
    }).optional(),
    current: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().optional(),
    }).optional(),
  }).optional(),
  emergency: Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Emergency contact name is required',
    }),
    relation: Joi.string().required().messages({
      'any.required': 'Emergency contact relation is required',
    }),
    contact: Joi.string().min(10).required().messages({
      'string.min': 'Emergency contact number must be at least 10 digits',
      'any.required': 'Emergency contact number is required',
    }),
  }).required(),
  profession: Joi.object({
    occupation: Joi.string().optional(),
    officeAddress: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().optional(),
    }).optional(),
  }).optional(),
  ids: Joi.object({
    aadhar: Joi.object({
      front: Joi.string().uri().optional(),
      back: Joi.string().uri().optional(),
    }).optional(),
    pan: Joi.string().uri().optional(),
    photo: Joi.string().uri().optional(),
    others: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          type: Joi.string().required(),
        })
      )
      .optional(),
  }).optional(),
  family: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        relation: Joi.string().required(),
        photo: Joi.string().uri().optional(),
        contact: Joi.string().min(10).optional(),
      })
    )
    .optional(),
  agreement: Joi.object({
    start: Joi.date().required().messages({
      'any.required': 'Agreement start date is required',
    }),
    end: Joi.date().required().messages({
      'any.required': 'Agreement end date is required',
    }),
    rent: Joi.number().required().messages({
      'any.required': 'Rent amount is required',
    }),
    deposit: Joi.number().required().messages({
      'any.required': 'Deposit amount is required',
    }),
    document: Joi.string().uri().optional(),
    termsAccepted: Joi.boolean().optional(),
  }).required(),
  finances: Joi.object({
    rent: Joi.number().required().messages({
      'any.required': 'Rent amount is required',
    }),
    billType: Joi.string().valid('included', 'separate').optional(),
    additionalCharges: Joi.array()
      .items(
        Joi.object({
          type: Joi.string().required(),
          amount: Joi.number().required(),
        })
      )
      .optional(),
    paymentMode: Joi.string()
      .valid('cash', 'online', 'cheque')
      .optional(),
  }).required(),
  roomId: Joi.string().required().messages({
    'any.required': 'Room ID is required',
  }),
  plotId: Joi.string().required().messages({
    'any.required': 'Plot ID is required',
  }),
});

const updateTenantSchema = Joi.object({
  name: Joi.string().optional(),
  mobile: Joi.string().min(10).optional(),
  email: Joi.string().email().optional(),
  addresses: Joi.object({
    permanent: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().optional(),
    }).optional(),
    current: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().optional(),
    }).optional(),
  }).optional(),
  emergency: Joi.object({
    name: Joi.string().optional(),
    relation: Joi.string().optional(),
    contact: Joi.string().min(10).optional(),
  }).optional(),
  profession: Joi.object({
    occupation: Joi.string().optional(),
    officeAddress: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().optional(),
    }).optional(),
  }).optional(),
  ids: Joi.object({
    aadhar: Joi.object({
      front: Joi.string().uri().optional(),
      back: Joi.string().uri().optional(),
    }).optional(),
    pan: Joi.string().uri().optional(),
    photo: Joi.string().uri().optional(),
    others: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          type: Joi.string().required(),
        })
      )
      .optional(),
  }).optional(),
  family: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        relation: Joi.string().required(),
        photo: Joi.string().uri().optional(),
        contact: Joi.string().min(10).optional(),
      })
    )
    .optional(),
  agreement: Joi.object({
    start: Joi.date().optional(),
    end: Joi.date().optional(),
    rent: Joi.number().optional(),
    deposit: Joi.number().optional(),
    document: Joi.string().uri().optional(),
    termsAccepted: Joi.boolean().optional(),
  }).optional(),
  finances: Joi.object({
    rent: Joi.number().optional(),
    billType: Joi.string().valid('included', 'separate').optional(),
    additionalCharges: Joi.array()
      .items(
        Joi.object({
          type: Joi.string().required(),
          amount: Joi.number().required(),
        })
      )
      .optional(),
    paymentMode: Joi.string()
      .valid('cash', 'online', 'cheque')
      .optional(),
  }).optional(),
});

module.exports = {
  createTenantSchema,
  updateTenantSchema,
};
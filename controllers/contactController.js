// controllers/contactController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createContactSchema, updateContactSchema } = require('./validators/index');

// Create Contact
const createContact = asyncHandler(async (req, res) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { name, type, phone } = req.body;
  const contact = new model.Contact({
    name,
    type,
    phone,
    ownerId: req.admin._id,
  });

  await contact.save();
  return sendResponse(res, HTTP_STATUS.CREATED, contact, 'Contact created successfully');
});

// Get All Contacts
const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await model.Contact.find({ ownerId: req.admin._id });
  return sendResponse(res, HTTP_STATUS.OK, contacts, 'Contacts retrieved successfully');
});

// Get Contact by ID
const getContactById = asyncHandler(async (req, res) => {
  const contact = await model.Contact.findById(req.params.id);
  if (!contact || contact.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Contact not found or unauthorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, contact, 'Contact retrieved successfully');
});

// Update Contact
const updateContact = asyncHandler(async (req, res) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const contact = await model.Contact.findById(req.params.id);
  if (!contact || contact.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Contact not found or unauthorized');
  }

  Object.assign(contact, req.body);
  await contact.save();
  return sendResponse(res, HTTP_STATUS.OK, contact, 'Contact updated successfully');
});

// Delete Contact
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await model.Contact.findById(req.params.id);
  if (!contact || contact.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Contact not found or unauthorized');
  }

  await contact.remove();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Contact deleted successfully');
});

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
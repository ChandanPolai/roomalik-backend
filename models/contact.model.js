// models/contact.model.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String, // e.g., plumber, electrician
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
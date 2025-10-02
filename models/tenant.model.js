// models/tenant.model.js
const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  addresses: {
    permanent: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    current: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
  },
  emergency: {
    name: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
  },
  profession: {
    occupation: { type: String, trim: true },
    officeAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
  },
  ids: {
    aadhar: {
      front: { type: String }, // Image URL
      back: { type: String }, // Image URL
    },
    pan: { type: String }, // Image URL
    photo: { type: String }, // Passport-size photo URL
    others: [{ url: { type: String }, type: { type: String } }],
  },
  family: [{
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    relation: { type: String, required: true, trim: true },
    photo: { type: String }, // Image URL
    contact: { type: String, trim: true },
  }],
  agreement: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    document: { type: String }, // PDF/Image URL
    termsAccepted: { type: Boolean, default: false },
  },
  finances: {
    rent: { type: Number, required: true },
    billType: {
      type: String,
      enum: ['included', 'separate'],
      default: 'separate',
    },
    additionalCharges: [{
      type: String, // e.g., parking, maintenance
      amount: Number,
    }],
    paymentMode: {
      type: String,
      enum: ['cash', 'online', 'cheque'],
      default: 'cash',
    },
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  plotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plot',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tenant = mongoose.model('Tenant', tenantSchema);
module.exports = Tenant;
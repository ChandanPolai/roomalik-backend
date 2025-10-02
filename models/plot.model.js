// models/plot.model.js
const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  totalArea: {
    type: Number, // In square feet
    required: true,
  },
  constructionYear: {
    type: Number,
  },
  images: [{
    url: { type: String, required: true }, // Cloudinary/AWS S3 URL
    caption: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  }],
  facilities: [{
    type: String, // e.g., parking, water supply, electricity backup
    trim: true,
  }],
  location: {
    lat: { type: Number },
    lng: { type: Number },
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

const Plot = mongoose.model('Plot', plotSchema);
module.exports = Plot;
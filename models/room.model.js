// models/room.model.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: Number, // In square feet
    required: true,
  },
  type: {
    type: String, // e.g., 1BHK, 2BHK, Single
    required: true,
    trim: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  furnished: {
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished'],
    required: true,
  },
  floor: {
    type: Number,
  },
  facing: {
    type: String, // e.g., east, west
    trim: true,
  },
  images: [{
    url: { type: String, required: true }, // Cloudinary/AWS S3 URL
    caption: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  }],
  amenities: [{
    type: String, // e.g., AC, WiFi, TV
    trim: true,
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available',
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

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
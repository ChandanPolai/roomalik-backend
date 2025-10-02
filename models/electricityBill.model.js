// models/electricityBill.model.js
const mongoose = require('mongoose');

const electricityBillSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  month: {
    type: String, // e.g., "2025-10"
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number, // Per unit rate
    required: true,
  },
  amount: {
    type: Number, // Auto-calculated: units * rate
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ElectricityBill = mongoose.model('ElectricityBill', electricityBillSchema);
module.exports = ElectricityBill;
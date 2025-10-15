// models/electricityReading.model.js
const mongoose = require('mongoose');

const electricityReadingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  plotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot', required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  
  // Reading details
  currentReading: { type: Number, required: true },
  previousReading: { type: Number, required: true },
  unitsUsed: { type: Number, required: true },
  ratePerUnit: { type: Number, required: true, default: 10 },
  totalAmount: { type: Number, required: true },
  
  // Dates
  readingDate: { type: Date, default: Date.now },
  billingDate: { type: Date },
  
  // Status
  isAddedToRent: { type: Boolean, default: false },
  rentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rent' },
  
  createdAt: { type: Date, default: Date.now },
});

// Auto calculate units and amount
electricityReadingSchema.pre('save', function(next) {
  this.unitsUsed = this.currentReading - this.previousReading;
  this.totalAmount = this.unitsUsed * this.ratePerUnit;
  next();
});

module.exports = mongoose.model('ElectricityReading', electricityReadingSchema);
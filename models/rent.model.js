// models/rent.model.js
const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  plotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot', required: true },
  
  // Rent dates
  dueDate: { type: Date, required: true },
  generatedDate: { type: Date, default: Date.now },
  
  // Amounts
  rentAmount: { type: Number, required: true },
  electricityAmount: { type: Number, default: 0 },
  previousDues: { type: Number, default: 0 },
  otherCharges: [{ description: String, amount: Number }],
  
  // Auto calculated
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  
  status: { 
    type: String, 
    enum: ['pending', 'partial', 'paid', 'overdue'], 
    default: 'pending' 
  },
  
  paymentDate: { type: Date },
  paymentMethod: { type: String, enum: ['cash', 'online', 'cheque', ''] },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Auto calculate amounts
rentSchema.pre('save', function(next) {
  const othersTotal = this.otherCharges.reduce((sum, charge) => sum + charge.amount, 0);
  this.totalAmount = this.rentAmount + this.electricityAmount + this.previousDues + othersTotal;
  this.pendingAmount = this.totalAmount - this.paidAmount;
  
  // Auto status update
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'paid';
  } else if (this.paidAmount > 0) {
    this.status = 'partial';
  } else if (new Date() > this.dueDate) {
    this.status = 'overdue';
  } else {
    this.status = 'pending';
  }
  next();
});

module.exports = mongoose.model('Rent', rentSchema);
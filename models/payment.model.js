const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
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
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String, // Format: "YYYY-MM" e.g., "2024-01"
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'online', 'cheque'],
  },
  paymentProof: {
    type: String, // Image URL
  },
  remarks: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

paymentSchema.index({ tenantId: 1, month: 1 }, { unique: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;


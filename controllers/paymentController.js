// controllers/paymentController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createPaymentSchema, updatePaymentSchema } = require('../validators/index');

// Create Payment
const createPayment = asyncHandler(async (req, res) => {
  const { error } = createPaymentSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { tenantId, amount, date, method, receipt, status } = req.body;
  const tenant = await model.Tenant.findById(tenantId).populate('roomId');
  if (!tenant || tenant.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid or unauthorized tenant');
  }

  const payment = new model.Payment({
    tenantId,
    amount,
    date,
    method,
    receipt, // Placeholder: Generate receipt PDF and upload to Cloudinary
    status,
  });

  await payment.save();

  // Create notification
  const notification = new model.Notification({
    type: 'payment_received',
    message: `Payment of ${amount} received from tenant ${tenant.name}`,
    userId: req.admin._id,
  });
  await notification.save();

  return sendResponse(res, HTTP_STATUS.CREATED, payment, 'Payment recorded successfully');
});

// Get All Payments
const getAllPayments = asyncHandler(async (req, res) => {
  const { tenantId, status } = req.query;
  const query = { tenantId: { $in: await model.Tenant.find({ plotId: { $in: await model.Plot.find({ ownerId: req.admin._id }).distinct('_id') } }).distinct('_id') } };
  if (tenantId) query.tenantId = tenantId;
  if (status) query.status = status;

  const payments = await model.Payment.find(query).populate('tenantId');
  return sendResponse(res, HTTP_STATUS.OK, payments, 'Payments retrieved successfully');
});

// Get Payment by ID
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await model.Payment.findById(req.params.id).populate('tenantId');
  if (!payment) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Payment not found');
  }
  if (payment.tenantId.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, payment, 'Payment retrieved successfully');
});

// Update Payment
const updatePayment = asyncHandler(async (req, res) => {
  const { error } = updatePaymentSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const payment = await model.Payment.findById(req.params.id).populate('tenantId');
  if (!payment) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Payment not found');
  }
  if (payment.tenantId.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  Object.assign(payment, req.body);
  await payment.save();
  return sendResponse(res, HTTP_STATUS.OK, payment, 'Payment updated successfully');
});

// Delete Payment
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await model.Payment.findById(req.params.id).populate('tenantId');
  if (!payment) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Payment not found');
  }
  if (payment.tenantId.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  await payment.remove();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Payment deleted successfully');
});

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
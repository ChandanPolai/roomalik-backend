// controllers/electricityBillController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createBillSchema, updateBillSchema } = require('./validators/index');

// Create Electricity Bill
const createBill = asyncHandler(async (req, res) => {
  const { error } = createBillSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { roomId, month, units, rate, paid } = req.body;
  const room = await model.Room.findById(roomId).populate('plotId');
  if (!room || room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid or unauthorized room');
  }

  const amount = units * rate;
  const bill = new model.ElectricityBill({
    roomId,
    month,
    units,
    rate,
    amount,
    paid,
  });

  await bill.save();
  return sendResponse(res, HTTP_STATUS.CREATED, bill, 'Electricity bill created successfully');
});

// Get All Bills
const getAllBills = asyncHandler(async (req, res) => {
  const { roomId, month, paid } = req.query;
  const query = { roomId: { $in: await model.Room.find({ plotId: { $in: await model.Plot.find({ ownerId: req.admin._id }).distinct('_id') } }).distinct('_id') } };
  if (roomId) query.roomId = roomId;
  if (month) query.month = month;
  if (paid !== undefined) query.paid = paid === 'true';

  const bills = await model.ElectricityBill.find(query).populate('roomId');
  return sendResponse(res, HTTP_STATUS.OK, bills, 'Bills retrieved successfully');
});

// Get Bill by ID
const getBillById = asyncHandler(async (req, res) => {
  const bill = await model.ElectricityBill.findById(req.params.id).populate('roomId');
  if (!bill) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Bill not found');
  }
  if (bill.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, bill, 'Bill retrieved successfully');
});

// Update Bill
const updateBill = asyncHandler(async (req, res) => {
  const { error } = updateBillSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const bill = await model.ElectricityBill.findById(req.params.id).populate('roomId');
  if (!bill) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Bill not found');
  }
  if (bill.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  if (req.body.units && req.body.rate) {
    req.body.amount = req.body.units * req.body.rate;
  } else if (req.body.units && !req.body.rate) {
    req.body.amount = req.body.units * bill.rate;
  } else if (req.body.rate && !req.body.units) {
    req.body.amount = bill.units * req.body.rate;
  }

  Object.assign(bill, req.body);
  await bill.save();
  return sendResponse(res, HTTP_STATUS.OK, bill, 'Bill updated successfully');
});

// Delete Bill
const deleteBill = asyncHandler(async (req, res) => {
  const bill = await model.ElectricityBill.findById(req.params.id).populate('roomId');
  if (!bill) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Bill not found');
  }
  if (bill.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  await bill.remove();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Bill deleted successfully');
});

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
};
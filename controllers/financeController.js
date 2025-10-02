// controllers/financeController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createFinanceSchema, updateFinanceSchema } = require('../validators/index');

// Create Finance Record
const createFinance = asyncHandler(async (req, res) => {
  const { error } = createFinanceSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { type, amount, description, date, category, plotId, roomId, tenantId } = req.body;
  const plot = await model.Plot.findById(plotId);
  if (!plot || plot.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid or unauthorized plot');
  }

  const finance = new model.Finance({
    type,
    amount,
    description,
    date,
    category,
    plotId,
    roomId,
    tenantId,
  });

  await finance.save();
  return sendResponse(res, HTTP_STATUS.CREATED, finance, 'Finance record created successfully');
});

// Get All Finances
const getAllFinances = asyncHandler(async (req, res) => {
  const { type, plotId, roomId, tenantId } = req.query;
  const query = { plotId: { $in: await model.Plot.find({ ownerId: req.admin._id }).distinct('_id') } };
  if (type) query.type = type;
  if (plotId) query.plotId = plotId;
  if (roomId) query.roomId = roomId;
  if (tenantId) query.tenantId = tenantId;

  const finances = await model.Finance.find(query).populate('plotId roomId tenantId');
  return sendResponse(res, HTTP_STATUS.OK, finances, 'Finance records retrieved successfully');
});

// Get Finance by ID
const getFinanceById = asyncHandler(async (req, res) => {
  const finance = await model.Finance.findById(req.params.id).populate('plotId');
  if (!finance) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Finance record not found');
  }
  if (finance.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, finance, 'Finance record retrieved successfully');
});

// Update Finance
const updateFinance = asyncHandler(async (req, res) => {
  const { error } = updateFinanceSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const finance = await model.Finance.findById(req.params.id).populate('plotId');
  if (!finance) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Finance record not found');
  }
  if (finance.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  Object.assign(finance, req.body);
  await finance.save();
  return sendResponse(res, HTTP_STATUS.OK, finance, 'Finance record updated successfully');
});

// Delete Finance
const deleteFinance = asyncHandler(async (req, res) => {
  const finance = await model.Finance.findById(req.params.id).populate('plotId');
  if (!finance) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Finance record not found');
  }
  if (finance.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  await finance.remove();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Finance record deleted successfully');
});

module.exports = {
  createFinance,
  getAllFinances,
  getFinanceById,
  updateFinance,
  deleteFinance,
};
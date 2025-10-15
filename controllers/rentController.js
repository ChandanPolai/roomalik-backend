// controllers/rentController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const PDFDocument = require('pdfkit');

// ✅ Generate Rent for Tenant
const generateRent = asyncHandler(async (req, res) => {
  const { tenantId, dueDate, rentAmount, previousDues, otherCharges } = req.body;

  const tenant = await model.Tenant.findById(tenantId).populate('roomId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }

  // Verify ownership
  const room = await model.Room.findById(tenant.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Check if rent already exists for this due date
  const existingRent = await model.Rent.findOne({
    tenantId: tenantId,
    dueDate: dueDate
  });

  if (existingRent) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Rent already generated for this date');
  }

  // Get electricity amount if available
  const electricityReading = await model.ElectricityReading.findOne({
    roomId: tenant.roomId,
    isAddedToRent: false
  });

  let electricityAmount = 0;
  if (electricityReading) {
    electricityAmount = electricityReading.totalAmount;
  }

  const rent = new model.Rent({
    tenantId: tenantId,
    roomId: tenant.roomId,
    plotId: tenant.plotId,
    dueDate: dueDate,
    rentAmount: rentAmount || room.rent,
    electricityAmount: electricityAmount,
    previousDues: previousDues || 0,
    otherCharges: otherCharges || [],
    totalAmount: (rentAmount || room.rent) + electricityAmount + (previousDues || 0) + 
      (otherCharges?.reduce((sum, charge) => sum + charge.amount, 0) || 0),
    status: 'pending',
  });

  await rent.save();

  // Mark electricity reading as added to rent
  if (electricityReading) {
    electricityReading.isAddedToRent = true;
    electricityReading.rentId = rent._id;
    await electricityReading.save();
  }

  // Create notification
  const notification = new model.Notification({
    type: 'rent_generated',
    message: `Rent generated for ${tenant.name} (Room ${room.number}). Due: ${new Date(dueDate).toDateString()}`,
    userId: req.admin._id,
  });
  await notification.save();

  return sendResponse(res, HTTP_STATUS.CREATED, rent, 'Rent generated successfully');
});

// ✅ Record Rent Payment
const recordRentPayment = asyncHandler(async (req, res) => {
  const { rentId, paidAmount, paymentMethod, paymentDate } = req.body;

  const rent = await model.Rent.findById(rentId).populate('tenantId roomId');
  if (!rent) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Rent record not found');
  }

  // Verify ownership
  const room = await model.Room.findById(rent.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Update payment
  rent.paidAmount += paidAmount;
  rent.paymentMethod = paymentMethod;
  rent.paymentDate = paymentDate || new Date();
  await rent.save();

  // Create payment record
  const payment = new model.Payment({
    tenantId: rent.tenantId._id,
    amount: paidAmount,
    date: rent.paymentDate,
    method: paymentMethod,
    status: 'completed',
  });
  await payment.save();

  // Create finance record
  const finance = new model.Finance({
    type: 'income',
    amount: paidAmount,
    description: `Rent payment - ${rent.tenantId.name} (Room ${room.number})`,
    category: 'rent',
    plotId: rent.plotId,
    roomId: rent.roomId,
    tenantId: rent.tenantId._id,
  });
  await finance.save();

  // Create notification
  const notification = new model.Notification({
    type: 'rent_paid',
    message: `Rent payment of ₹${paidAmount} received from ${rent.tenantId.name}`,
    userId: req.admin._id,
  });
  await notification.save();

  return sendResponse(res, HTTP_STATUS.OK, rent, 'Rent payment recorded successfully');
});

// ✅ Get All Rents
const getAllRents = asyncHandler(async (req, res) => {
  const { status, startDate, endDate } = req.query;
  
  const plots = await model.Plot.find({ ownerId: req.admin._id });
  const plotIds = plots.map(plot => plot._id);
  const rooms = await model.Room.find({ plotId: { $in: plotIds } });
  const roomIds = rooms.map(room => room._id);

  let filter = { roomId: { $in: roomIds } };
  
  if (status) filter.status = status;
  if (startDate && endDate) {
    filter.dueDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const rents = await model.Rent.find(filter)
    .populate('tenantId roomId plotId')
    .sort({ dueDate: -1 });

  return sendResponse(res, HTTP_STATUS.OK, rents, 'Rents retrieved successfully');
});

// ✅ Add Electricity to Rent
const addElectricityToRent = asyncHandler(async (req, res) => {
  const { rentId, electricityReadingId } = req.body;

  const rent = await model.Rent.findById(rentId);
  const electricityReading = await model.ElectricityReading.findById(electricityReadingId);

  if (!rent || !electricityReading) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Rent or electricity reading not found');
  }

  // Verify ownership
  const room = await model.Room.findById(rent.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  rent.electricityAmount = electricityReading.totalAmount;
  rent.totalAmount = rent.rentAmount + rent.electricityAmount + rent.previousDues + 
    rent.otherCharges.reduce((sum, charge) => sum + charge.amount, 0);
  
  electricityReading.isAddedToRent = true;
  electricityReading.rentId = rent._id;

  await rent.save();
  await electricityReading.save();

  return sendResponse(res, HTTP_STATUS.OK, rent, 'Electricity added to rent successfully');
});

module.exports = {
  generateRent,
  recordRentPayment,
  getAllRents,
  addElectricityToRent,
};
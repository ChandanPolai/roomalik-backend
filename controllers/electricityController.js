// controllers/electricityController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');

// ✅ Record Electricity Reading
const recordElectricityReading = asyncHandler(async (req, res) => {
  const { roomId, currentReading, ratePerUnit } = req.body;

  const room = await model.Room.findById(roomId).populate('plotId');
  if (!room || room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized for this room');
  }

  // Get previous reading
  const previousReading = await model.ElectricityReading.findOne(
    { roomId: roomId },
    {},
    { sort: { createdAt: -1 } }
  );

  const previousReadingValue = previousReading ? previousReading.currentReading : 0;

  const electricityReading = new model.ElectricityReading({
    roomId: roomId,
    plotId: room.plotId._id,
    tenantId: room.status === 'occupied' ? await getTenantIdByRoomId(roomId) : null,
    currentReading: currentReading,
    previousReading: previousReadingValue,
    ratePerUnit: ratePerUnit || 10,
  });

  await electricityReading.save();

  return sendResponse(res, HTTP_STATUS.CREATED, electricityReading, 'Electricity reading recorded successfully');
});

// ✅ Get Electricity Readings for Room
const getRoomReadings = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await model.Room.findById(roomId).populate('plotId');
  if (!room || room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  const readings = await model.ElectricityReading.find({ roomId: roomId })
    .sort({ readingDate: -1 });

  return sendResponse(res, HTTP_STATUS.OK, readings, 'Electricity readings retrieved successfully');
});

// Helper function to get tenant by room
async function getTenantIdByRoomId(roomId) {
  const tenant = await model.Tenant.findOne({ roomId: roomId });
  return tenant ? tenant._id : null;
}

module.exports = {
  recordElectricityReading,
  getRoomReadings,
};
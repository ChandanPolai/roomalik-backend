// controllers/roomController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createRoomSchema, updateRoomSchema } = require('./validators/index');
const parseJsonFields = require('../utils/parseJsonFields');

// Normalize file path (same pattern)
const normalizePath = (p) => (
    p
        ? String(p)
            .replace(/\\/g, '/')
            .replace(/^\.*\/*/, '')
        : ''
);

// ✅ Create Room WITH IMAGES
const createRoom = asyncHandler(async (req, res) => {
  req.body = parseJsonFields(req.body);
  // const { error } = createRoomSchema.validate(req.body);
  // if (error) {
  //   return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  // }

  const { number, size, type, rent, deposit, furnished, floor, facing, amenities, status, plotId } = req.body;
  console.log("------", req.body)
  // Verify plot ownership
  const plot = await model.Plot.findById(plotId);
  if (!plot || plot.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid or unauthorized plot');
  }

  // Handle uploaded images
  const imageUrls = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      imageUrls.push({
        url: normalizePath(file.path),
        caption: '',
        uploadedAt: new Date(),
      });
    });
  }

  const room = new model.Room({
    number,
    size,
    type,
    rent,
    deposit,
    furnished,
    floor,
    facing,
    amenities,
    status,
    plotId,
    images: imageUrls, // Save images
  });

  await room.save();
  return sendResponse(res, HTTP_STATUS.CREATED, room, 'Room created successfully');
});

// ✅ Get All Rooms
const getAllRooms = asyncHandler(async (req, res) => {
  const { status, plotId } = req.query;
  const query = { plotId: { $in: await model.Plot.find({ ownerId: req.admin._id }).distinct('_id') } };
  if (status) query.status = status;
  if (plotId) query.plotId = plotId;

  const rooms = await model.Room.find(query).populate('plotId');
  return sendResponse(res, HTTP_STATUS.OK, rooms, 'Rooms retrieved successfully');
});

// ✅ Get Room by ID
const getRoomById = asyncHandler(async (req, res) => {
  const room = await model.Room.findById(req.params.id).populate('plotId');
  if (!room) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Room not found');
  }
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, room, 'Room retrieved successfully');
});

// ✅ Update Room WITH NEW IMAGES
const updateRoom = asyncHandler(async (req, res) => {
  req.body = parseJsonFields(req.body);
  // const { error } = updateRoomSchema.validate(req.body);
  // if (error) {
  //   return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  // }

  const room = await model.Room.findById(req.params.id).populate('plotId');
  if (!room) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Room not found');
  }
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Update basic fields
  Object.assign(room, req.body);

  // Handle new images if uploaded (APPEND to existing)
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: normalizePath(file.path),
      caption: '',
      uploadedAt: new Date(),
    }));
    room.images.push(...newImages);
  }

  await room.save();
  return sendResponse(res, HTTP_STATUS.OK, room, 'Room updated successfully');
});

// ✅ Delete Room
// ✅ Delete Room (Only if no tenants exist)
const deleteRoom = asyncHandler(async (req, res) => {
  const roomId = req.params.id;
  
  const room = await model.Room.findById(roomId).populate('plotId');
  if (!room) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Room not found');
  }
  
  // Check authorization
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Check if room has any tenants
  const tenantsCount = await model.Tenant.countDocuments({ roomId });
  if (tenantsCount > 0) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 
      `Cannot delete room. ${tenantsCount} tenant(s) exist in this room. Please remove all tenants first.`);
  }

  await room.deleteOne();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Room deleted successfully');
});

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
// controllers/roomController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createRoomSchema, updateRoomSchema } = require('../validators/index');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('images', 10);

// Create Room
const createRoom = asyncHandler(async (req, res) => {
  const { error } = createRoomSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { number, size, type, rent, deposit, furnished, floor, facing, amenities, status, plotId } = req.body;
  const plot = await model.Plot.findById(plotId);
  if (!plot || plot.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid or unauthorized plot');
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
  });

  await room.save();
  return sendResponse(res, HTTP_STATUS.CREATED, room, 'Room created successfully');
});

// Upload Room Images
const uploadRoomImages = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Image upload failed');
    }

    const room = await model.Room.findById(req.params.id).populate('plotId');
    if (!room) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Room not found');
    }
    if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized to upload images for this room');
    }

    const imageUrls = req.files.map((file) => ({
      url: `placeholder_url/${file.originalname}`, // Replace with Cloudinary upload logic
      caption: req.body.captions ? req.body.captions[file.originalname] : '',
      uploadedAt: new Date(),
    }));

    room.images.push(...imageUrls);
    await room.save();

    return sendResponse(res, HTTP_STATUS.OK, room.images, 'Images uploaded successfully');
  });
});

// Get All Rooms
const getAllRooms = asyncHandler(async (req, res) => {
  const { status, plotId } = req.query;
  const query = { plotId: { $in: await model.Plot.find({ ownerId: req.admin._id }).distinct('_id') } };
  if (status) query.status = status;
  if (plotId) query.plotId = plotId;

  const rooms = await model.Room.find(query);
  return sendResponse(res, HTTP_STATUS.OK, rooms, 'Rooms retrieved successfully');
});

// Get Room by ID
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

// Update Room
const updateRoom = asyncHandler(async (req, res) => {
  const { error } = updateRoomSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const room = await model.Room.findById(req.params.id).populate('plotId');
  if (!room) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Room not found');
  }
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  Object.assign(room, req.body);
  await room.save();
  return sendResponse(res, HTTP_STATUS.OK, room, 'Room updated successfully');
});

// Delete Room
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await model.Room.findById(req.params.id).populate('plotId');
  if (!room) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Room not found');
  }
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  await room.remove();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Room deleted successfully');
});

module.exports = {
  createRoom,
  uploadRoomImages,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
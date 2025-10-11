// controllers/plotController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createPlotSchema, updatePlotSchema } = require('./validators/index');
const parseJsonFields = require('../utils/parseJsonFields');

// Normalize file path (same as your first project)
const normalizePath = (p) => (
    p
        ? String(p)
            .replace(/\\/g, '/')
            .replace(/^\.*\/*/, '')
        : ''
);

// ✅ Create Plot WITH IMAGES
const createPlot = asyncHandler(async (req, res) => {
  req.body = parseJsonFields(req.body);
  const { error, value } = createPlotSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { name, address, totalArea, constructionYear, facilities, location } = req.body;

  // Handle uploaded images from req.files (multiple images)
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

  const plot = new model.Plot({
    name,
    address,
    totalArea,
    constructionYear,
    facilities,
    location,
    images: imageUrls, // Save images array
    ownerId: req.admin._id,
  });

  await plot.save();
  return sendResponse(res, HTTP_STATUS.CREATED, plot, 'Plot created successfully');
});

// ✅ Get All Plots
const getAllPlots = asyncHandler(async (req, res) => {
  const plots = await model.Plot.find({ ownerId: req.admin._id });
  return sendResponse(res, HTTP_STATUS.OK, plots, 'Plots retrieved successfully');
});

// ✅ Get Plot by ID
const getPlotById = asyncHandler(async (req, res) => {
  const plot = await model.Plot.findById(req.params.id);
  if (!plot) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Plot not found');
  }
  if (plot.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, plot, 'Plot retrieved successfully');
});

// ✅ Update Plot WITH NEW IMAGES
const updatePlot = asyncHandler(async (req, res) => {
  req.body = parseJsonFields(req.body);
  const { error } = updatePlotSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const plot = await model.Plot.findById(req.params.id);
  if (!plot) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Plot not found');
  }
  if (plot.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Update basic fields
  Object.assign(plot, req.body);

  // Handle new images if uploaded (APPEND to existing images)
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: normalizePath(file.path),
      caption: '',
      uploadedAt: new Date(),
    }));
    plot.images.push(...newImages); // Add new images to existing array
  }

  await plot.save();
  return sendResponse(res, HTTP_STATUS.OK, plot, 'Plot updated successfully');
});

// ✅ Delete Plot
const deletePlot = asyncHandler(async (req, res) => {
  const plot = await model.Plot.findById(req.params.id);
  if (!plot) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Plot not found');
  }
  if (plot.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  await plot.deleteOne();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Plot deleted successfully');
});

module.exports = {
  createPlot,
  getAllPlots,
  getPlotById,
  updatePlot,
  deletePlot,
};
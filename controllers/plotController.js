// controllers/plotController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createPlotSchema, updatePlotSchema } = require('./validators/index');
const multer = require('multer');

// Multer setup for image uploads (configure Cloudinary in production)
const storage = multer.memoryStorage();
const upload = multer({ storage }).array('images', 10); // Max 10 images per plot

// Create Plot
const createPlot = asyncHandler(async (req, res) => {
  const { error } = createPlotSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { name, address, totalArea, constructionYear, facilities, location } = req.body;
  const plot = new model.Plot({
    name,
    address,
    totalArea,
    constructionYear,
    facilities,
    location,
    ownerId: req.admin._id,
  });

  await plot.save();
  return sendResponse(res, HTTP_STATUS.CREATED, plot, 'Plot created successfully');
});

// Upload Plot Images
const uploadPlotImages = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Image upload failed');
    }

    const plot = await model.Plot.findById(req.params.id);
    if (!plot) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Plot not found');
    }

    if (plot.ownerId.toString() !== req.admin._id.toString()) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized to upload images for this plot');
    }

    // Placeholder: Upload images to Cloudinary/AWS S3 and get URLs
    const imageUrls = req.files.map((file) => ({
      url: `placeholder_url/${file.originalname}`, // Replace with Cloudinary upload logic
      caption: req.body.captions ? req.body.captions[file.originalname] : '',
      uploadedAt: new Date(),
    }));

    plot.images.push(...imageUrls);
    await plot.save();

    return sendResponse(res, HTTP_STATUS.OK, plot.images, 'Images uploaded successfully');
  });
});

// Get All Plots
const getAllPlots = asyncHandler(async (req, res) => {
  const plots = await model.Plot.find({ ownerId: req.admin._id });
  return sendResponse(res, HTTP_STATUS.OK, plots, 'Plots retrieved successfully');
});

// Get Plot by ID
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

// Update Plot
const updatePlot = asyncHandler(async (req, res) => {
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

  Object.assign(plot, req.body);
  await plot.save();
  return sendResponse(res, HTTP_STATUS.OK, plot, 'Plot updated successfully');
});

// Delete Plot
const deletePlot = asyncHandler(async (req, res) => {
  const plot = await model.Plot.findById(req.params.id);
  if (!plot) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Plot not found');
  }
  if (plot.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  await plot.remove();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Plot deleted successfully');
});

module.exports = {
  createPlot,
  uploadPlotImages,
  getAllPlots,
  getPlotById,
  updatePlot,
  deletePlot,
};
// controllers/tenantController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createTenantSchema, updateTenantSchema } = require('../validators/index');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
  { name: 'aadharFront', maxCount: 1 },
  { name: 'aadharBack', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'others', maxCount: 5 },
  { name: 'agreement', maxCount: 1 },
  { name: 'familyPhotos', maxCount: 10 },
]);

// Create Tenant
const createTenant = asyncHandler(async (req, res) => {
  const { error } = createTenantSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { name, mobile, email, addresses, emergency, profession, ids, family, agreement, finances, roomId, plotId } = req.body;

  const room = await model.Room.findById(roomId).populate('plotId');
  if (!room || room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid or unauthorized room');
  }
  if (room.status !== 'available') {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Room is not available');
  }

  const tenant = new model.Tenant({
    name,
    mobile,
    email,
    addresses,
    emergency,
    profession,
    ids,
    family,
    agreement,
    finances,
    roomId,
    plotId,
  });

  room.status = 'occupied';
  await room.save();
  await tenant.save();

  // Create notification
  const notification = new model.Notification({
    type: 'new_tenant',
    message: `New tenant ${name} added to room ${room.number}`,
    userId: req.admin._id,
  });
  await notification.save();

  return sendResponse(res, HTTP_STATUS.CREATED, tenant, 'Tenant created successfully');
});

// Upload Tenant Documents
const uploadTenantDocuments = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Document upload failed');
    }

    const tenant = await model.Tenant.findById(req.params.id).populate('roomId');
    if (!tenant) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
    }
    if (tenant.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
    }

    const ids = tenant.ids || {};
    if (req.files.aadharFront) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.front = `placeholder_url/${req.files.aadharFront[0].originalname}`; // Replace with Cloudinary
    }
    if (req.files.aadharBack) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.back = `placeholder_url/${req.files.aadharBack[0].originalname}`;
    }
    if (req.files.pan) {
      ids.pan = `placeholder_url/${req.files.pan[0].originalname}`;
    }
    if (req.files.photo) {
      ids.photo = `placeholder_url/${req.files.photo[0].originalname}`;
    }
    if (req.files.others) {
      ids.others = req.files.others.map((file) => ({
        url: `placeholder_url/${file.originalname}`,
        type: req.body.otherTypes ? req.body.otherTypes[file.originalname] : 'other',
      }));
    }
    if (req.files.agreement) {
      tenant.agreement.document = `placeholder_url/${req.files.agreement[0].originalname}`;
    }
    if (req.files.familyPhotos) {
      const familyPhotos = req.files.familyPhotos.map((file, index) => ({
        ...tenant.family[index],
        photo: `placeholder_url/${file.originalname}`,
      }));
      tenant.family = familyPhotos;
    }

    tenant.ids = ids;
    await tenant.save();

    return sendResponse(res, HTTP_STATUS.OK, tenant, 'Documents uploaded successfully');
  });
});

// Get All Tenants
const getAllTenants = asyncHandler(async (req, res) => {
  const tenants = await model.Tenant.find({
    plotId: { $in: await model.Plot.find({ ownerId: req.admin._id }).distinct('_id') },
  }).populate('roomId');
  return sendResponse(res, HTTP_STATUS.OK, tenants, 'Tenants retrieved successfully');
});

// Get Tenant by ID
const getTenantById = asyncHandler(async (req, res) => {
  const tenant = await model.Tenant.findById(req.params.id).populate('roomId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  if (tenant.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, tenant, 'Tenant retrieved successfully');
});

// Update Tenant
const updateTenant = asyncHandler(async (req, res) => {
  const { error } = updateTenantSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const tenant = await model.Tenant.findById(req.params.id).populate('roomId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  if (tenant.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  Object.assign(tenant, req.body);
  await tenant.save();
  return sendResponse(res, HTTP_STATUS.OK, tenant, 'Tenant updated successfully');
});

// Delete Tenant
const deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await model.Tenant.findById(req.params.id).populate('roomId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  if (tenant.roomId.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  const room = await model.Room.findById(tenant.roomId);
  room.status = 'available';
  await room.save();

  await tenant.remove();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Tenant deleted successfully');
});

module.exports = {
  createTenant,
  uploadTenantDocuments,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
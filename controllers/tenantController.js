// controllers/tenantController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createTenantSchema, updateTenantSchema } = require('./validators/index');
const parseJsonFields = require('../utils/parseJsonFields');

// Normalize file path
const normalizePath = (p) => (
    p
        ? String(p)
            .replace(/\\/g, '/')
            .replace(/^\.*\/*/, '')
        : ''
);

// ✅ Create Tenant WITH DOCUMENTS
const createTenant = asyncHandler(async (req, res) => {
  req.body = parseJsonFields(req.body);
  const { error } = createTenantSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { name, mobile, email, addresses, emergency, profession, family, agreement, finances, roomId, plotId } = req.body;

  // Verify room ownership and availability
  const room = await model.Room.findById(roomId).populate('plotId');
  if (!room || room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid or unauthorized room');
  }
  if (room.status !== 'available') {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Room is not available');
  }

  // Handle uploaded documents
  const ids = {};
  
  if (req.files) {
    // Aadhar documents
    if (req.files.aadharFront && req.files.aadharFront[0]) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.front = normalizePath(req.files.aadharFront[0].path);
    }
    if (req.files.aadharBack && req.files.aadharBack[0]) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.back = normalizePath(req.files.aadharBack[0].path);
    }
    
    // PAN card
    if (req.files.pan && req.files.pan[0]) {
      ids.pan = normalizePath(req.files.pan[0].path);
    }
    
    // Tenant photo
    if (req.files.photo && req.files.photo[0]) {
      ids.photo = normalizePath(req.files.photo[0].path);
    }
    
    // Other documents
    if (req.files.others && req.files.others.length > 0) {
      ids.others = req.files.others.map((file, index) => ({
        url: normalizePath(file.path),
        type: req.body.otherTypes ? req.body.otherTypes[index] : 'other',
      }));
    }
  }

  // Handle agreement document
  let agreementData = agreement;
  if (req.files && req.files.agreement && req.files.agreement[0]) {
    agreementData = {
      ...agreement,
      document: normalizePath(req.files.agreement[0].path)
    };
  }

  // Handle family photos
  let familyData = family;
  if (req.files && req.files.familyPhotos && req.files.familyPhotos.length > 0) {
    familyData = family.map((member, index) => ({
      ...member,
      photo: req.files.familyPhotos[index] ? normalizePath(req.files.familyPhotos[index].path) : member.photo
    }));
  }

  const tenant = new model.Tenant({
    name,
    mobile,
    email,
    addresses,
    emergency,
    profession,
    ids,
    family: familyData,
    agreement: agreementData,
    finances,
    roomId,
    plotId,
  });

  // Update room status
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

// ✅ Get All Tenants
const getAllTenants = asyncHandler(async (req, res) => {
  const tenants = await model.Tenant.find({
    plotId: { $in: await model.Plot.find({ ownerId: req.admin._id }).distinct('_id') },
  }).populate('roomId plotId');
  return sendResponse(res, HTTP_STATUS.OK, tenants, 'Tenants retrieved successfully');
});

// ✅ Get Tenant by ID
const getTenantById = asyncHandler(async (req, res) => {
  const tenant = await model.Tenant.findById(req.params.id).populate('roomId plotId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  
  const room = await model.Room.findById(tenant.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, tenant, 'Tenant retrieved successfully');
});

// ✅ Update Tenant WITH NEW DOCUMENTS
const updateTenant = asyncHandler(async (req, res) => {
    req.body = parseJsonFields(req.body);
  const { error } = updateTenantSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const tenant = await model.Tenant.findById(req.params.id).populate('roomId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  
  const room = await model.Room.findById(tenant.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Update basic fields
  Object.assign(tenant, req.body);

  // Handle new uploaded documents
  if (req.files) {
    const ids = tenant.ids || {};
    
    // Update Aadhar documents
    if (req.files.aadharFront && req.files.aadharFront[0]) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.front = normalizePath(req.files.aadharFront[0].path);
    }
    if (req.files.aadharBack && req.files.aadharBack[0]) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.back = normalizePath(req.files.aadharBack[0].path);
    }
    
    // Update PAN card
    if (req.files.pan && req.files.pan[0]) {
      ids.pan = normalizePath(req.files.pan[0].path);
    }
    
    // Update photo
    if (req.files.photo && req.files.photo[0]) {
      ids.photo = normalizePath(req.files.photo[0].path);
    }
    
    // Update other documents
    if (req.files.others && req.files.others.length > 0) {
      const newOthers = req.files.others.map((file, index) => ({
        url: normalizePath(file.path),
        type: req.body.otherTypes ? req.body.otherTypes[index] : 'other',
      }));
      ids.others = [...(ids.others || []), ...newOthers];
    }
    
    tenant.ids = ids;

    // Update agreement document
    if (req.files.agreement && req.files.agreement[0]) {
      tenant.agreement.document = normalizePath(req.files.agreement[0].path);
    }

    // Update family photos
    if (req.files.familyPhotos && req.files.familyPhotos.length > 0) {
      tenant.family = tenant.family.map((member, index) => ({
        ...member,
        photo: req.files.familyPhotos[index] ? normalizePath(req.files.familyPhotos[index].path) : member.photo
      }));
    }
  }

  await tenant.save();
  return sendResponse(res, HTTP_STATUS.OK, tenant, 'Tenant updated successfully');
});

// ✅ Delete Tenant
const deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await model.Tenant.findById(req.params.id).populate('roomId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  
  const room = await model.Room.findById(tenant.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Make room available again
  room.status = 'available';
  await room.save();

  await tenant.deleteOne();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Tenant deleted successfully');
});

module.exports = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
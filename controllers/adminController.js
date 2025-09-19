const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema 
} = require('../controllers/validators/admin.validator');

const registerAdmin = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { email, password, name, phone, role } = req.body;

  let admin = await model.Admin.findOne({ email });
  if (admin) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Admin already exists');
  }

  admin = new model.Admin({ email, password, name, phone, role });
  await admin.save();

  const payload = { id: admin._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { 
    httpOnly: true, 
    maxAge: 3600000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return sendResponse(res, HTTP_STATUS.CREATED, { 
    id: admin._id, 
    email, 
    name, 
    phone, 
    role: admin.role,
    token 
  }, 'Admin registered successfully');
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { email, password } = req.body;
  const admin = await model.Admin.findOne({ email });

  if (!admin) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid credentials');
  }

  if (!admin.isActive) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Account is deactivated');
  }

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid credentials');
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  const payload = { id: admin._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { 
    httpOnly: true, 
    maxAge: 3600000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return sendResponse(res, HTTP_STATUS.OK, { 
    id: admin._id, 
    email, 
    name: admin.name, 
    phone: admin.phone, 
    role: admin.role,
    avatar: admin.avatar,
    token 
  }, 'Login successful');
});

const getProfile = asyncHandler(async (req, res) => {
  return sendResponse(res, HTTP_STATUS.OK, {
    id: req.admin._id,
    email: req.admin.email,
    name: req.admin.name,
    phone: req.admin.phone,
    avatar: req.admin.avatar,
    role: req.admin.role,
    permissions: req.admin.permissions,
    isActive: req.admin.isActive,
    lastLogin: req.admin.lastLogin,
    createdAt: req.admin.createdAt
  }, 'Profile fetched successfully');
});

const updateProfile = asyncHandler(async (req, res) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const admin = await model.Admin.findById(req.admin._id);
  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  if (req.body.name) admin.name = req.body.name;
  if (req.body.phone) admin.phone = req.body.phone;
  if (req.body.avatar) admin.avatar = req.body.avatar;
  if (req.body.role) admin.role = req.body.role;
  if (req.body.permissions) admin.permissions = req.body.permissions;

  await admin.save();

  return sendResponse(res, HTTP_STATUS.OK, {
    id: admin._id,
    email: admin.email,
    name: admin.name,
    phone: admin.phone,
    avatar: admin.avatar,
    role: admin.role,
    permissions: admin.permissions
  }, 'Profile updated successfully');
});

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await model.Admin.find().select('-password');
  return sendResponse(res, HTTP_STATUS.OK, admins, 'Admins retrieved successfully');
});

const getAdminById = asyncHandler(async (req, res) => {
  const admin = await model.Admin.findById(req.params.id).select('-password');
  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }
  return sendResponse(res, HTTP_STATUS.OK, admin, 'Admin retrieved successfully');
});

const toggleAdminStatus = asyncHandler(async (req, res) => {
  const admin = await model.Admin.findById(req.params.id);
  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  admin.isActive = !admin.isActive;
  await admin.save();

  return sendResponse(res, HTTP_STATUS.OK, {
    id: admin._id,
    isActive: admin.isActive
  }, `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`);
});

module.exports = { 
  registerAdmin, 
  loginAdmin, 
  getProfile, 
  updateProfile,
  getAllAdmins,
  getAdminById,
  toggleAdminStatus
};
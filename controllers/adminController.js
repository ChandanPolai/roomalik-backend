const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema,
  changePasswordSchema,
  resetPasswordSchema
} = require('../controllers/validators/admin.validator');

// Normalize file path
const normalizePath = (p) => (
  p
    ? String(p)
        .replace(/\\/g, '/')
        .replace(/^\.*\/*/, '')
    : ''
);

// ✅ Register Admin (with avatar upload)
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

  // Handle avatar upload
  let avatarUrl = '';
  if (req.file) {
    avatarUrl = normalizePath(req.file.path);
  }

  admin = new model.Admin({ 
    email, 
    password, 
    name, 
    phone, 
    role,
    avatar: avatarUrl
  });
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
    avatar: admin.avatar,
    token 
  }, 'Admin registered successfully');
});

// ✅ Login Admin
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

// ✅ Logout Admin
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  return sendResponse(res, HTTP_STATUS.OK, null, 'Logout successful');
});

// ✅ Get Profile
const getProfile = asyncHandler(async (req, res) => {
  return sendResponse(res, HTTP_STATUS.OK, {
    id: req.admin._id,
    email: req.admin.email,
    name: req.admin.name,
    phone: req.admin.phone,
    avatar: req.admin.avatar,
    role: req.admin.role,
    isActive: req.admin.isActive,
    lastLogin: req.admin.lastLogin,
    createdAt: req.admin.createdAt
  }, 'Profile fetched successfully');
});

// ✅ Update Profile (with avatar upload)
const updateProfile = asyncHandler(async (req, res) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const admin = await model.Admin.findById(req.admin._id);
  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  // Update basic fields
  if (req.body.name) admin.name = req.body.name;
  if (req.body.phone) admin.phone = req.body.phone;

  // Handle avatar upload
  if (req.file) {
    admin.avatar = normalizePath(req.file.path);
  }

  await admin.save();

  return sendResponse(res, HTTP_STATUS.OK, {
    id: admin._id,
    email: admin.email,
    name: admin.name,
    phone: admin.phone,
    avatar: admin.avatar,
    role: admin.role
  }, 'Profile updated successfully');
});

// ✅ Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { currentPassword, newPassword } = req.body;

  const admin = await model.Admin.findById(req.admin._id);
  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  // Verify current password
  const isMatch = await admin.matchPassword(currentPassword);
  if (!isMatch) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Current password is incorrect');
  }

  // Update to new password
  admin.password = newPassword;
  await admin.save();

  return sendResponse(res, HTTP_STATUS.OK, null, 'Password changed successfully');
});

// ✅ Reset Password (Forgot Password)
const resetPassword = asyncHandler(async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { email, newPassword } = req.body;

  const admin = await model.Admin.findOne({ email });
  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  // Update password
  admin.password = newPassword;
  await admin.save();

  return sendResponse(res, HTTP_STATUS.OK, null, 'Password reset successfully');
});

module.exports = { 
  registerAdmin, 
  loginAdmin, 
  logoutAdmin,
  getProfile, 
  updateProfile,
  changePassword,
  resetPassword
};
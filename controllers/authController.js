// controllers/authController.js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  resetPasswordSchema,
} = require('../validators/index');
const nodemailer = require('nodemailer');

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { email, password, name, phone, address, role } = req.body;

  let admin = await model.Admin.findOne({ email });
  if (admin) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Admin already exists');
  }

  admin = new model.Admin({ email, password, name, phone, address, role });
  await admin.save();

  const payload = { id: admin._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 3600000, // 1 hour
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return sendResponse(res, HTTP_STATUS.CREATED, {
    id: admin._id,
    email,
    name,
    phone,
    address,
    role: admin.role,
    token,
  }, 'Admin registered successfully');
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { email, password } = req.body;
  const admin = await model.Admin.findOne({ email });

  if (!admin || !admin.isActive) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid credentials or account deactivated');
  }

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid credentials');
  }

  admin.lastLogin = new Date();
  await admin.save();

  const payload = { id: admin._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 3600000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    id: admin._id,
    email,
    name: admin.name,
    phone: admin.phone,
    address: admin.address,
    role: admin.role,
    avatar: admin.avatar,
    token,
  }, 'Login successful');
});

// Get Profile
const getProfile = asyncHandler(async (req, res) => {
  return sendResponse(res, HTTP_STATUS.OK, {
    id: req.admin._id,
    email: req.admin.email,
    name: req.admin.name,
    phone: req.admin.phone,
    address: req.admin.address,
    avatar: req.admin.avatar,
    role: req.admin.role,
    isActive: req.admin.isActive,
    lastLogin: req.admin.lastLogin,
    createdAt: req.admin.createdAt,
  }, 'Profile fetched successfully');
});

// Update Profile
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
  if (req.body.address) admin.address = req.body.address;
  if (req.body.avatar) admin.avatar = req.body.avatar; // Assuming avatar is uploaded via Multer/Cloudinary
  if (req.body.role && req.admin.role === 'superadmin') admin.role = req.body.role;

  await admin.save();

  return sendResponse(res, HTTP_STATUS.OK, {
    id: admin._id,
    email: admin.email,
    name: admin.name,
    phone: admin.phone,
    address: admin.address,
    avatar: admin.avatar,
    role: admin.role,
  }, 'Profile updated successfully');
});

// Reset Password (Send OTP/Link)
const resetPassword = asyncHandler(async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const { email } = req.body;
  const admin = await model.Admin.findOne({ email });
  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  // Generate OTP or reset token
  const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  // Send email with reset link (Nodemailer setup)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: admin.email,
    subject: 'Password Reset Request',
    text: `Click this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
  return sendResponse(res, HTTP_STATUS.OK, null, 'Password reset link sent to email');
});

module.exports = {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  resetPassword,
};
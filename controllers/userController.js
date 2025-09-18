const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HTTP_STATUS, sendResponse } = require('../utils/httpUtils');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone: Joi.string().min(10).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().min(10).optional(),
  avatar: Joi.string().uri().optional(),
});

const registerUser = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, error.details[0].message);
  }

  const { email, password, name, phone } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, 'User already exists');
  }

  user = new User({ email, password, name, phone });
  await user.save();

  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
  sendResponse(res, HTTP_STATUS.CREATED, { id: user._id, email, name, phone, token }, 'User registered successfully');
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, error.details[0].message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, 'Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, 'Invalid credentials');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
  sendResponse(res, HTTP_STATUS.OK, { id: user._id, email, name: user.name, phone: user.phone, token }, 'Login successful');
});

const getProfile = asyncHandler(async (req, res) => {
  sendResponse(res, HTTP_STATUS.OK, {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    phone: req.user.phone,
    avatar: req.user.avatar,
  }, 'Profile fetched successfully');
});

const updateProfile = asyncHandler(async (req, res) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, error.details[0].message);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, null, 'User not found');
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.avatar) user.avatar = req.body.avatar;

  await user.save();
  sendResponse(res, HTTP_STATUS.OK, {
    id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    avatar: user.avatar,
  }, 'Profile updated successfully');
});

module.exports = { registerUser, loginUser, getProfile, updateProfile };
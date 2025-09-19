const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/admin.model');
const { sendError } = require('../utils/httpUtils');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 401, 'Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    
    if (!req.admin) {
      return sendError(res, 401, 'Admin not found');
    }
    
    if (!req.admin.isActive) {
      return sendError(res, 401, 'Admin account is deactivated');
    }
    
    next();
  } catch (error) {
    return sendError(res, 401, 'Not authorized, token failed');
  }
});

// Optional: Role-based middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.admin.role !== role && req.admin.role !== 'superadmin') {
      return sendError(res, 403, 'Access denied. Insufficient permissions');
    }
    next();
  };
};

module.exports = { protect, requireRole };
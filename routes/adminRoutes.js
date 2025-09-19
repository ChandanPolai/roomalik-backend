const express = require('express');
const { 
  registerAdmin, 
  loginAdmin, 
  getProfile, 
  updateProfile,
  getAllAdmins,
  getAdminById,
  toggleAdminStatus
} = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/auth/register', registerAdmin);
router.post('/auth/login', loginAdmin);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin management routes (only for superadmin)
router.get('/', protect, requireRole('superadmin'), getAllAdmins);
router.get('/:id', protect, requireRole('superadmin'), getAdminById);
router.put('/:id/toggle-status', protect, requireRole('superadmin'), toggleAdminStatus);

module.exports = router;
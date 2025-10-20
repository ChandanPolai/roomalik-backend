const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  changePassword,
  getProfile,
  updateProfile,
  resetPassword,

  createPlot,
  getAllPlots,
  getPlotById,
  updatePlot,
  deletePlot,

  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,

  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,

} = require('../controllers/index');


const { uploader } = require('../middleware/files'); // Import uploader
// ✅ Plot Image Uploader
const plotImageUploader = uploader('plots');
const roomImageUploader = uploader('rooms');
const tenantDocUploader = uploader('tenants'); 
const adminAvatarUploader = uploader('admins');

// ✅ Public Routes (Auth) - No Authentication Required
router.post('/auth/register', adminAvatarUploader.single('avatar'), registerAdmin);
router.post('/auth/login', loginAdmin);
router.post('/auth/logout', logoutAdmin);
router.post('/auth/reset-password', resetPassword);

// ✅ Protected Routes (Require Authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, adminAvatarUploader.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

// ✅✅ Plot Routes WITH IMAGE UPLOAD
router.post('/plots', protect, plotImageUploader.array('images', 10), createPlot); // Max 10 images
router.get('/plots', protect, getAllPlots);
router.get('/plots/:id', protect, getPlotById);
router.put('/plots/:id', protect, plotImageUploader.array('images', 10), updatePlot); // Update with new images
router.delete('/plots/:id', protect, deletePlot);

// ✅✅ Room Routes WITH IMAGE UPLOAD
router.post('/rooms', protect, roomImageUploader.array('images', 10), createRoom); // Create with images
router.get('/rooms', protect, getAllRooms);
router.get('/rooms/:id', protect, getRoomById);
router.put('/rooms/:id', protect, roomImageUploader.array('images', 10), updateRoom); // Update with images
router.delete('/rooms/:id', protect, deleteRoom);

// ✅✅ Tenant Routes WITH DOCUMENT UPLOAD
router.post(
  '/tenants',
  protect,
  tenantDocUploader.fields([
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'others', maxCount: 5 },
    { name: 'agreement', maxCount: 1 },
    { name: 'familyPhotos', maxCount: 10 },
  ]),
  createTenant
);
router.get('/tenants', protect, getAllTenants);
router.get('/tenants/:id', protect, getTenantById);
router.put(
  '/tenants/:id',
  protect,
  tenantDocUploader.fields([
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'others', maxCount: 5 },
    { name: 'agreement', maxCount: 1 },
    { name: 'familyPhotos', maxCount: 10 },
  ]),
  updateTenant
);
router.delete('/tenants/:id', protect, deleteTenant);


module.exports = router;
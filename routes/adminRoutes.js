const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  registerAdmin,
  loginAdmin,
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
  createFinance,
  getAllFinances,
  getFinanceById,
  updateFinance,
  deleteFinance,
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getAllNotifications,
  markNotificationRead,
  deleteNotification,
} = require('../controllers/index');


const { uploader } = require('../middleware/files'); // Import uploader
// ✅ Plot Image Uploader
const plotImageUploader = uploader('plots');
const roomImageUploader = uploader('rooms');
const tenantDocUploader = uploader('tenants'); 


// Public Routes (Auth)
router.post('/auth/register', registerAdmin);
router.post('/auth/login', loginAdmin);
router.post('/auth/reset-password', resetPassword);

// Protected Routes (Require Authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// ✅✅ Plot Routes WITH IMAGE UPLOAD
router.post('/plots', protect, plotImageUploader.array('images', 10), createPlot); // Max 10 images
router.get('/plots', protect, getAllPlots);
router.get('/plots/:id', protect, getPlotById);
router.put('/plots/:id', protect, plotImageUploader.array('images', 10), updatePlot); // Update with new images
router.delete('/plots/:id', protect, deletePlot);

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


// Finance Routes
router.post('/finances', protect, createFinance);
router.get('/finances', protect, getAllFinances);
router.get('/finances/:id', protect, getFinanceById);
router.put('/finances/:id', protect, updateFinance);
router.delete('/finances/:id', protect, deleteFinance);

// Electricity Bill Routes
router.post('/bills', protect, createBill);
router.get('/bills', protect, getAllBills);
router.get('/bills/:id', protect, getBillById);
router.put('/bills/:id', protect, updateBill);
router.delete('/bills/:id', protect, deleteBill);

// Payment Routes
router.post('/payments', protect, createPayment);
router.get('/payments', protect, getAllPayments);
router.get('/payments/:id', protect, getPaymentById);
router.put('/payments/:id', protect, updatePayment);
router.delete('/payments/:id', protect, deletePayment);

// Contact Routes
router.post('/contacts', protect, createContact);
router.get('/contacts', protect, getAllContacts);
router.get('/contacts/:id', protect, getContactById);
router.put('/contacts/:id', protect, updateContact);
router.delete('/contacts/:id', protect, deleteContact);

// Notification Routes
router.get('/notifications', protect, getAllNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.delete('/notifications/:id', protect, deleteNotification);

// // Superadmin Routes (Admin Management)
// router.get('/admins', protect, requireRole('superadmin'), getAllAdmins);
// router.get('/admins/:id', protect, requireRole('superadmin'), getAdminById);
// router.put('/admins/:id/toggle-status', protect, requireRole('superadmin'), toggleAdminStatus);

module.exports = router;
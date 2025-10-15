// controllers/index.js
const {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  resetPassword,
  changePassword,
  logoutAdmin,

} = require('./authController');
const {
  createPlot,
  uploadPlotImages,
  getAllPlots,
  getPlotById,
  updatePlot,
  deletePlot,
} = require('./plotController');
const {
  createRoom,
  uploadRoomImages,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require('./roomController');
const {
  createTenant,
  uploadTenantDocuments,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
} = require('./tenantController');
const {
  createFinance,
  getAllFinances,
  getFinanceById,
  updateFinance,
  deleteFinance,
} = require('./financeController');
const {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
} = require('./electricityBillController');
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require('./paymentController');
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require('./contactController');
const {
  getAllNotifications,
  markNotificationRead,
  deleteNotification,
} = require('./notificationController');

module.exports = {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  resetPassword,
  changePassword,
  logoutAdmin,
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
};
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
};
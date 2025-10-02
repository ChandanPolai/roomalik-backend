// validators/index.js
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  resetPasswordSchema,
} = require('./auth.validator');
const { createPlotSchema, updatePlotSchema } = require('./plot.validator');
const { createRoomSchema, updateRoomSchema } = require('./room.validator');
const { createTenantSchema, updateTenantSchema } = require('./tenant.validator');
const { createFinanceSchema, updateFinanceSchema } = require('./finance.validator');
const { createBillSchema, updateBillSchema } = require('./electricityBill.validator');
const { createPaymentSchema, updatePaymentSchema } = require('./payment.validator');
const { createContactSchema, updateContactSchema } = require('./contact.validator');
const { updateNotificationSchema } = require('./notification.validator');

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  resetPasswordSchema,
  createPlotSchema,
  updatePlotSchema,
  createRoomSchema,
  updateRoomSchema,
  createTenantSchema,
  updateTenantSchema,
  createFinanceSchema,
  updateFinanceSchema,
  createBillSchema,
  updateBillSchema,
  createPaymentSchema,
  updatePaymentSchema,
  createContactSchema,
  updateContactSchema,
  updateNotificationSchema,
};
// models/zindex.js
const Admin = require('./admin.model');
const Plot = require('./plot.model');
const Room = require('./room.model');
const Tenant = require('./tenant.model');
const Finance = require('./finance.model');
const ElectricityBill = require('./electricityBill.model');
const Payment = require('./payment.model');
const Contact = require('./contact.model');
const Notification = require('./notification.model');
const Rent = require('./rent.model');
const ElectricityReading = require('./electricityReading.model'); 

module.exports = {
  Admin,
  Plot,
  Room,
  Tenant,
  Finance,
  ElectricityBill,
  Payment,
  Contact,
  Notification,
  Rent,
  ElectricityReading,
};
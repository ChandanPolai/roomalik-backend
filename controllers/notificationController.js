// controllers/notificationController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { updateNotificationSchema } = require('../validators/index');

// Get All Notifications
const getAllNotifications = asyncHandler(async (req, res) => {
  const { read } = req.query;
  const query = { userId: req.admin._id };
  if (read !== undefined) query.read = read === 'true';

  const notifications = await model.Notification.find(query).sort({ date: -1 });
  return sendResponse(res, HTTP_STATUS.OK, notifications, 'Notifications retrieved successfully');
});

// Mark Notification as Read
const markNotificationRead = asyncHandler(async (req, res) => {
  const { error } = updateNotificationSchema.validate(req.body);
  if (error) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  }

  const notification = await model.Notification.findById(req.params.id);
  if (!notification || notification.userId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Notification not found or unauthorized');
  }

  notification.read = req.body.read !== undefined ? req.body.read : true;
  await notification.save();
  return sendResponse(res, HTTP_STATUS.OK, notification, 'Notification updated successfully');
});

// Delete Notification
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await model.Notification.findById(req.params.id);
  if (!notification || notification.userId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Notification not found or unauthorized');
  }

  await notification.remove();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Notification deleted successfully');
});

module.exports = {
  getAllNotifications,
  markNotificationRead,
  deleteNotification,
};
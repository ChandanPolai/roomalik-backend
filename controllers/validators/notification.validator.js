// validators/notification.validator.js
const Joi = require('joi');

const updateNotificationSchema = Joi.object({
  read: Joi.boolean().optional(),
});

module.exports = {
  updateNotificationSchema,
};
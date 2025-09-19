const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const sendResponse = (res, status, data = null, message = '') => {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    message,
    data
  });
};

const sendError = (res, status, message = '') => {
  return res.status(status).json({
    success: false,
    error: message
  });
};

module.exports = {
  HTTP_STATUS,
  sendResponse,
  sendError
};
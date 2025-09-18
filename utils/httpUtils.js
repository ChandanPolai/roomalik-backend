const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const sendResponse = (res, status, data, message) => {
  res.status(status).json({ success: status < 400, message, data });
};

module.exports = { HTTP_STATUS, sendResponse };
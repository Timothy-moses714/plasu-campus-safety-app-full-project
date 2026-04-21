const sendResponse = (res, statusCode, data, message = "Success") => {
  res.status(statusCode).json({ message, data });
};

const sendError = (res, statusCode, message = "Something went wrong") => {
  res.status(statusCode).json({ message });
};

module.exports = { sendResponse, sendError };

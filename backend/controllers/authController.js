const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendResponse, sendError } = require("../utils/sendResponse");

// @route  POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, phone, matricNumber, department, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 400, "Email already registered");

    const user = await User.create({ name, email, password, phone, matricNumber, department, role });
    const token = generateToken(user._id);

    sendResponse(res, 201, { user, token }, "Registration successful");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 401, "Invalid email or password");
    }
    const token = generateToken(user._id);
    sendResponse(res, 200, { user, token }, "Login successful");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  GET /api/auth/me
const getMe = async (req, res) => {
  sendResponse(res, 200, req.user);
};

// @route  POST /api/auth/logout
const logout = async (req, res) => {
  sendResponse(res, 200, null, "Logged out successfully");
};

module.exports = { register, login, getMe, logout };

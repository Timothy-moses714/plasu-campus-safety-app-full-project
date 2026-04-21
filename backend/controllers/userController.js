const User = require("../models/User");
const { sendResponse, sendError } = require("../utils/sendResponse");

// @route  GET /api/users  (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    sendResponse(res, 200, users);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, "User not found");
    sendResponse(res, 200, user);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  PATCH /api/users/profile
const updateProfile = async (req, res) => {
  const { name, phone, department } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department },
      { new: true, runValidators: true }
    );
    sendResponse(res, 200, user, "Profile updated");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

module.exports = { getAllUsers, getUserById, updateProfile };

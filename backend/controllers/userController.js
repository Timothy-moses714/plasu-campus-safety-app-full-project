const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ message: "Success", data: users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Success", data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, phone, department, address, profilePicture } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department, address, profilePicture },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ message: "Profile updated", data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getUserById, updateProfile, changePassword };

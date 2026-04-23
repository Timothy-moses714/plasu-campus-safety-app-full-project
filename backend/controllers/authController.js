const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendResponse, sendError } = require("../utils/sendResponse");

const register = async (req, res) => {
  const { name, email, password, phone, matricNumber, department, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || "",
      matricNumber: matricNumber || "",
      department: department || "",
      role: role || "student",
    });
    const token = generateToken(user._id);
    return res.status(201).json({ message: "Registration successful", data: { user, token } });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    return res.status(200).json({ message: "Login successful", data: { user, token } });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({ message: "Success", data: req.user });
};

const logout = async (req, res) => {
  return res.status(200).json({ message: "Logged out successfully", data: null });
};

module.exports = { register, login, getMe, logout };

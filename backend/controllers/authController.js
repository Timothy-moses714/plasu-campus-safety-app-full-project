const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

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
      name, email, password,
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

// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Please provide your email address" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email address" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🛡 PLASU SafeApp</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937;">Password Reset Request</h2>
          <p style="color: #4b5563;">Hi ${user.name},</p>
          <p style="color: #4b5563;">You requested to reset your password. Click the button below to set a new password. This link expires in <strong>30 minutes</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset My Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
          <p style="color: #6b7280; font-size: 13px;">Or copy this link: <a href="${resetUrl}" style="color: #dc2626;">${resetUrl}</a></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">PLASU Campus Safety App — Plateau State University, Bokkos</p>
        </div>
      </div>
    `;

    await sendEmail({ to: user.email, subject: "PLASU SafeApp — Password Reset Request", html });

    return res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    // Clear token if email fails
    await User.findOneAndUpdate(
      { email: req.body.email },
      { resetPasswordToken: undefined, resetPasswordExpire: undefined }
    );
    return res.status(500).json({ message: "Email could not be sent. Please try again." });
  }
};

// @route POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  const { password } = req.body;
  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link. Please request a new one." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    return res.status(200).json({ message: "Password reset successful", data: { user, token } });
  } catch (err) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, logout, forgotPassword, resetPassword };

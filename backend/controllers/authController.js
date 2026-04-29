const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: sign JWT ──────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ── Helper: build safe user object (no password) ──────────────────────────────
const safeUser = (user) => ({
  _id:             user._id,
  fullName:        user.fullName,
  email:           user.email,
  phoneNumber:     user.phoneNumber,
  matricNumber:    user.matricNumber,
  role:            user.role,
  residentialType: user.residentialType,
  hostelName:      user.hostelName,
  streetArea:      user.streetArea,
  landmark:        user.landmark,
  createdAt:       user.createdAt,
});

// ── POST /api/auth/register ───────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      matricNumber,
      // Address fields
      residentialType,
      hostelName,
      streetArea,
      landmark,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        message: 'Full name, email, phone number and password are required.',
      });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      matricNumber:    matricNumber    || '',
      residentialType: residentialType || 'on-campus',
      hostelName:      hostelName      || '',
      streetArea:      streetArea      || '',
      landmark:        landmark        || '',
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Explicitly select password (it's hidden by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact admin.' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ success: true, user: safeUser(user) });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
// Students and security officers can update their own profile.
// Email and role cannot be changed here.
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      matricNumber,
      // Address fields
      residentialType,
      hostelName,
      streetArea,
      landmark,
    } = req.body;

    const allowedUpdate = {
      ...(fullName        && { fullName }),
      ...(phoneNumber     && { phoneNumber }),
      ...(matricNumber    !== undefined && { matricNumber }),
      ...(residentialType && { residentialType }),
      ...(hostelName      !== undefined && { hostelName }),
      ...(streetArea      !== undefined && { streetArea }),
      ...(landmark        !== undefined && { landmark }),
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      allowedUpdate,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: safeUser(user),
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

// ── PUT /api/auth/change-password ─────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save(); // triggers the pre-save bcrypt hook

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('changePassword error:', error);
    res.status(500).json({ message: 'Server error changing password.' });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };

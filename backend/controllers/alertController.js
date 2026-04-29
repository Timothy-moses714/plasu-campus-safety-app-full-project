const Alert = require('../models/Alert');
const User  = require('../models/User');

// ─── Create Alert (Panic Button Triggered) ───────────────────────────────────
const createAlert = async (req, res) => {
  try {
    const { lat, lng, message } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'GPS coordinates are required.' });
    }

    // Fetch the student's full profile to snapshot address + personal details
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const alert = await Alert.create({
      student: req.user.id,
      location: { lat, lng },

      // ── Snapshot residential address at time of alert ──────────────────────
      studentAddress: {
        residentialType: student.residentialType || 'on-campus',
        hostelName:      student.hostelName      || '',
        streetArea:      student.streetArea      || '',
        landmark:        student.landmark        || '',
      },

      // ── Snapshot personal details so security can call immediately ─────────
      studentSnapshot: {
        fullName:     student.fullName,
        phoneNumber:  student.phoneNumber,
        matricNumber: student.matricNumber || '',
      },

      message: message || '',
      status:  'active',
    });

    res.status(201).json({
      success: true,
      message: 'Alert created. Help is on the way.',
      alert,
    });
  } catch (error) {
    console.error('createAlert error:', error);
    res.status(500).json({ message: 'Server error creating alert.' });
  }
};

// ─── Get All Alerts (Security / Admin Dashboard) ─────────────────────────────
const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('student', 'fullName email phoneNumber matricNumber')
      .populate('resolvedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error('getAllAlerts error:', error);
    res.status(500).json({ message: 'Server error fetching alerts.' });
  }
};

// ─── Get Active Alerts Only ───────────────────────────────────────────────────
const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: { $in: ['active', 'responding'] } })
      .populate('student', 'fullName email phoneNumber matricNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error('getActiveAlerts error:', error);
    res.status(500).json({ message: 'Server error fetching active alerts.' });
  }
};

// ─── Update Alert Status (Security Responds / Resolves) ──────────────────────
const updateAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status } = req.body;

    if (!['active', 'responding', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updateData = { status };

    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.user.id;
    }

    const alert = await Alert.findByIdAndUpdate(alertId, updateData, { new: true });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found.' });
    }

    res.status(200).json({ success: true, alert });
  } catch (error) {
    console.error('updateAlertStatus error:', error);
    res.status(500).json({ message: 'Server error updating alert.' });
  }
};

// ─── Get My Alerts (Student View) ────────────────────────────────────────────
const getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error('getMyAlerts error:', error);
    res.status(500).json({ message: 'Server error fetching your alerts.' });
  }
};

module.exports = {
  createAlert,
  getAllAlerts,
  getActiveAlerts,
  updateAlertStatus,
  getMyAlerts,
};

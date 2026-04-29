const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Live GPS coordinates at the moment the alert was triggered
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    // ─── Address Snapshot ─────────────────────────────────────────────────────
    // Captured at alert creation time so security always sees where
    // the student lives even if the student later edits their profile.
    studentAddress: {
      residentialType: { type: String, default: '' },  // 'on-campus' | 'off-campus'
      hostelName:      { type: String, default: '' },  // e.g. "Grace Hostel, Room 12"
      streetArea:      { type: String, default: '' },  // e.g. "Butura Road"
      landmark:        { type: String, default: '' },  // e.g. "Opposite First Bank"
    },
    // ─────────────────────────────────────────────────────────────────────────

    // Student personal details snapshot for the security dashboard
    studentSnapshot: {
      fullName:    { type: String, default: '' },
      phoneNumber: { type: String, default: '' },
      matricNumber:{ type: String, default: '' },
    },

    status: {
      type: String,
      enum: ['active', 'responding', 'resolved'],
      default: 'active',
    },

    message: {
      type: String,
      default: '',
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;

const Alert = require("../models/Alert");
const PanicAlert = require("../models/PanicAlert");
const { sendResponse, sendError } = require("../utils/sendResponse");

// @route  GET /api/alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate("issuedBy", "name role");
    sendResponse(res, 200, alerts);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  POST /api/alerts  (admin/security only)
const createAlert = async (req, res) => {
  const { message, severity, location, expiresAt } = req.body;
  try {
    const alert = await Alert.create({
      message, severity, location, expiresAt,
      issuedBy: req.user._id,
    });
    sendResponse(res, 201, alert, "Alert created");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  POST /api/alerts/panic
const triggerPanic = async (req, res) => {
  const { location } = req.body;
  try {
    if (!location?.lat || !location?.lng) {
      return sendError(res, 400, "Location is required for panic alert");
    }
    const panic = await PanicAlert.create({
      triggeredBy: req.user._id,
      location,
    });
    await panic.populate("triggeredBy", "name matricNumber phone department");
    sendResponse(res, 201, panic, "Panic alert triggered. Security notified.");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  GET /api/alerts/panics  (admin/security only)
const getPanicAlerts = async (req, res) => {
  try {
    const panics = await PanicAlert.find()
      .sort({ createdAt: -1 })
      .populate("triggeredBy", "name matricNumber phone department");
    sendResponse(res, 200, panics);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  PATCH /api/alerts/:id/deactivate  (admin/security only)
const deactivateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!alert) return sendError(res, 404, "Alert not found");
    sendResponse(res, 200, alert, "Alert deactivated");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

module.exports = { getAlerts, createAlert, triggerPanic, getPanicAlerts, deactivateAlert };

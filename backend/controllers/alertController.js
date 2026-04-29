const Alert = require("../models/Alert");
const PanicAlert = require("../models/PanicAlert");

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate("issuedBy", "name role");
    return res.status(200).json({ message: "Success", data: alerts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createAlert = async (req, res) => {
  const { message, severity, location, expiresAt } = req.body;
  try {
    if (!message) return res.status(400).json({ message: "Message is required" });
    const alert = await Alert.create({ message, severity, location, expiresAt, issuedBy: req.user._id });
    return res.status(201).json({ message: "Alert created", data: alert });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const triggerPanic = async (req, res) => {
  const { location } = req.body;
  try {
    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({ message: "Location is required" });
    }
    const panic = await PanicAlert.create({ triggeredBy: req.user._id, location });
    await panic.populate("triggeredBy", "name matricNumber phone department");
    return res.status(201).json({ message: "Panic alert triggered. Security notified.", data: panic });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPanicAlerts = async (req, res) => {
  try {
    const panics = await PanicAlert.find()
      .sort({ createdAt: -1 })
      .populate("triggeredBy", "name matricNumber phone department");
    return res.status(200).json({ message: "Success", data: panics });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updatePanicStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const panic = await PanicAlert.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    ).populate("triggeredBy", "name matricNumber phone department");
    if (!panic) return res.status(404).json({ message: "Panic alert not found" });
    return res.status(200).json({ message: "Status updated", data: panic });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deactivateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    return res.status(200).json({ message: "Alert deactivated", data: alert });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getAlerts, createAlert, triggerPanic, getPanicAlerts, updatePanicStatus, deactivateAlert };

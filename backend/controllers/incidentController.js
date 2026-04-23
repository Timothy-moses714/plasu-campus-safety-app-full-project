const Incident = require("../models/Incident");

const reportIncident = async (req, res) => {
  const { title, description, type, location } = req.body;
  try {
    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required" });
    }
    const incident = await Incident.create({ title, description, type, location, reportedBy: req.user._id });
    await incident.populate("reportedBy", "name matricNumber department");
    return res.status(201).json({ message: "Incident reported", data: incident });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getIncidents = async (req, res) => {
  try {
    const filter = req.user.role === "student" ? { reportedBy: req.user._id } : {};
    const incidents = await Incident.find(filter)
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name matricNumber department");
    return res.status(200).json({ message: "Success", data: incidents });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate("reportedBy", "name matricNumber department phone");
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    return res.status(200).json({ message: "Success", data: incident });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateIncidentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id, { status }, { new: true, runValidators: true }
    );
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    return res.status(200).json({ message: "Status updated", data: incident });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { reportIncident, getIncidents, getIncidentById, updateIncidentStatus };

const Incident = require("../models/Incident");
const { sendResponse, sendError } = require("../utils/sendResponse");

// @route  POST /api/incidents
const reportIncident = async (req, res) => {
  const { title, description, type, location } = req.body;
  try {
    const incident = await Incident.create({
      title, description, type, location,
      reportedBy: req.user._id,
    });
    await incident.populate("reportedBy", "name matricNumber department");
    sendResponse(res, 201, incident, "Incident reported successfully");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  GET /api/incidents
const getIncidents = async (req, res) => {
  try {
    const filter = req.user.role === "student" ? { reportedBy: req.user._id } : {};
    const incidents = await Incident.find(filter)
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name matricNumber department");
    sendResponse(res, 200, incidents);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  GET /api/incidents/:id
const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate("reportedBy", "name matricNumber department phone");
    if (!incident) return sendError(res, 404, "Incident not found");
    sendResponse(res, 200, incident);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// @route  PATCH /api/incidents/:id  (admin/security only)
const updateIncidentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!incident) return sendError(res, 404, "Incident not found");
    sendResponse(res, 200, incident, "Status updated");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

module.exports = { reportIncident, getIncidents, getIncidentById, updateIncidentStatus };

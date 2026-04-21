const express = require("express");
const router = express.Router();
const {
  reportIncident, getIncidents, getIncidentById, updateIncidentStatus,
} = require("../controllers/incidentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/",        protect, reportIncident);
router.get("/",         protect, getIncidents);
router.get("/:id",      protect, getIncidentById);
router.patch("/:id",    protect, adminOnly, updateIncidentStatus);

module.exports = router;

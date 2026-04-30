const express = require("express");
const router = express.Router();
const {
  getRiskZones, classifyZone, autoClassifyAll, deleteRiskZone
} = require("../controllers/riskZoneController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",               protect, getRiskZones);
router.post("/classify",      protect, adminOnly, classifyZone);
router.get("/auto-classify",  protect, adminOnly, autoClassifyAll);
router.delete("/:id",         protect, adminOnly, deleteRiskZone);

module.exports = router;

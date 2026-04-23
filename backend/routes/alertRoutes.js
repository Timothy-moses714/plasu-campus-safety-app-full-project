const express = require("express");
const router = express.Router();
const { getAlerts, createAlert, triggerPanic, getPanicAlerts, deactivateAlert } = require("../controllers/alertController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getAlerts);
router.post("/", protect, adminOnly, createAlert);
router.post("/panic", protect, triggerPanic);
router.get("/panics", protect, adminOnly, getPanicAlerts);
router.patch("/:id/deactivate", protect, adminOnly, deactivateAlert);

module.exports = router;

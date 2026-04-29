const express = require('express');
const router  = express.Router();

const {
  createAlert,
  getAllAlerts,
  getActiveAlerts,
  updateAlertStatus,
  getMyAlerts,
} = require('../controllers/alertController');

const { protect, authorise } = require('../middleware/authMiddleware');

// Student routes
router.post('/',     protect, authorise('student'),                    createAlert);
router.get('/mine',  protect, authorise('student'),                    getMyAlerts);

// Security / Admin routes
router.get('/',      protect, authorise('security', 'admin'),          getAllAlerts);
router.get('/active',protect, authorise('security', 'admin'),          getActiveAlerts);
router.put('/:alertId/status', protect, authorise('security', 'admin'), updateAlertStatus);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateProfile } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, getUserById);
router.patch("/profile", protect, updateProfile);

module.exports = router;

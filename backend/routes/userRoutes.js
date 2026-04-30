const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateProfile, changePassword } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",                protect, adminOnly, getAllUsers);
router.get("/:id",             protect, getUserById);
router.patch("/profile",       protect, updateProfile);
router.patch("/change-password", protect, changePassword);

module.exports = router;

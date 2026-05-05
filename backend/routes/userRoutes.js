const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateProfile, changePassword, deleteUser } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/",                  protect, adminOnly, getAllUsers);
router.get("/:id",               protect, getUserById);
router.patch("/profile",         protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.delete("/:id",            protect, adminOnly, deleteUser);

module.exports = router;

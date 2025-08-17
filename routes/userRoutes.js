const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  updatePassword,
  updateProfile,
  toggleUserActive,
  getUsersByOrg,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");

// Auth
router.post("/signup", signUp);
router.post("/login", login);

// Profile
router.put("/:user_id/password", updatePassword);
router.put("/:user_id/profile", updateProfile);
router.put("/:user_id/active", toggleUserActive);

// Get users
router.get("/org/:org_id", getUsersByOrg);
router.get("/", getAllUsers);
router.get("/:user_id", getUserById)

module.exports = router;

const express = require("express");
const { generateToken, checkToken } = require("../controllers/tokenController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", generateToken);
router.get("/verify", verifyToken, checkToken);

module.exports = router;

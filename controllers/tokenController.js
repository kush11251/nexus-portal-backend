const jwt = require("jsonwebtoken");

// Reusable function to generate token from a user object
const createToken = ({ user_id, email, role, org_id }) => {
  if (!user_id || !role || !email || !org_id) {
    throw new Error("user_id, email, role, org_id are required");
  }
  return jwt.sign({ id: user_id, email, role, org_id }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

// Controller to use as API
const generateToken = (req, res) => {
  try {
    const { user_id, email, role, org_id } = req.body;
    const token = createToken({ user_id, email, role, org_id });
    res.json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Verify Token
const checkToken = (req, res) => {
  res.json({ success: true, message: "Token is valid", user: req.user });
};

module.exports = { generateToken, checkToken, createToken };

const User = require("../models/User");

const { createToken } = require("./tokenController"); 

const signUp = async (req, res) => {
  try {
    const { org_id, email, password, name, phone, dob } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
        statusCode: 400
      });
    }

    const user = await User.create({ org_id, email, password, name, phone, dob });

    res.status(200).json({
      message: "User created",
      statusCode: 200,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        org_id: user.org_id,
      },
      token: createToken(user)
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      statusCode: 500
    });
  }
};

// 2️⃣ Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // include password for comparison
    if (!user) return res.status(401).json({ 
      message: "User not found",
      statusCode: 401
    });

    if (!user.active) {
      return res.status(403).json({
        message: "User is deactivated. Please contact admin.",
        statusCode: 403
      });
    }

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ 
      message: "Invalid credentials",
      statusCode: 401
    });

    // Exclude password before sending response
    const { password: pwd, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      statusCode: 200,
      token: createToken(user),
      user: userData
    });
  } catch (err) {
    res.status(500).json({ 
      message: err.message,
      statusCode: 500
    });
  }
};

// 3️⃣ Update/Reset Password
const updatePassword = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ message: "User not found" });

    // If oldPassword provided, verify it
    if (oldPassword) {
      const match = await user.matchPassword(oldPassword);
      if (!match) return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4️⃣ Update image, dob, phone
const updateProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { imageUrl, dob, phone, name } = req.body;

    const user = await User.findOne({ user_id }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (imageUrl) user.imageUrl = imageUrl;
    if (dob) user.dob = dob;
    if (phone) user.phone = phone;
    if (name) user.name = name;

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5️⃣ Activate / Deactivate user
const toggleUserActive = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { active } = req.body; // boolean

    const user = await User.findOne({ user_id }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.active = active;
    await user.save();
    res.json({ message: `User ${active ? "activated" : "deactivated"}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6️⃣ Get all users from one org
const getUsersByOrg = async (req, res) => {
  try {
    const { org_id } = req.params;
    const users = await User.find({ org_id }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7️⃣ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 8️⃣ Get user by ID
const getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ user_id }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signUp,
  login,
  updatePassword,
  updateProfile,
  toggleUserActive,
  getUsersByOrg,
  getAllUsers,
  getUserById,
};
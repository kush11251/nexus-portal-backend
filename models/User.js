const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  user_id: { type: String, default: uuidv4, index: true, unique: true },
  org_id:  { type: String, required: true, index: true },
  email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:{ type: String, required: true },
  name:    { type: String, trim: true },
  phone:   { type: String, trim: true },
  dob:     { type: Date },
  imageUrl:{ type: String, trim: true },
  role:    { type: String, enum: ["user","admin"], default: "user" },
  active:  { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);

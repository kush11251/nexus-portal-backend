const mongoose = require("mongoose");

const requestLogSchema = new mongoose.Schema({
  method: String,
  url: String,
  status: Number,
  reqHeaders: Object,
  resHeaders: Object,
  reqBody: Object,
  resBody: Object,
  ip: String,
  userId: String,
  durationMs: Number
}, { timestamps: true });

module.exports = mongoose.model("RequestLog", requestLogSchema);

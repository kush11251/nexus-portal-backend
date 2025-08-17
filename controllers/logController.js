const RequestLog = require('../models/RequestLog')
// GET /api/logs?method=GET&status=200&userId=123
const viewAllLogs = async (req, res) => {
  try {
    const filters = {};
    if (req.query.method) filters.method = req.query.method;
    if (req.query.status) filters.status = parseInt(req.query.status);
    if (req.query.url) filters.url = { $regex: req.query.url, $options: "i" };
    if (req.query.userId) filters.userId = req.query.userId;

    const logs = await RequestLog.find(filters).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { viewAllLogs }
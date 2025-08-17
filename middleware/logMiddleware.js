const RequestLog = require("../models/RequestLog");

const logger = async (req, res, next) => {
  // Skip logging the logger API itself
  if (req.url.startsWith("/api/logs")) {
    return next();
  }

  const startTime = Date.now();

  const oldSend = res.send;

  let responseBody;
  res.send = function (data) {
    responseBody = data;
    return oldSend.apply(res, arguments);
  };

  res.on("finish", async () => {
    try {
      const durationMs = Date.now() - startTime;
      const log = new RequestLog({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        reqHeaders: req.headers,
        resHeaders: res.getHeaders(),
        reqBody: req.body,
        resBody: (() => {
          try { return JSON.parse(responseBody || "{}"); }
          catch { return responseBody; }
        })(),
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user?.id || null, // assuming you set req.user somewhere
        durationMs,
      });
      await log.save();
    } catch (err) {
      console.error("Error saving request log:", err);
    }
  });

  next();
};

module.exports = logger;

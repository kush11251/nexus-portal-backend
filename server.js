const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db")
const loggerMiddleware = require("./middleware/logMiddleware");

dotenv.config();
connectDB()

const app = express();
app.use(cors());
app.use(express.json());

// Logger middleware (before other routes)
app.use(loggerMiddleware);

// Routes
app.use("/api/token", require("./routes/tokenRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

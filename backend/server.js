const express = require("express");
const cors = require("cors");
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

// Middleware
app.set("trust proxy", 1);
//
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // credentials: true,
  })
);

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const testRoutes = require("./routes/tests");
const resultRoutes = require("./routes/results");
const insightRoutes = require("./routes/insights");
const adminRoutes = require("./routes/admin");
const motdRoutes = require("./routes/motd");
const dashboardRoutes = require("./routes/dashboard");
const b2bRoutes = require("./routes/b2b");
const docsRoutes = require("./routes/docs");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/motd", motdRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/v1", b2bRoutes);
app.use("/api/docs", docsRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

// hiding header
app.disable("x-powered-by");

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

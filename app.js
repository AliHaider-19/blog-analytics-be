const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

dotenv.config();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const indexRoutes = require("./routes/index.routes");

const app = express();

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 50,
//   message: {
//     success: false,
//     message: "Too many requests, please try again later.",
//   },
// });
// app.use(limiter);

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(morgan("combined"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Blog Analytics API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", indexRoutes);

// Handle undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Analytics Dashboard API Ready`);
});

module.exports = app;

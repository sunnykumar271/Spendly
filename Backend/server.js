// server.js
// ─────────────────────────────────────────────
// The main entry point of the application.
// This file:
//   1. Loads environment variables
//   2. Connects to MongoDB
//   3. Configures Express middleware
//   4. Mounts all routes
//   5. Starts the HTTP server
// ─────────────────────────────────────────────

// Load .env FIRST — before anything else reads process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

// Import Middleware
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// ─────────────────────────────────────────────
// CONNECT TO DATABASE
// ─────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────
// CREATE EXPRESS APP
// ─────────────────────────────────────────────
const app = express();

// Enable CORS so the frontend can call this API.
// Allow a small whitelist (include Vite default and React default ports).
const clientUrl = process.env.CLIENT_URL;
const whitelist = [clientUrl, 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests like curl/postman (no origin)
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ─────────────────────────────────────────────
// BUILT-IN MIDDLEWARE
// express.json() parses incoming JSON request bodies
// so we can access req.body in controllers
// ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// HEALTH CHECK ROUTE
// Useful for deployment platforms to verify the server is running
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "💰 Expense Tracker API is running!",
    version: "1.0.0",
    docs: "See README for API endpoints",
  });
});

// ─────────────────────────────────────────────
// MOUNT ROUTES
// All auth routes → /api/auth/...
// All expense routes → /api/expenses/...
// etc.
// ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budget", budgetRoutes);

// ─────────────────────────────────────────────
// ERROR HANDLING MIDDLEWARE
// Must be LAST — catches all errors from above routes
// ─────────────────────────────────────────────
app.use(notFound);        // 404 handler for unknown routes
app.use(errorHandler);    // global error handler

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});

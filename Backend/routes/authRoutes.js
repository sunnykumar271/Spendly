// routes/authRoutes.js
// ─────────────────────────────────────────────
// Express Router groups related routes together.
// These are all the authentication endpoints.
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (no auth needed)
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Protected route (requires valid JWT)
router.get("/me", protect, getMe);

module.exports = router;

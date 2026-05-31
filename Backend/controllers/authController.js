// controllers/authController.js
// ─────────────────────────────────────────────
// Controllers receive the HTTP request, process it
// (using models and services), and send back a response.
//
// Think of controllers as the "traffic cops" — they
// direct traffic between routes and models.
// ─────────────────────────────────────────────

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");
const { sendOTPEmail } = require("../services/emailService");
const bcrypt = require("bcryptjs");

// ═══════════════════════════════════════════
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ═══════════════════════════════════════════
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Create new user — password is hashed automatically by pre-save hook
    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome 🎉",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error) // <--- add this
    next(error); // passes error to global error handler
  }
};

// ═══════════════════════════════════════════
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ═══════════════════════════════════════════
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user — explicitly select password (it's excluded by default via `select: false`)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error); // <--- add this
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires JWT)
// ═══════════════════════════════════════════
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the authMiddleware
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// FORGOT PASSWORD FLOW — 3 Steps:
// Step 1: forgotPassword  → send OTP to email
// Step 2: verifyOTP       → verify OTP
// Step 3: resetPassword   → set new password
// ═══════════════════════════════════════════

// ── Step 1: Send OTP ──────────────────────
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Security: don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: "If this email exists, an OTP has been sent.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP expiry time (e.g., 10 minutes from now)
    const otpExpiresInMs =
      (parseInt(process.env.OTP_EXPIRES_IN_MINUTES) || 10) * 60 * 1000;

    // Hash the OTP before saving (same reason we hash passwords)
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    user.otp = hashedOTP;
    user.otpExpiry = new Date(Date.now() + otpExpiresInMs);
    user.isOtpVerified = false;
    await user.save({ validateBeforeSave: false }); // skip validation for this update

    // Send OTP via email
    await sendOTPEmail(user.email, otp, user.name);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}. Valid for ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.`,
    });
  } catch (error) {
    next(error);
  }
};

// ── Step 2: Verify OTP ────────────────────
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Fetch user with OTP fields (excluded by default)
    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user || !user.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found. Please request a new OTP.",
      });
    }

    // Check if OTP has expired
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Compare entered OTP with hashed OTP in database
    const isOTPValid = await bcrypt.compare(otp, user.otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // Mark OTP as verified — user can now reset password
    user.isOtpVerified = true;
    user.otp = undefined;       // clear OTP from DB after verification
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully! You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};

// ── Step 3: Reset Password ────────────────
// @route   POST /api/auth/reset-password
// @access  Public (but gated by isOtpVerified)
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your OTP before resetting your password.",
      });
    }

    // Set the new password (pre-save hook will hash it automatically)
    user.password = newPassword;
    user.isOtpVerified = false; // reset the flag
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully! Please log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
};

// models/User.js
// ─────────────────────────────────────────────
// Defines the shape of a User document in MongoDB.
// A "schema" tells Mongoose what fields a document
// should have, their types, and validation rules.
// ─────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,           // removes leading/trailing spaces
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,         // no two users with same email
      lowercase: true,      // always store email in lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,        // never return password in queries by default
    },

    // OTP fields for Forgot Password flow
    otp: {
      type: String,         // stored as hashed string for security
      select: false,
    },
    otpExpiry: {
      type: Date,           // timestamp when OTP expires
      select: false,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,       // becomes true after OTP is verified
    },
  },
  {
    timestamps: true,       // auto-adds createdAt and updatedAt fields
  }
);

// ─────────────────────────────────────────────
// PRE-SAVE HOOK
// Runs automatically BEFORE saving a user document.
// We hash the password here so plain text is NEVER stored.
// ─────────────────────────────────────────────
userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────
// INSTANCE METHOD
// Added to every User document — lets us compare
// a plain password against the stored hash.
// ─────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

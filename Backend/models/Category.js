// models/Category.js
// ─────────────────────────────────────────────
// Each user has their own categories (e.g. Food, Travel).
// "ref: 'User'" creates a relationship between Category
// and the User who owns it — this is a MongoDB "reference".
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [30, "Category name cannot exceed 30 characters"],
    },

    icon: {
      type: String,
      default: "📁",        // optional emoji icon for the category
    },

    color: {
      type: String,
      default: "#6366f1",   // optional hex color for UI display
    },

    // Budget for this category (used in budget management)
    budget: {
      type: Number,
      default: 0,           // 0 means no budget set
      min: [0, "Budget cannot be negative"],
    },

    // Which user owns this category
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",          // references the User model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate category names per user
// compound index: same name is allowed for different users
categorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);

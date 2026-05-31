// models/Expense.js
// ─────────────────────────────────────────────
// The core model — represents a single expense entry.
// References both User (who made it) and Category (what type).
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be at least 0.01"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },

    // References the Category model
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    // References the User model (who owns this expense)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "netbanking", "other"],
      default: "cash",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);

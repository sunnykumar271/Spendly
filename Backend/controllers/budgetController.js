// controllers/budgetController.js
// ─────────────────────────────────────────────
// Budget management — set a budget per category
// and compare it with actual spending.
// ─────────────────────────────────────────────

const Category = require("../models/Category");
const Expense = require("../models/Expense");

// ═══════════════════════════════════════════
// @desc    Set or update budget for a category
// @route   PUT /api/budget/:categoryId
// @access  Private
// ═══════════════════════════════════════════
const setBudget = async (req, res, next) => {
  try {
    const { budget } = req.body;

    if (budget === undefined || budget < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid budget amount (0 or more).",
      });
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.categoryId, user: req.user._id },
      { budget },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Budget set to ₹${budget} for "${category.name}"`,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Get budget vs spending report
// @route   GET /api/budget/report
// @access  Private
// Query params: ?month=2024-01 (YYYY-MM format)
// ═══════════════════════════════════════════
const getBudgetReport = async (req, res, next) => {
  try {
    // Get month from query or use current month
    const { month } = req.query;

    let startDate, endDate;

    if (month) {
      // Parse YYYY-MM format
      const [year, monthNum] = month.split("-").map(Number);
      startDate = new Date(year, monthNum - 1, 1);    // first day of month
      endDate = new Date(year, monthNum, 0);           // last day of month
    } else {
      // Default: current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Get all categories for this user
    const categories = await Category.find({ user: req.user._id });

    // For each category, calculate total spending in the period
    // Promise.all runs all queries in parallel (faster than one-by-one)
    const budgetReport = await Promise.all(
      categories.map(async (cat) => {
        // Aggregate: sum all expenses in this category within date range
        const result = await Expense.aggregate([
          {
            $match: {
              user: req.user._id,
              category: cat._id,
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$amount" }, // sum all amounts
            },
          },
        ]);

        const totalSpent = result[0]?.totalSpent || 0;
        const budgetSet = cat.budget;
        const remaining = budgetSet - totalSpent;
        const percentageUsed = budgetSet > 0
          ? ((totalSpent / budgetSet) * 100).toFixed(1)
          : null;

        return {
          category: {
            id: cat._id,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
          },
          budget: budgetSet,
          spent: totalSpent,
          remaining: remaining,
          percentageUsed: percentageUsed ? `${percentageUsed}%` : "No budget set",
          status:
            budgetSet === 0
              ? "no_budget"
              : totalSpent > budgetSet
              ? "over_budget"    // 🔴 exceeded
              : totalSpent > budgetSet * 0.8
              ? "near_limit"     // 🟡 80% used
              : "on_track",      // 🟢 safe
        };
      })
    );

    res.status(200).json({
      success: true,
      period: { startDate, endDate },
      report: budgetReport,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { setBudget, getBudgetReport };

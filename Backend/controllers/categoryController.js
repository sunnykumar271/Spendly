// controllers/categoryController.js
// ─────────────────────────────────────────────
// CRUD for expense categories.
// Each category belongs to a specific user.
// ─────────────────────────────────────────────

const Category = require("../models/Category");
const Expense = require("../models/Expense");

// ═══════════════════════════════════════════
// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
// ═══════════════════════════════════════════
const createCategory = async (req, res, next) => {
  try {
    const { name, icon, color, budget } = req.body;

    const category = await Category.create({
      name,
      icon,
      color,
      budget,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully!",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Get all categories of the logged-in user
// @route   GET /api/categories
// @access  Private
// ═══════════════════════════════════════════
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
// ═══════════════════════════════════════════
const updateCategory = async (req, res, next) => {
  try {
    const { name, icon, color, budget } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, icon, color, budget },
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
      message: "Category updated successfully!",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
// ═══════════════════════════════════════════
const deleteCategory = async (req, res, next) => {
  try {
    // Check if any expenses use this category
    const expensesUsingCategory = await Expense.countDocuments({
      category: req.params.id,
      user: req.user._id,
    });

    if (expensesUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: ${expensesUsingCategory} expense(s) use this category. Please reassign or delete them first.`,
      });
    }

    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};

// controllers/expenseController.js
// ─────────────────────────────────────────────
// Handles all CRUD operations for Expenses.
// All routes here are PROTECTED — req.user is available
// because authMiddleware runs first.
// ─────────────────────────────────────────────

const Expense = require("../models/Expense");
const Category = require("../models/Category");

// ═══════════════════════════════════════════
// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
// ═══════════════════════════════════════════
const addExpense = async (req, res, next) => {
  try {
    const { title, amount, description, date, category, paymentMethod } = req.body;

    // Verify the category belongs to the logged-in user
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user._id,
    });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found or doesn't belong to you.",
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      description,
      date,
      category,
      paymentMethod,
      user: req.user._id, // automatically associate with logged-in user
    });

    // Populate category details in the response
    await expense.populate("category", "name icon color");

    res.status(201).json({
      success: true,
      message: "Expense added successfully!",
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Get all expenses of the logged-in user
// @route   GET /api/expenses
// @access  Private
// ═══════════════════════════════════════════
const getAllExpenses = async (req, res, next) => {
  try {
    // Extract optional query params for filtering
    const { category, startDate, endDate, paymentMethod } = req.query;

    // Build filter object — always filter by the logged-in user
    const filter = { user: req.user._id };

    if (category) filter.category = category;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    // Date range filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate); // $gte = greater than or equal
      if (endDate) filter.date.$lte = new Date(endDate);     // $lte = less than or equal
    }

    const expenses = await Expense.find(filter)
      .populate("category", "name icon color") // replace category ID with actual data
      .sort({ date: -1 }); // sort by date, newest first

    // Calculate total amount
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalAmount: totalAmount.toFixed(2),
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
// ═══════════════════════════════════════════
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id, // security: ensure expense belongs to this user
    }).populate("category", "name icon color");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    res.status(200).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
// ═══════════════════════════════════════════
const updateExpense = async (req, res, next) => {
  try {
    const { title, amount, description, date, category, paymentMethod } = req.body;

    // findOneAndUpdate: finds and updates in one DB call
    // { new: true } returns the updated document (not the old one)
    // { runValidators: true } runs schema validation on the update
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, amount, description, date, category, paymentMethod },
      { new: true, runValidators: true }
    ).populate("category", "name icon color");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized to update it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully!",
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
// ═══════════════════════════════════════════
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized to delete it.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};

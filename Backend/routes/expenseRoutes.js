// routes/expenseRoutes.js

const express = require("express");
const router = express.Router();
const {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

// All routes here require authentication
// Instead of adding protect to each route, we use router.use()
router.use(protect);

router.route("/").get(getAllExpenses).post(addExpense);

router.route("/:id").get(getExpenseById).put(updateExpense).delete(deleteExpense);

module.exports = router;

// routes/budgetRoutes.js

const express = require("express");
const router = express.Router();
const { setBudget, getBudgetReport } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/report", getBudgetReport);
router.put("/:categoryId", setBudget);

module.exports = router;

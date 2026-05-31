// middleware/errorMiddleware.js
// ─────────────────────────────────────────────
// Global error handler — catches errors thrown anywhere
// in the app (via next(error)) and returns a clean JSON response.
//
// Express recognizes error-handling middleware by its
// 4 parameters: (err, req, res, next)
// ─────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Default to 500 if status code not set
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ── Mongoose: Duplicate key error (e.g., email already exists)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists. Please use a different ${field}.`;
  }

  // ── Mongoose: Validation error (e.g., required field missing)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // ── Mongoose: Invalid ObjectId (e.g., malformed MongoDB ID in URL)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ─────────────────────────────────────────────
// 404 Handler — for routes that don't exist
// ─────────────────────────────────────────────
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };

/**
 * Centralized error handler middleware.
 * Must be the LAST middleware mounted in Express.
 */
const errorHandler = (err, req, res, next) => {
    console.log(`Error: ${err.message}`.red);

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let error = {};

    // ── Mongoose bad ObjectId (CastError) ────────────────────────────────
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Resource not found — invalid ID format";
        error = { kind: err.kind, value: err.value, path: err.path };
    }

    // ── Mongoose duplicate key error ─────────────────────────────────────
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate field value entered for: ${field}`;
        error = { keyValue: err.keyValue };
    }

    // ── Mongoose validation error ────────────────────────────────────────
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = Object.fromEntries(
            Object.entries(err.errors).map(([key, val]) => [key, val.message])
        );
    }

    // ── JWT errors ───────────────────────────────────────────────────────
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token has expired";
    }

    // ── Build response ───────────────────────────────────────────────────
    const response = {
        success: false,
        message,
        error,
    };

    // Show stack trace only in development
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;

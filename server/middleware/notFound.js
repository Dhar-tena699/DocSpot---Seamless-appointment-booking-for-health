/**
 * 404 handler for unknown routes.
 * Must be mounted AFTER all valid route handlers.
 */
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};

module.exports = notFound;

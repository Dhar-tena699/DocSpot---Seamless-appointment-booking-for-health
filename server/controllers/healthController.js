/**
 * @desc    Health check endpoint
 * @route   GET /api/v1/health
 * @access  Public
 */
const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
};

module.exports = { getHealth };

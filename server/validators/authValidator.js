const { body, validationResult } = require("express-validator");

/**
 * Shared middleware — checks validation results and returns 400 if invalid.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((e) => ({
                field: e.path,
                message: e.msg,
            })),
        });
    }
    next();
};

/**
 * Validation rules for POST /api/auth/register
 */
const validateRegister = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    validate,
];

/**
 * Validation rules for POST /api/auth/login
 */
const validateLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    validate,
];

module.exports = { validateRegister, validateLogin, validate };

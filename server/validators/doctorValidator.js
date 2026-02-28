const { body } = require("express-validator");
const { validate } = require("./authValidator");

/**
 * Validation rules for doctor profile creation / update.
 */
const validateDoctorProfile = [
    body("specialization")
        .trim()
        .notEmpty()
        .withMessage("Specialization is required"),
    body("consultationFee")
        .notEmpty()
        .withMessage("Consultation fee is required")
        .isNumeric()
        .withMessage("Consultation fee must be a number"),
    body("availableDays")
        .optional()
        .isArray()
        .withMessage("Available days must be an array"),
    validate,
];

module.exports = { validateDoctorProfile };

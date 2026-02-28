const { body } = require("express-validator");
const { validate } = require("./authValidator");

/**
 * Validation rules for booking an appointment.
 */
const validateBookAppointment = [
    body("doctorId")
        .trim()
        .notEmpty()
        .withMessage("Doctor ID is required")
        .isMongoId()
        .withMessage("Doctor ID must be a valid ObjectId"),
    body("appointmentDate")
        .notEmpty()
        .withMessage("Appointment date is required")
        .isISO8601()
        .withMessage("Appointment date must be a valid date"),
    body("timeSlot")
        .trim()
        .notEmpty()
        .withMessage("Time slot is required"),
    validate,
];

module.exports = { validateBookAppointment };

const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
} = require("../controllers/appointmentController");
const { validateBookAppointment } = require("../validators/appointmentValidator");

const router = express.Router();

router.use(protect, authorizeRoles("patient"));

router.post("/book-appointment", validateBookAppointment, bookAppointment);
router.get("/my-appointments", getMyAppointments);
router.patch("/cancel/:id", cancelAppointment);

module.exports = router;

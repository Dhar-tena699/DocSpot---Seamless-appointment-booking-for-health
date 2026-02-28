const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
    createProfile,
    getMyProfile,
    updateProfile,
    getMyAppointments,
    getAllAvailableDoctors,
    updateAppointmentStatus,
} = require("../controllers/doctorController");
const { validateDoctorProfile } = require("../validators/doctorValidator");

const router = express.Router();

// ─── Public route (patient-accessible) ───────────────────────────────────────
router.get("/get-all-available", protect, getAllAvailableDoctors);

// ─── Doctor-only routes ──────────────────────────────────────────────────────
router.post("/create-profile", protect, authorizeRoles("doctor"), validateDoctorProfile, createProfile);
router.get("/get-my-profile", protect, authorizeRoles("doctor"), getMyProfile);
router.patch("/update-profile", protect, authorizeRoles("doctor"), validateDoctorProfile, updateProfile);
router.get("/get-my-appointments", protect, authorizeRoles("doctor"), getMyAppointments);
router.patch("/update-appointment-status/:id", protect, authorizeRoles("doctor"), updateAppointmentStatus);

module.exports = router;

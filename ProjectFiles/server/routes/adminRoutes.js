const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
    getAllUsers,
    getAllDoctors,
    approveDoctor,
    blockDoctor,
    getAllAppointments,
    approveUser,
} = require("../controllers/adminController");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/get-all-users", getAllUsers);
router.get("/get-all-doctors", getAllDoctors);
router.patch("/approve-doctor/:id", approveDoctor);
router.patch("/block-doctor/:id", blockDoctor);
router.get("/get-all-appointments", getAllAppointments);
router.patch("/approve-user/:id", approveUser);

module.exports = router;

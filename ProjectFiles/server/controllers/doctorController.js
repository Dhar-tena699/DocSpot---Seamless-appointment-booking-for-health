const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

const createProfile = async (req, res, next) => {
    try {
        const existingProfile = await Doctor.findOne({ userId: req.user.id });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Doctor profile already exists",
                data: {},
            });
        }

        const {
            specialization,
            experience,
            consultationFee,
            availableDays,
            availableTimeSlots,
            hospitalName,
            address,
            bio,
        } = req.body;

        if (!specialization || !experience || !consultationFee) {
            return res.status(400).json({
                success: false,
                message: "Please provide specialization, experience, and consultation fee",
                data: {},
            });
        }

        const doctor = await Doctor.create({
            userId: req.user.id,
            specialization,
            experience,
            consultationFee,
            availableDays,
            availableTimeSlots,
            hospitalName,
            address,
            bio,
        });

        res.status(201).json({
            success: true,
            message: "Doctor profile created successfully",
            data: { doctor },
        });
    } catch (error) {
        next(error);
    }
};

const getMyProfile = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id }).populate("userId", "name email phone profileImage isApproved");
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
                data: {},
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor profile retrieved",
            data: { doctor },
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            "specialization",
            "experience",
            "consultationFee",
            "availableDays",
            "availableTimeSlots",
            "hospitalName",
            "address",
            "bio",
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.user.id },
            updates,
            { new: true, runValidators: true }
        ).populate("userId", "name email phone profileImage isApproved");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
                data: {},
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
            data: { doctor },
        });
    } catch (error) {
        next(error);
    }
};

const getMyAppointments = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
                data: {},
            });
        }

        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate("patientId", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Appointments retrieved successfully",
            data: { count: appointments.length, appointments },
        });
    } catch (error) {
        next(error);
    }
};

const getAllAvailableDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({ isAvailable: true })
            .populate("userId", "name email phone profileImage isApproved");

        const approvedDoctors = doctors.filter(
            (doc) => doc.userId && doc.userId.isApproved === true
        );

        res.status(200).json({
            success: true,
            message: "Available doctors retrieved successfully",
            data: { count: approvedDoctors.length, doctors: approvedDoctors },
        });
    } catch (error) {
        next(error);
    }
};

const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["approved", "rejected", "completed"];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${allowedStatuses.join(", ")}`,
                data: {},
            });
        }

        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
                data: {},
            });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
                data: {},
            });
        }

        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this appointment",
                data: {},
            });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: `Appointment ${status} successfully`,
            data: { appointment },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProfile,
    getMyProfile,
    updateProfile,
    getMyAppointments,
    getAllAvailableDoctors,
    updateAppointmentStatus,
};

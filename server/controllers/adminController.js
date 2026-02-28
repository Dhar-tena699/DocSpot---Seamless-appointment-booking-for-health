const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: { count: users.length, users },
        });
    } catch (error) {
        next(error);
    }
};

const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({}).populate("userId", "name email phone profileImage isApproved");

        res.status(200).json({
            success: true,
            message: "Doctors retrieved successfully",
            data: { count: doctors.length, doctors },
        });
    } catch (error) {
        next(error);
    }
};

const approveDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
                data: {},
            });
        }

        doctor.isAvailable = true;
        await doctor.save();

        await User.findByIdAndUpdate(doctor.userId, { isApproved: true });

        const updatedDoctor = await Doctor.findById(req.params.id).populate("userId", "name email phone profileImage isApproved");

        res.status(200).json({
            success: true,
            message: "Doctor approved successfully",
            data: { doctor: updatedDoctor },
        });
    } catch (error) {
        next(error);
    }
};

const blockDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
                data: {},
            });
        }

        doctor.isAvailable = false;
        await doctor.save();

        await User.findByIdAndUpdate(doctor.userId, { isApproved: false });

        const updatedDoctor = await Doctor.findById(req.params.id).populate("userId", "name email phone profileImage isApproved");

        res.status(200).json({
            success: true,
            message: "Doctor blocked successfully",
            data: { doctor: updatedDoctor },
        });
    } catch (error) {
        next(error);
    }
};

const getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({})
            .populate("patientId", "name email phone")
            .populate({
                path: "doctorId",
                populate: { path: "userId", select: "name email" },
            })
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

const approveUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }

        user.isApproved = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User approved successfully",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getAllDoctors,
    approveDoctor,
    blockDoctor,
    getAllAppointments,
    approveUser,
};

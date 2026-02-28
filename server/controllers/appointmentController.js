const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

const bookAppointment = async (req, res, next) => {
    try {
        const { doctorId, appointmentDate, timeSlot, consultationFee } = req.body;

        if (!doctorId || !appointmentDate || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: "Please provide doctorId, appointmentDate, and timeSlot",
                data: {},
            });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
                data: {},
            });
        }

        if (!doctor.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Doctor is not available for appointments",
                data: {},
            });
        }

        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate,
            timeSlot,
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked",
                data: {},
            });
        }

        const appointment = await Appointment.create({
            patientId: req.user.id,
            doctorId,
            appointmentDate,
            timeSlot,
            consultationFee: consultationFee || doctor.consultationFee,
            status: "pending",
            paymentStatus: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: { appointment },
        });
    } catch (error) {
        next(error);
    }
};

const getMyAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id })
            .populate({
                path: "doctorId",
                populate: { path: "userId", select: "name email phone profileImage" },
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

const cancelAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
                data: {},
            });
        }

        if (appointment.patientId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this appointment",
                data: {},
            });
        }

        if (appointment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending appointments can be cancelled",
                data: {},
            });
        }

        appointment.status = "rejected";
        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            data: { appointment },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
};

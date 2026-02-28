const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Patient reference is required"],
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: [true, "Doctor reference is required"],
        },
        appointmentDate: {
            type: Date,
            required: [true, "Appointment date is required"],
        },
        timeSlot: {
            type: String,
            required: [true, "Time slot is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },
        consultationFee: {
            type: Number,
            min: [0, "Fee cannot be negative"],
        },
    },
    { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1, timeSlot: 1 }, { unique: true });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ patientId: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);

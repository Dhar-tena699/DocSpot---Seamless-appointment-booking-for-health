const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },
        specialization: {
            type: String,
            required: [true, "Specialization is required"],
            trim: true,
        },
        experience: {
            type: Number,
            required: [true, "Experience is required"],
            min: [0, "Experience cannot be negative"],
        },
        consultationFee: {
            type: Number,
            required: [true, "Consultation fee is required"],
            min: [0, "Fee cannot be negative"],
        },
        availableDays: {
            type: [String],
            default: [],
        },
        availableTimeSlots: {
            type: [String],
            default: [],
        },
        hospitalName: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        ratings: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

doctorSchema.index({ isAvailable: 1 });
doctorSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Doctor", doctorSchema);

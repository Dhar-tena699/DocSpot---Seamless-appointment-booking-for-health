const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "doctor", "patient"],
            default: "patient",
        },
        phone: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        notifications: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.set("toJSON", {
    transform: function (_doc, ret) {
        delete ret.password;
        return ret;
    },
});

module.exports = mongoose.model("User", userSchema);

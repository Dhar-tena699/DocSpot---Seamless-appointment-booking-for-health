const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and password",
                data: {},
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
                data: {},
            });
        }

        const allowedRoles = ["patient", "doctor", "admin"];
        const userRole = allowedRoles.includes(role) ? role : "patient";

        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
            isApproved: userRole === "patient",
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isApproved: user.isApproved,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
                data: {},
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                data: {},
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                data: {},
            });
        }

        if (user.role === "doctor" && !user.isApproved) {
            return res.status(403).json({
                success: false,
                message: "Doctor not approved yet",
                data: {},
            });
        }

        if (user.role === "admin" && !user.isApproved) {
            return res.status(403).json({
                success: false,
                message: "Admin account pending approval",
                data: {},
            });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isApproved: user.isApproved,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile retrieved",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, getMe };

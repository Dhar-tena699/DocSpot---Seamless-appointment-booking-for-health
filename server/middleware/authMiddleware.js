const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied — no token provided",
                data: {},
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Access denied — user no longer exists",
                data: {},
            });
        }

        req.user = { id: user._id, role: user.role };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Access denied — invalid or expired token",
            data: {},
        });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied — insufficient permissions",
                data: {},
            });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };

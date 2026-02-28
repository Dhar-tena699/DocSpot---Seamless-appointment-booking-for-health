const User = require("../models/userModel");
const colors = require("colors");

/**
 * Seed a default admin account if none exists.
 * Called once on server startup.
 */
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: "admin", email: "admin@docspot.com" });

        if (!adminExists) {
            await User.create({
                name: "Admin",
                email: "admin@docspot.com",
                password: "Admin@123",
                role: "admin",
                isApproved: true,
            });
            console.log("Admin account seeded successfully".green.bold);
        } else if (!adminExists.isApproved) {
            adminExists.isApproved = true;
            await adminExists.save();
            console.log("Admin account approval fixed".green.bold);
        }
    } catch (error) {
        console.log(`Admin seed error: ${error.message}`.red);
    }
};

module.exports = seedAdmin;

const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token with user id and role.
 * @param {string} id   - User's MongoDB _id
 * @param {string} role - User's role (user | doctor | admin)
 * @returns {string}    - Signed JWT token
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

module.exports = generateToken;

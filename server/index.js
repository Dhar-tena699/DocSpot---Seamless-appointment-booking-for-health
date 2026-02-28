const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const seedAdmin = require("./utils/seedAdmin");

// ─── Load environment variables ─────────────────────────────────────────────
dotenv.config();

// ─── Environment Safety — validate required vars ─────────────────────────────
const requiredEnvVars = ["JWT_SECRET", "MONGO_URI"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`FATAL: Missing required env variable: ${envVar}`.red.bold);
        process.exit(1);
    }
}

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

// ─── Connect to MongoDB & seed admin ────────────────────────────────────────
connectDB().then(() => {
    seedAdmin();
});

// ─── Initialize Express ─────────────────────────────────────────────────────
const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());                 // Secure HTTP headers
app.use(mongoSanitize());          // Sanitize body/query against NoSQL injection
app.use(xss());                    // Prevent XSS attacks

// ─── Body Parsing & CORS ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/v1/health", require("./routes/healthRoute"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// ─── 404 Handler (must be after routes, before error handler) ────────────────
app.use(notFound);

// ─── Centralized Error Handler (must be last middleware) ─────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(
        `Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    );
});

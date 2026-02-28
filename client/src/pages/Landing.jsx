import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    CalendarOutlined,
    SafetyCertificateOutlined,
    ClockCircleOutlined,
    LockOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";

const Landing = () => {
    const { isAuthenticated, user } = useAuth();

    const getDashboardLink = () => {
        if (!user) return "/login";
        if (user.role === "admin") return "/admin-dashboard";
        if (user.role === "doctor") return "/doctor-dashboard";
        return "/user-dashboard";
    };

    return (
        <div className="landing-page">
            {/* ─── Navbar ──────────────────────────────────────────────── */}
            <nav className="landing-nav">
                <Link to="/" className="landing-nav-logo">DocSpot</Link>
                <div className="landing-nav-actions">
                    {isAuthenticated ? (
                        <Link to={getDashboardLink()} className="landing-btn-primary">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="landing-btn-text">Login</Link>
                            <Link to="/register" className="landing-btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ─── Hero Section ────────────────────────────────────────── */}
            <section className="landing-hero">
                <div className="landing-hero-content">
                    <span className="landing-hero-tag">HEALTHCARE MADE SIMPLE</span>
                    <h1 className="landing-hero-title">
                        Book Your Doctor<br />
                        <span className="landing-hero-accent">Effortlessly</span>
                    </h1>
                    <p className="landing-hero-desc">
                        Say goodbye to waiting on hold. Browse verified healthcare
                        providers, check real-time availability, and schedule
                        appointments in seconds.
                    </p>
                    <Link to="/register" className="landing-btn-primary landing-btn-lg">
                        Get Started <ArrowRightOutlined />
                    </Link>
                </div>
                <div className="landing-hero-image">
                    <img src="/doctor-hero.png" alt="Trusted Doctor" />
                </div>
            </section>

            {/* ─── Why Choose Us ────────────────────────────────────────── */}
            <section className="landing-features">
                <h2 className="landing-section-title">Why Choose DocSpot?</h2>
                <div className="landing-features-grid">
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <CalendarOutlined />
                        </div>
                        <h3>Easy Booking</h3>
                        <p>Schedule appointments in just a few clicks</p>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <SafetyCertificateOutlined />
                        </div>
                        <h3>Verified Doctors</h3>
                        <p>All healthcare providers are thoroughly vetted</p>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <ClockCircleOutlined />
                        </div>
                        <h3>Real-time Availability</h3>
                        <p>See open slots that fit your schedule</p>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <LockOutlined />
                        </div>
                        <h3>Secure &amp; Private</h3>
                        <p>Your health data is protected</p>
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─────────────────────────────────────────── */}
            <section className="landing-steps">
                <h2 className="landing-section-title">How It Works</h2>
                <div className="landing-steps-grid">
                    <div className="landing-step-card">
                        <span className="landing-step-number">01</span>
                        <h3>Create Account</h3>
                        <p>Sign up in seconds with just your email</p>
                    </div>
                    <div className="landing-step-card">
                        <span className="landing-step-number">02</span>
                        <h3>Find Your Doctor</h3>
                        <p>Browse by specialty, location, or availability</p>
                    </div>
                    <div className="landing-step-card">
                        <span className="landing-step-number">03</span>
                        <h3>Book &amp; Go</h3>
                        <p>Select a time slot and confirm your appointment</p>
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ──────────────────────────────────────────── */}
            <section className="landing-cta">
                <h2>Ready to Get Started?</h2>
                <p>Join thousands of patients who trust DocSpot for their healthcare needs.</p>
                <Link to="/register" className="landing-btn-outline">
                    Get Started Now <ArrowRightOutlined />
                </Link>
            </section>

            {/* ─── Footer ───────────────────────────────────────────────── */}
            <footer className="landing-footer">
                <p>© 2026 DocSpot. Making healthcare accessible for everyone.</p>
            </footer>
        </div>
    );
};

export default Landing;

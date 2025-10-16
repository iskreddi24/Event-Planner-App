import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaHome,
    FaInfoCircle,
    FaBlog,
    FaEnvelope,
    FaSignInAlt,
    FaUserPlus,
    FaTachometerAlt,
    FaUserShield,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaConciergeBell
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

import JueymLogo from '../assets/jueym-logo.png'; // 👈 **CHANGE PATH AS NEEDED**

function NavComponent() {
    const [showLocations, setShowLocations] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { isAuthenticated, user, logout } = useAuth();
    const isAdmin = user && user.role === "admin";

    const closeMenu = () => {
        setIsMenuOpen(false);
        setShowLocations(false);
        setShowServices(false);
    };

    const handleDropdownClick = (e, setDropdown) => {
        if (isMenuOpen) {
            e.preventDefault();
            setDropdown((prev) => !prev);
        }
    };

    return (
        <header className="header-sticky">
            <nav className="navbar">
                {/* 2. REPLACE THE H3 WITH AN IMAGE TAG */}
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>
                        <img src={JueymLogo} alt="JUEYM Web Application Logo" className="logo-img" style={{
                            height: "40px", 
                            width: "auto"
                        }} />
                    </Link>
                </div>

                {/* Mobile Menu Toggler */}
                <button
                    className="menu-toggler"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                {/* Navigation Links */}
                <div className={`nav-links ${isMenuOpen ? "nav-open" : ""}`}>
                    {/* Main Links */}
                    <Link to="/" onClick={closeMenu}>
                        <FaHome className="nav-icon" />Home
                    </Link>
                    <Link to="/about" onClick={closeMenu}>
                        <FaInfoCircle className="nav-icon" />About
                    </Link>
                    <Link to="/blog" onClick={closeMenu}>
                        <FaBlog className="nav-icon" />Blog
                    </Link>

                    {/* SERVICES DROPDOWN (rest of the code is unchanged) */}
                    {/* ... (Your services and contact dropdowns remain the same) ... */}

                    {/* SERVICES DROPDOWN */}
                    <div
                        className="dropdown"
                        onMouseEnter={() => setShowServices(true)}
                        onMouseLeave={() => setShowServices(false)}
                        onClick={(e) => handleDropdownClick(e, setShowServices)}
                    >
                        <Link
                            to="#"
                            className="services-link"
                            onClick={!isMenuOpen ? closeMenu : null}
                        >
                            <FaConciergeBell className="nav-icon" />Services
                        </Link>

                        {(showServices || isMenuOpen) && (
                            <div className="dropdown-menu">
                                <Link to="/exclusive-services" onClick={closeMenu}>
                                    Exclusive Services
                                </Link>
                                <Link to="/decoration" onClick={closeMenu}>
                                    Decoration Services
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* CONTACT DROPDOWN */}
                    <div
                        className="dropdown"
                        onMouseEnter={() => setShowLocations(true)}
                        onMouseLeave={() => setShowLocations(false)}
                        onClick={(e) => handleDropdownClick(e, setShowLocations)}
                    >
                        <Link
                            to="/contact"
                            className="contact-link"
                            onClick={!isMenuOpen ? closeMenu : null}
                        >
                            <FaEnvelope className="nav-icon" />Contact
                        </Link>

                        {(showLocations || isMenuOpen) && (
                            <div className="dropdown-menu">
                                <Link to="/vijayawada" onClick={closeMenu}>Vijayawada</Link>
                                <Link to="/hyderabad" onClick={closeMenu}>Hyderabad</Link>
                                <Link to="/tirupati" onClick={closeMenu}>Tirupati</Link>
                            </div>
                        )}
                    </div>

                    {/* Auth Links */}
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="auth-link admin-link" onClick={closeMenu}>
                                    <FaUserShield className="nav-icon" />Admin Portal
                                </Link>
                            )}

                            <Link to="/dashboard" className="auth-link" onClick={closeMenu}>
                                <FaTachometerAlt className="nav-icon" />Dashboard
                            </Link>

                            <button
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                                className="logout-btn"
                            >
                                <FaSignOutAlt size={20} color="grey" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="auth-link" onClick={closeMenu}>
                                <FaSignInAlt className="nav-icon" />Login
                            </Link>
                            <Link to="/signup" className="auth-link" onClick={closeMenu}>
                                <FaUserPlus className="nav-icon" />Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default NavComponent;
import React, { useState } from "react";
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
    FaConciergeBell,
    FaGem,
    FaPalette,
    FaCalendarCheck // 👈 Icon for Bookings
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/bookingStyles.css"; 

import JueymLogo from '../assets/jueym-logo.png'; 

function NavComponent() {
    const [showBookingsDropdown, setShowBookingsDropdown] = useState(false); 
    const [showServices, setShowServices] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { isAuthenticated, user, logout } = useAuth();
    const isAdmin = user && user.role === "admin";
    const isHallOwner = user && user.role === "hallOwner"; 

    const closeMenu = () => {
        setIsMenuOpen(false);
        setShowBookingsDropdown(false); 
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
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>
                        <img src={JueymLogo} alt="JUEYM Web Application Logo" className="logo-img" style={{
                            height: "40px",
                            width: "auto"
                        }} />
                    </Link>
                </div>

                <button
                    className="menu-toggler"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                <div className={`nav-links ${isMenuOpen ? "nav-open" : ""}`}>
                    {/* Basic Links */}
                    <Link to="/" onClick={closeMenu}>
                        <FaHome className="nav-icon" />Home
                    </Link>
                    <Link to="/about" onClick={closeMenu}>
                        <FaInfoCircle className="nav-icon" />About
                    </Link>
                    <Link to="/blog" onClick={closeMenu}>
                        <FaBlog className="nav-icon" />Blog
                    </Link>

                    {}
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
                                    <FaGem className="nav-icon" /> Exclusive Services
                                </Link>
                                <Link to="/decoration" onClick={closeMenu}>
                                    <FaPalette className="nav-icon" /> Decoration Services
                                </Link>
                                <Link to="/photography" onClick={closeMenu}>
                                    📸 Photoshoot & Video
                                </Link>
                            </div>
                        )}
                    </div>

                    {}
                    <div
                        className="dropdown"
                        onMouseEnter={() => setShowBookingsDropdown(true)}
                        onMouseLeave={() => setShowBookingsDropdown(false)}
                        onClick={(e) => handleDropdownClick(e, setShowBookingsDropdown)}
                    >
                        
                        {}
                        {!isHallOwner && (
                            <Link
                                to="/bookings" 
                                className="bookings-link"
                                onClick={closeMenu}
                            >
                                <FaCalendarCheck className="nav-icon" />Bookings
                            </Link>
                        )}
                        

                        {}
                        {(!isAuthenticated || isMenuOpen) && (
                            <div className="dropdown-menu">
                                
                                {}
                                {!isAuthenticated && (
                                    <>
                                        <Link to="/hall-owner-signup" onClick={closeMenu}>
                                            <FaUserPlus className="nav-icon" /> Hall Owner Sign Up 
                                        </Link>
                                        <Link to="/hall-owner-login" onClick={closeMenu}>
                                            <FaSignInAlt className="nav-icon" /> Hall Owner Login
                                        </Link>
                                    </>
                                )}
                                
                                <Link to="/contact" onClick={closeMenu}>
                                    <FaEnvelope className="nav-icon" /> Contact Us
                                </Link>
                            </div>
                        )}
                    </div>

                    {}
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="auth-link admin-link" onClick={closeMenu}>
                                    <FaUserShield className="nav-icon" />Admin Portal
                                </Link>
                            )}
                            
                            {}
                            <Link to={isHallOwner ? "/owner/dashboard" : "/dashboard"} className="auth-link" onClick={closeMenu}>
                                <FaTachometerAlt className="nav-icon" />Dashboard
                            </Link>

                            <button
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                                className="logout-btn"
                            >
                                <FaSignOutAlt size={20} color="#dc2626" /> Logout
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

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//     FaHome,
//     FaInfoCircle,
//     FaBlog,
//     FaEnvelope,
//     FaSignInAlt,
//     FaUserPlus,
//     FaTachometerAlt,
//     FaUserShield,
//     FaBars,
//     FaTimes,
//     FaSignOutAlt
// } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";

// function NavComponent() {
//     const [showLocations, setShowLocations] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     const { isAuthenticated, user, logout } = useAuth();

//     const isAdmin = user && user.role === "admin";

//     const closeMenu = () => {
//         setIsMenuOpen(false);
//         setShowLocations(false);
//     };

//     const handleDropdownClick = (e) => {
//         if (isMenuOpen) {
//             if (!showLocations) e.preventDefault();
//             setShowLocations(!showLocations);
//         }
//     };

//     return (
//         <header className="header-sticky">
//             <nav className="navbar">
//                 <div className="logo">
//                     <h3>JUEYM</h3>
//                 </div>

//                 { }
//                 <button
//                     className="menu-toggler"
//                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 >
//                     {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//                 </button>

//                 { }
//                 <div className={`nav-links ${isMenuOpen ? "nav-open" : ""}`}>
//                     { }
//                     <Link to="/" onClick={closeMenu}>
//                         <FaHome className="nav-icon" />Home
//                     </Link>
//                     <Link to="/about" onClick={closeMenu}>
//                         <FaInfoCircle className="nav-icon" />About
//                     </Link>
//                     <Link to="/blog" onClick={closeMenu}>
//                         <FaBlog className="nav-icon" />Blog
//                     </Link>

//                     { }
//                     <div
//                         className="dropdown"
//                         onMouseEnter={() => setShowLocations(true)}
//                         onMouseLeave={() => setShowLocations(false)}
//                         onClick={handleDropdownClick}
//                     >
//                         { }
//                         <Link to="/contact" className="contact-link" onClick={!isMenuOpen ? closeMenu : null}>
//                             <FaEnvelope className="nav-icon" />Contact
//                         </Link>

//                         {(showLocations || isMenuOpen) && (
//                             <div className="dropdown-menu">
//                                 <Link to="/vijayawada" onClick={closeMenu}>Vijayawada</Link>
//                                 <Link to="/hyderabad" onClick={closeMenu}>Hyderabad</Link>
//                                 <Link to="/tirupati" onClick={closeMenu}>Tirupati</Link>
//                             </div>
//                         )}
//                     </div>

//                     { }
//                     {isAuthenticated ? (
//                         <>
//                             {isAdmin && (
//                                 <Link to="/admin" className="auth-link admin-link" onClick={closeMenu}>
//                                     <FaUserShield className="nav-icon" />Admin Portal
//                                 </Link>
//                             )}

//                             <Link to="/dashboard" className="auth-link" onClick={closeMenu}>
//                                 <FaTachometerAlt className="nav-icon" />Dashboard
//                             </Link>

//                             <button
//                                 onClick={() => {
//                                     logout();
//                                     closeMenu();
//                                 }}
//                                 className="logout-btn"
//                                 style={{ fontSize: "30", fontWeight: "bold" }}
//                             >
//                                 <FaSignOutAlt size={20} color="grey" />  Logout
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <Link to="/login" className="auth-link" onClick={closeMenu}>
//                                 <FaSignInAlt className="nav-icon" />Login
//                             </Link>
//                             <Link to="/signup" className="auth-link" onClick={closeMenu}>
//                                 <FaUserPlus className="nav-icon" />Sign Up
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </nav>
//         </header>
//     );
// }

// export default NavComponent;
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
    FaStar
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function NavComponent() {
    const [showLocations, setShowLocations] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { isAuthenticated, user, logout } = useAuth();

    const isAdmin = user && user.role === "admin";

    const closeMenu = () => {
        setIsMenuOpen(false);
        setShowLocations(false);
    };

    const handleDropdownClick = (e) => {
        if (isMenuOpen) {
            if (!showLocations) e.preventDefault();
            setShowLocations(!showLocations);
        }
    };

    return (
        <header className="header-sticky">
            <nav className="navbar">
                <div className="logo">
                    <h3>JUEYM</h3>
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
                    
                    {/* NEW LINK: Exclusive Services */}
                    <Link to="/exclusive-services" onClick={closeMenu} className="exclusive-link">
                        <FaStar className="nav-icon text-yellow-500" />Exclusive
                    </Link>

                    {/* Contact & Locations Dropdown */}
                    <div
                        className="dropdown"
                        onMouseEnter={() => setShowLocations(true)}
                        onMouseLeave={() => setShowLocations(false)}
                        onClick={handleDropdownClick}
                    >
                        {/* Contact Link */}
                        <Link to="/contact" className="contact-link" onClick={!isMenuOpen ? closeMenu : null}>
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
                                style={{ fontSize: "30", fontWeight: "bold" }}
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

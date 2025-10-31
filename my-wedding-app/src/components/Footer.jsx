import { useState } from "react";
// Import Link from react-router-dom for navigation
import { Link } from "react-router-dom"; 
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import '../styles/Footer.css';

function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        // NOTE: Replaced window.alert with a simple console log for non-alert systems
        if (email) {
            console.log(`Thanks for subscribing with ${email}!`);
            setEmail("");
        }
    };

    // Removed handleRatingChange and Rating import since we are linking to the full review page

    return (
        <footer id="footerd">
            <div className="footer-grid">
                { /* Company Info */ }
                <div className="mycondiv">
                    <h2>JUEYM Events</h2>
                    <p>
                        Your trusted partner for creating unforgettable memories.
                        We specialize in stress-free event planning for weddings, birthdays,
                        and traditional functions at a minimum cost.
                    </p>
                </div>

                { /* Quick Links */ }
                <div className="mycondiv">
                    <h2>Quick Links</h2>
                    <ul className="footer-links">
                        <li><a href="/about" className="footer-link">About Us</a></li>
                        <li><a href="/blog" className="footer-link">Blog</a></li>
                        <li><a href="/contact" className="footer-link">Contact</a></li>
                        {/* New Link for Review Submission */}
                        <li>
                            <Link to="/submit-review" className="footer-link review-link">
                                Leave a Review
                            </Link>
                        </li>
                    </ul>
                </div>

                { /* Newsletter */ }
                <div className="mycondiv">
                    <h3>Newsletter</h3>
                    <form onSubmit={handleSubscribe} className="newsletter-form">
                        <input
                            type="email"
                            id="emailsubc"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="subbtn">
                            Subscribe
                        </button>
                    </form>
                </div>

                { /* Rating and Social Media */ }
                <div className="mycondiv soclass">
                    <h3>Rate Your Experience</h3>
                    <div className="rating-section">
                        {/* Replaced old Rating component with a dedicated link/button */}
                        <Link to="/submit-review" className="review-btn">
                            Share Your Feedback!
                        </Link>
                    </div>

                    <h3 className="social-title">Connect With Us</h3>
                    <div className="socialMedia">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="iconssocial">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="iconssocial">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="iconssocial">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="iconssocial">
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} JUEYM. All Rights Reserved.</p>
                <p className="paracopy">Designed and Developed with ❤️ for making memories happen.</p>
            </div>
        </footer>
    );
}

export default Footer;
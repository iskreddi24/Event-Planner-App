import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GiBigDiamondRing } from 'react-icons/gi'; 
import '../styles/VIPQuickLink.css';

const VIPQuickLink = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // Check user status

    // --- RENDER LOGIC: Always return the button (no conditional hiding) ---

    const handleRedirect = () => {
        if (!isAuthenticated) {
            // Case 1: NOT LOGGED IN (Guest)
            // Redirect to login, but set a flag to redirect to VIP page afterward.
            sessionStorage.setItem('pendingVIPRedirect', '/vip-wedding');
            navigate('/login');
        } else {
            // Case 2: LOGGED IN (User)
            // Redirect straight to the VIP service page (which is embedded in your HomeComp)
            navigate('/'); // Assuming /vip-wedding component is embedded in the home page
            // If you want to navigate to the specific protected route, use:
            // navigate('/vip-wedding'); 
        }
    };

    return (
        <button 
            className="vip-quick-link-btn"
            onClick={handleRedirect}
            title="Start VIP Wedding Planning"
        >
            <GiBigDiamondRing className="vip-icon" />
            <span className="vip-text">VIP Plan</span>
        </button>
    );
};

export default VIPQuickLink;

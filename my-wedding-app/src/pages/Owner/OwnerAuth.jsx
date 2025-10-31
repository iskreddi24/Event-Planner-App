import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function OwnerAuth({ type = 'login' }) {
    const isLogin = type === 'login';
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        hallName: '',
        location: '',
        area: '',
        capacity: '',
        pricePerDay: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateSignup = () => {
        if (!formData.name || !formData.hallName || !formData.location || !formData.area || !formData.capacity || !formData.pricePerDay) {
            setMessage('Error: All registration fields are required.');
            return false;
        }
        if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
            setMessage('Error: Capacity must be a positive number.');
            return false;
        }
        if (isNaN(Number(formData.pricePerDay)) || Number(formData.pricePerDay) <= 0) {
            setMessage('Error: Price must be a positive number.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Client-side validation for Signup
        if (!isLogin && !validateSignup()) {
            return;
        }

        setLoading(true);

        const endpoint = isLogin ? `${API_URL}/owner/login` : `${API_URL}/owner/signup`;
        const payload = isLogin 
            ? { email: formData.email, password: formData.password } 
            : { // Ensure numeric fields are correctly typed for payload
                ...formData,
                capacity: Number(formData.capacity),
                pricePerDay: Number(formData.pricePerDay)
              };

        try {
            const res = await axios.post(endpoint, payload);

            // --- SUCCESS LOGIC ---
            if (isLogin) {
                const { owner, token } = res.data;

                const ownerUser = {
                    ...owner,
                    role: 'hallOwner',
                };

                login(ownerUser, token);

                setMessage('Login successful! Redirecting to dashboard...');

                // 🔑 Confirmed Redirection: Navigate to the DEDICATED owner dashboard
                setTimeout(() => {
                    navigate('/owner/dashboard');
                }, 500);

            } else {
                // Successful Registration
                setMessage('Registration successful! Please log in with your credentials.');
                setFormData({ email: '', password: '', name: '', hallName: '', location: '', area: '', capacity: '', pricePerDay: '' }); 
                
                // Navigate to the login page
                setTimeout(() => {
                    navigate('/hall-owner-login');
                }, 1500);
            }

            console.log("Auth Response:", res.data);

        } catch (err) {
            setMessage(`Error: ${err.response?.data?.message || 'Failed to connect to server.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-view" style={{ maxWidth: '600px', margin: 'auto' }}>
            <h2 className="booking-title">{isLogin ? 'Function Hall Owner Login' : 'Function Hall Owner Sign Up'}</h2>

            {message && <p className="section-title" style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                
                {!isLogin && (
                    <input type="text" name="name" placeholder="Owner Name" value={formData.name} onChange={handleChange} required />
                )}
                
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

                {!isLogin && (
                    <>
                        {/* Note: changed type to 'number' for client-side keyboard ease */}
                        <input type="text" name="hallName" placeholder="Function Hall Name" value={formData.hallName} onChange={handleChange} required />
                        <input type="text" name="location" placeholder="State/City (e.g., Andhra Pradesh)" value={formData.location} onChange={handleChange} required />
                        <input type="text" name="area" placeholder="Area/Sub-District (e.g., Vijayawada)" value={formData.area} onChange={handleChange} required />
                        <input type="number" name="capacity" placeholder="Capacity (Max Guests)" value={formData.capacity} onChange={handleChange} required min="1" />
                        <input type="number" name="pricePerDay" placeholder="Price Per Day (INR)" value={formData.pricePerDay} onChange={handleChange} required min="1" />
                    </>
                )}

                <button type="submit" className="proceed-button" disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register Hall')}
                </button>
            </form>
        </div>
    );
}
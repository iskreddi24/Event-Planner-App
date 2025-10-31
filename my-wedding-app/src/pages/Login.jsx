import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../utils/axiosClient';
import '../styles/Auth.css';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Note: Using a custom modal/message box is preferable over alert()
        if (!formData.email || !formData.password) {
            alert("Please fill in both email and password.");
            return;
        }

        try {
            // Assumes a /auth/login route handles regular users
            const { data } = await axiosClient.post('/auth/login', formData);

            if (data?.token && data?.user) {
                localStorage.setItem('token', data.token);

                // Note: Ensure your login function in AuthContext accepts (user, token) or similar.
                // Based on your original code: login(data.token, data.user);
                // Based on the recommended AuthContext: login(data.user, data.token);
                // I will use the format from the recommended AuthContext:
                login(data.user, data.token);

                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert('Login failed: Invalid server response.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            const errMsg = error.response?.data?.message || 'An error occurred during login.';
            alert(errMsg);
        }
    };

    return (
        <div className="auth-page">
            <h1 className="auth-title">Login to Your Account (User)</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="auth-btn">Login</button>
                
                <p className="auth-link-text">
                    Don't have an account? <Link to="/signup">Sign Up here</Link>
                </p>
                
                {/* NEW: Explicit link to the Hall Owner Login */}
                <p className="auth-link-text owner-switch-link">
                    Are you a **Function Hall Owner**? <Link to="/hall-owner-login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;

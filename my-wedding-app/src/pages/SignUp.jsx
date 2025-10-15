import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import '../styles/Auth.css';

function SignUp() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosClient.post('/auth/register', formData);

            if (data?.token && data?.user) {
                localStorage.setItem('token', data.token);
                alert('Registration successful!');
                navigate('/login');
            } else {
                alert('Registration failed: Invalid server response.');
            }
        } catch (error) {
            console.error('Sign Up Error:', error);
            alert(error.response?.data?.message || 'An error occurred during registration.');
        }
    };

    return (
        <div className="auth-page">
            <h1 className="auth-title">Create Your Account</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <button type="submit" className="auth-btn">Sign Up</button>
                <p className="auth-link-text">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default SignUp;

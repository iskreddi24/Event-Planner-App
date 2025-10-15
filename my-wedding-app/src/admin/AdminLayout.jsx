import React from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Admin.css";

function AdminLayout() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const isAdmin = user?.role === "admin";
    if (!isAdmin) {
        return (
            <div className="admin-access-denied">
                <h1>Access Denied</h1>
                <p>You do not have administrative privileges.</p>
                <button onClick={() => navigate("/dashboard")}>Go to User Dashboard</button>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h2>Admin Dashboard</h2>
                <div className="user-info">
                    <span>Welcome, {user?.name} {user?.role === "admin" && "(Admin)"}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </header>
            <main className="admin-main">
                <nav className="admin-sidebar">
                    <button onClick={() => navigate("/admin")}>Inquiries</button>
                </nav>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;

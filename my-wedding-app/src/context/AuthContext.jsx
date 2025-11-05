import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 On mount, restore session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // 🔹 Login
  const login = (userData, token) => {
    const normalizedUser = {
      ...userData,
      _id: userData._id || userData.id, // ensure consistent _id
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", token);
    setUser(normalizedUser);
    setIsAuthenticated(true);

    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);

    delete axiosClient.defaults.headers.common["Authorization"];
  };

  const value = { isAuthenticated, user, loading, login, logout };

  if (loading) return <div>Loading authentication state...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

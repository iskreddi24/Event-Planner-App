// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(null);

//     useEffect(() => {
//         const savedToken = localStorage.getItem("token");
//         const savedUser = localStorage.getItem("user");

//         if (savedToken && savedUser) {
//             setToken(savedToken);
//             setUser(JSON.parse(savedUser));
//         }
//     }, []);

//     const login = (token, user) => {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         setToken(token);
//         setUser(user);
//     };

//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setToken(null);
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Custom Hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. Auth Provider Component (where the hook error is pointing)
export const AuthProvider = ({ children }) => {
  // Line 6 of your error points here, where useState or useContext is likely called.
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Example: Check local storage for token/user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user from storage:", error);
        // Clear bad data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Login function placeholder
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function placeholder
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  // Don't render children until authentication status is checked
  if (loading) {
      return <div>Loading authentication state...</div>; 
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// ====== Components ======
import NavComponent from "./components/NavComponent";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import LogoIntro from "./components/LogoIntro";
import QueryChatbot from "./components/QueryChatbot";
import MainBookingView from './components/BookingModule/MainBookingView'; 

// ====== Pages ======
import HomeComp from "./pages/HomeComp";
import AboutComp from "./pages/AboutComp";
import BlogComp from "./pages/BlogComp";
import ContactComp from "./pages/ContactComp";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ExclusiveOffers from "./pages/ExclusiveOffers";
import ExclusiveServicesComp from "./pages/ExclusiveServicesComp";
import DecorationServiceComp from "./pages/DecorationServiceComp";
import PhotographyServiceComp from './pages/PhotographyServiceComp';
// Review pages
import ReviewFormPage from './pages/ReviewFormPage';
import CustomerReviewsPage from './pages/CustomerReviewsPage'; 
import ReviewContainerPage from './pages/ReviewContainerPage';
// NEW IMPORTS FOR OWNER
import OwnerAuth from './pages/Owner/OwnerAuth'; 
import OwnerDashboard from "./pages/Owner/OwnerDashboard"; 

// ====== Location Pages ======
import HyderabadComp from "./pages/locations/HyderabadComp";
import TirupatiComp from "./pages/locations/TirupatiComp";
import VijayawadaComp from "./pages/locations/VijayawadaComp";

// ====== Admin ======
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/adminDashboard";

// ====== Auth Context ======
import { AuthProvider, useAuth } from "./context/AuthContext";


// ====== Protected Route Components (User, Admin, Owner) ======

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    return isAuthenticated && user?.role === "admin"
        ? children
        : <Navigate to="/login" replace />;
};

// 🔑 NEW: Protected Route for Hall Owners
const OwnerRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    return isAuthenticated && user?.role === "hallOwner"
        ? children
        : <Navigate to="/hall-owner-login" replace />;
};

// ====== Main Layout ======
const MainLayout = ({ children }) => (
    <>
        <NavComponent />
        <main className="main-content">{children}</main>
        <Footer />
    </>
);

function App() {
    // Note: Reading user from localStorage directly is often discouraged in React for state management, 
    // but preserving the user's implementation choice here.
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <AuthProvider>
            { /* Introductory Logo */}
            <LogoIntro />

            <Router>
                {/* Conditionally render Chatbot if user exists */}
                {user && <QueryChatbot user={user} />}

                <Routes>
                    {/* ---------- Public Routes ---------- */}
                    <Route path="/" element={<MainLayout><HomeComp /></MainLayout>} />
                    <Route path="/about" element={<MainLayout><AboutComp /></MainLayout>} />
                    <Route path="/blog" element={<MainLayout><BlogComp /></MainLayout>} />
                    <Route path="/contact" element={<MainLayout><ContactComp /></MainLayout>} />

                    {/* NEW: Public Route for Viewing All Reviews */}
                    <Route path="/customer-reviews" element={<MainLayout><CustomerReviewsPage /></MainLayout>} />

                    {/* ---------- Locations ---------- */}
                    <Route path="/hyderabad" element={<MainLayout><HyderabadComp /></MainLayout>} />
                    <Route path="/tirupati" element={<MainLayout><TirupatiComp /></MainLayout>} />
                    <Route path="/vijayawada" element={<MainLayout><VijayawadaComp /></MainLayout>} />

                    {/* ---------- Auth Routes (User) ---------- */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* NEW: Hall Owner Authentication (Public Routes) */}
                    <Route path="/hall-owner-signup" element={<OwnerAuth type="signup" />} />
                    <Route path="/hall-owner-login" element={<OwnerAuth type="login" />} />

                    {/* 🔑 NEW: Protected Owner Dashboard Route */}
                    <Route 
                        path="/owner/dashboard" 
                        element={<OwnerRoute><MainLayout><OwnerDashboard /></MainLayout></OwnerRoute>} 
                    />

                    {/* ---------- Protected User Routes ---------- */}
                    {/* Standard User Dashboard - NOTE: You may want to split Dashboard logic based on role here */}
                    <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
                    
                    {/* Booking route (only accessible to regular authenticated users) */}
                    <Route path="/bookings" element={<ProtectedRoute><MainLayout><MainBookingView /></MainLayout></ProtectedRoute>} />

                    {/* Protected Route for Review submission */}
                    <Route
                        path="/submit-review"
                        element={<ProtectedRoute><MainLayout><ReviewContainerPage /></MainLayout></ProtectedRoute>}
                    />

                    {/* ---------- Service Routes (All using MainLayout) ---------- */}
                    <Route path="/exclusive-services" element={<MainLayout><ExclusiveServicesComp /></MainLayout>} />
                    <Route path="/exclusive" element={<Navigate to="/exclusive-services" replace />} />
                    <Route path="/decoration" element={<MainLayout><DecorationServiceComp /></MainLayout>} />
                    <Route path="/photography" element={<MainLayout><PhotographyServiceComp /></MainLayout>} />

                    {/* ---------- Exclusive Offers ---------- */}
                    <Route path="/exclusive-offers" element={<MainLayout><ExclusiveOffers /></MainLayout>} />

                    {/* ---------- Admin Routes ---------- */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                        <Route index element={<AdminDashboard />} />
                    </Route>

                    {/* ---------- 404 Page ---------- */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

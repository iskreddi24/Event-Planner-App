import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import NavComponent from "./components/NavComponent";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import LogoIntro from "./components/LogoIntro";
import QueryChatbot from "./components/QueryChatbot";
import MainBookingView from "./components/BookingModule/MainBookingView";
import VIPQuickLink from "./components/VIPQuickLink";

import StoreFront from "./components/EventStore/StoreFront";
import CartPage from "./components/EventStore/CartPage";
import CheckoutPage from "./components/EventStore/CheckoutPage";
import SwiperSection from "./components/EventStore/SwiperSection";

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
import PhotographyServiceComp from "./pages/PhotographyServiceComp";
import VIPWeddingServiceComp from "./pages/VIPWeddingServiceComp";

import ReviewFormPage from "./pages/ReviewFormPage";
import CustomerReviewsPage from "./pages/CustomerReviewsPage";
import ReviewContainerPage from "./pages/ReviewContainerPage";

import OwnerAuth from "./pages/Owner/OwnerAuth";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";

import HyderabadComp from "./pages/locations/HyderabadComp";
import TirupatiComp from "./pages/locations/TirupatiComp";
import VijayawadaComp from "./pages/locations/VijayawadaComp";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminStoreManagement from "./admin/AdminStoreManagement";
import StoreQuickLink from "./components/StoreQuickLink";
import FloatingCartButton from "./components/FloatingCartButton";

// ====== Contexts ======
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // ✅ Import CartProvider
import OrdersPage from "./pages/OrdersPage";

// ====== Protected Routes ======
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

const OwnerRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "hallOwner"
    ? children
    : <Navigate to="/hall-owner-login" replace />;
};

// ====== Layout ======
const MainLayout = ({ children }) => (
  <>
    <NavComponent />
    <main className="main-content">{children}</main>
    <Footer />
  </>
);

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AuthProvider>
      <CartProvider> {/* ✅ CartProvider wraps Router + all routes */}
        <LogoIntro />
        <Router>
          <VIPQuickLink />

          <StoreQuickLink />
          { }
          <FloatingCartButton />
          {/* {user && <QueryChatbot user={user} />} */}

          <Routes>
            {/* ----------  Public Pages ---------- */}
            <Route path="/" element={<MainLayout><HomeComp /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutComp /></MainLayout>} />
            <Route path="/blog" element={<MainLayout><BlogComp /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactComp /></MainLayout>} />
            <Route path="/customer-reviews" element={<MainLayout><CustomerReviewsPage /></MainLayout>} />

            {/* ----------  Locations ---------- */}
            <Route path="/hyderabad" element={<MainLayout><HyderabadComp /></MainLayout>} />
            <Route path="/tirupati" element={<MainLayout><TirupatiComp /></MainLayout>} />
            <Route path="/vijayawada" element={<MainLayout><VijayawadaComp /></MainLayout>} />

            {/* ----------  Auth ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/hall-owner-signup" element={<OwnerAuth type="signup" />} />
            <Route path="/hall-owner-login" element={<OwnerAuth type="login" />} />

            {/* ----------  Owner ---------- */}
            <Route
              path="/owner/dashboard"
              element={<OwnerRoute><MainLayout><OwnerDashboard /></MainLayout></OwnerRoute>}
            />

            {/* ----------  Protected User ---------- */}
            <Route
              path="/vip-wedding"
              element={<ProtectedRoute><MainLayout><VIPWeddingServiceComp /></MainLayout></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>}
            />
            <Route
              path="/bookings"
              element={<ProtectedRoute><MainLayout><MainBookingView /></MainLayout></ProtectedRoute>}
            />
            <Route
              path="/submit-review"
              element={<ProtectedRoute><MainLayout><ReviewContainerPage /></MainLayout></ProtectedRoute>}
            />

            {/* ----------  Services ---------- */}
            <Route path="/exclusive-services" element={<MainLayout><ExclusiveServicesComp /></MainLayout>} />
            <Route path="/exclusive" element={<Navigate to="/exclusive-services" replace />} />
            <Route path="/decoration" element={<MainLayout><DecorationServiceComp /></MainLayout>} />
            <Route path="/photography" element={<MainLayout><PhotographyServiceComp /></MainLayout>} />
            <Route path="/exclusive-offers" element={<MainLayout><ExclusiveOffers /></MainLayout>} />

            {/* ----------  Event Store ---------- */}
            <Route path="/store" element={<MainLayout><StoreFront /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
            <Route
              path="/orders"
              element={<MainLayout><OrdersPage /></MainLayout>}
            />

            {/* ----------  Admin ---------- */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="store" element={<AdminStoreManagement />} />
            </Route>

            {/* ---------- 404 ---------- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

// // // src/App.jsx
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import './App.css';

// // // Components
// // import NavComponent from './components/NavComponent';
// // import Footer from "./components/Footer";
// // import NotFound from "./components/NotFound";

// // // Pages
// // import HomeComp from "./pages/HomeComp";
// // import AboutComp from './pages/AboutComp';
// // import BlogComp from './pages/BlogComp';
// // import ContactComp from './pages/ContactComp';
// // import Login from "./pages/Login";
// // import SignUp from "./pages/SignUp";
// // import Dashboard from "./pages/Dashboard";
// // import BookingsPage from './pages/BookingsPage';

// // // Location Pages
// // import HyderabadComp from "./pages/locations/HyderabadComp";
// // import TirupatiComp from "./pages/locations/TirupatiComp";
// // import VijayawadaComp from "./pages/locations/VijayawadaComp";

// // // Admin
// // import AdminDashboard from "./admin/AdminDashboard";
// // import AdminLayout from "./admin/AdminLayout";

// // // Auth
// // import { AuthProvider, useAuth } from "./context/AuthContext";

// // // ====== PROTECTED ROUTE HOOKS ======
// // const ProtectedRoute = ({ children }) => {
// //     const { isAuthenticated } = useAuth();
// //     if (!isAuthenticated) return <Navigate to="/login" replace />;
// //     return children;
// // };

// // const AdminRoute = ({ children }) => {
// //     const { isAuthenticated, user } = useAuth();
// //     if (!isAuthenticated || user?.role !== "admin") {
// //         return <Navigate to="/login" replace />;
// //     }
// //     return children;
// // };

// // // ====== LAYOUT COMPONENT ======
// // const MainLayout = ({ children }) => (
// //     <>
// //         <NavComponent />
// //         <main className="main-content">{children}</main>
// //         <Footer />
// //     </>
// // );

// // function App() {
// //     return (
// //         <AuthProvider>
// //             <Router>
// //                 <Routes>
// //                     {/* Public routes with MainLayout */}
// //                     <Route
// //                         path="/"
// //                         element={
// //                             <MainLayout>
// //                                 <HomeComp />
// //                             </MainLayout>
// //                         }
// //                     />
// //                     <Route
// //                         path="/about"
// //                         element={
// //                             <MainLayout>
// //                                 <AboutComp />
// //                             </MainLayout>
// //                         }
// //                     />
// //                     <Route
// //                         path="/blog"
// //                         element={
// //                             <MainLayout>
// //                                 <BlogComp />
// //                             </MainLayout>
// //                         }
// //                     />
// //                     <Route
// //                         path="/contact"
// //                         element={
// //                             <MainLayout>
// //                                 <ContactComp />
// //                             </MainLayout>
// //                         }
// //                     />
// //                     <Route
// //                         path="/vijayawada"
// //                         element={
// //                             <MainLayout>
// //                                 <VijayawadaComp />
// //                             </MainLayout>
// //                         }
// //                     />
// //                     <Route
// //                         path="/hyderabad"
// //                         element={
// //                             <MainLayout>
// //                                 <HyderabadComp />
// //                             </MainLayout>
// //                         }
// //                     />
// //                     <Route
// //                         path="/tirupati"
// //                         element={
// //                             <MainLayout>
// //                                 <TirupatiComp />
// //                             </MainLayout>
// //                         }
// //                     />

// //                     {/* Auth pages (no footer/nav during auth flow - optional) */}
// //                     <Route path="/login" element={<Login />} />
// //                     <Route path="/signup" element={<SignUp />} />

// //                     {/* Protected user routes */}
// //                     <Route
// //                         path="/dashboard"
// //                         element={
// //                             <ProtectedRoute>
// //                                 <MainLayout>
// //                                     <Dashboard />
// //                                 </MainLayout>
// //                             </ProtectedRoute>
// //                         }
// //                     />
// //                     <Route
// //                         path="/bookings"
// //                         element={
// //                             <ProtectedRoute>
// //                                 <MainLayout>
// //                                     <BookingsPage />
// //                                 </MainLayout>
// //                             </ProtectedRoute>
// //                         }
// //                     />

// //                     {/* Admin routes */}
// //                     <Route
// //                         path="/admin/*"
// //                         element={
// //                             <AdminRoute>
// //                                 <AdminLayout />
// //                             </AdminRoute>
// //                         }
// //                     />

// //                     {/* 404 */}
// //                     <Route path="*" element={<NotFound />} />
// //                 </Routes>
// //             </Router>
// //         </AuthProvider>
// //     );
// // }

// // export default App;
// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import './App.css';

// // Components
// import NavComponent from './components/NavComponent';
// import Footer from "./components/Footer";
// import NotFound from "./components/NotFound";
// import ExclusiveOffers from "./pages/ExclusiveOffers";

// import HomeComp from "./pages/HomeComp";
// import AboutComp from './pages/AboutComp';
// import BlogComp from './pages/BlogComp';
// import ContactComp from './pages/ContactComp';
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import Dashboard from "./pages/Dashboard";
// import BookingsPage from './pages/BookingsPage';

// import HyderabadComp from "./pages/locations/HyderabadComp";
// import TirupatiComp from "./pages/locations/TirupatiComp";
// import VijayawadaComp from "./pages/locations/VijayawadaComp";

// import AdminDashboard from "./admin/AdminDashboard";
// import AdminLayout from "./admin/AdminLayout";

// import { AuthProvider, useAuth } from "./context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//     const { isAuthenticated } = useAuth();
//     if (!isAuthenticated) return <Navigate to="/login" replace />;
//     return children;
// };

// const AdminRoute = ({ children }) => {
//     const { isAuthenticated, user } = useAuth();
//     if (!isAuthenticated || user?.role !== "admin") {
//         return <Navigate to="/login" replace />;
//     }
//     return children;
// };

// // ====== LAYOUT COMPONENT ======
// const MainLayout = ({ children }) => (
//     <>
//         <NavComponent />
//         <main className="main-content">{children}</main>
//         <Footer />
//     </>
// );

// function App() {
//     return (
//         <AuthProvider>
//             <Router>
//                 <Routes>
//                     {/* Public routes with MainLayout */}
//                     <Route
//                         path="/"
//                         element={
//                             <MainLayout>
//                                 <HomeComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/about"
//                         element={
//                             <MainLayout>
//                                 <AboutComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/blog"
//                         element={
//                             <MainLayout>
//                                 <BlogComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/contact"
//                         element={
//                             <MainLayout>
//                                 <ContactComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/vijayawada"
//                         element={
//                             <MainLayout>
//                                 <VijayawadaComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/hyderabad"
//                         element={
//                             <MainLayout>
//                                 <HyderabadComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/tirupati"
//                         element={
//                             <MainLayout>
//                                 <TirupatiComp />
//                             </MainLayout>
//                         }
//                     />

//                     {/* Auth pages (no footer/nav during auth flow - optional) */}
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/signup" element={<SignUp />} />

//                     {/* Protected user routes */}
//                     <Route
//                         path="/dashboard"
//                         element={
//                             <ProtectedRoute>
//                                 <MainLayout>
//                                     <Dashboard />
//                                 </MainLayout>
//                             </ProtectedRoute>
//                         }
//                     />
//                     <Route
//                         path="/bookings"
//                         element={
//                             <ProtectedRoute>
//                                 <MainLayout>
//                                     <BookingsPage />
//                                 </MainLayout>
//                             </ProtectedRoute>
//                         }
//                     />
//                     {/*  Exclusive Offers Page (Protected or Public — your choice) */}
//                     <Route
//                         path="/exclusive-offers"
//                         element={
//                             <MainLayout>
//                                 <ExclusiveOffers />
//                             </MainLayout>
//                         }
//                     />
//                     {/* 🎯 FIXED ADMIN ROUTES: Using nested routes for AdminLayout and Outlet */}
//                     <Route
//                         path="/admin"
//                         element={
//                             <AdminRoute>
//                                 <AdminLayout />
//                             </AdminRoute>
//                         }
//                     >
//                         {/* This will render AdminDashboard inside AdminLayout's Outlet at /admin */}
//                         <Route index element={<AdminDashboard />} />
//                     </Route>

//                     {/* 404 */}
//                     <Route path="*" element={<NotFound />} />
//                 </Routes>
//             </Router>
//         </AuthProvider>
//     );
// }

// export default App;
// src/App.jsx










// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";

// // ====== Components ======
// import NavComponent from "./components/NavComponent";
// import Footer from "./components/Footer";
// import NotFound from "./components/NotFound";

// // ====== Pages ======
// import HomeComp from "./pages/HomeComp";
// import AboutComp from "./pages/AboutComp";
// import BlogComp from "./pages/BlogComp";
// import ContactComp from "./pages/ContactComp";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import Dashboard from "./pages/Dashboard";
// import BookingsPage from "./pages/BookingsPage";
// import ExclusiveOffers from "./pages/ExclusiveOffers";

// // ====== Location Pages ======
// import HyderabadComp from "./pages/locations/HyderabadComp";
// import TirupatiComp from "./pages/locations/TirupatiComp";
// import VijayawadaComp from "./pages/locations/VijayawadaComp";
// import ExclusiveServicesComp from "./pages/ExclusiveServicesComp";
// // ====== Admin ======
// import AdminLayout from "./admin/AdminLayout";
// import AdminDashboard from "./admin/AdminDashboard";

// // ====== Auth Context ======
// import { AuthProvider, useAuth } from "./context/AuthContext";

// // ====== Protected Route Components ======
// const ProtectedRoute = ({ children }) => {
//     const { isAuthenticated } = useAuth();
//     return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// const AdminRoute = ({ children }) => {
//     const { isAuthenticated, user } = useAuth();
//     return isAuthenticated && user?.role === "admin"
//         ? children
//         : <Navigate to="/login" replace />;
// };

// // ====== Main Layout ======
// const MainLayout = ({ children }) => (
//     <>
//         <NavComponent />
//         <main className="main-content">{children}</main>
//         <Footer />
//     </>
// );

// // ====== App Component ======
// function App() {
//     return (
//         <AuthProvider>
//             <Router>
//                 <Routes>
//                     {/* ---------- Public Routes ---------- */}
//                     <Route
//                         path="/"
//                         element={
//                             <MainLayout>
//                                 <HomeComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/about"
//                         element={
//                             <MainLayout>
//                                 <AboutComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/blog"
//                         element={
//                             <MainLayout>
//                                 <BlogComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/contact"
//                         element={
//                             <MainLayout>
//                                 <ContactComp />
//                             </MainLayout>
//                         }
//                     />

//                     {/* ---------- Locations ---------- */}
//                     <Route
//                         path="/hyderabad"
//                         element={
//                             <MainLayout>
//                                 <HyderabadComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/tirupati"
//                         element={
//                             <MainLayout>
//                                 <TirupatiComp />
//                             </MainLayout>
//                         }
//                     />
//                     <Route
//                         path="/vijayawada"
//                         element={
//                             <MainLayout>
//                                 <VijayawadaComp />
//                             </MainLayout>
//                         }
//                     />

//                     {/* ---------- Auth Routes ---------- */}
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/signup" element={<SignUp />} />

//                     {/* ---------- Protected User Routes ---------- */}
//                     <Route
//                         path="/dashboard"
//                         element={
//                             <ProtectedRoute>
//                                 <MainLayout>
//                                     <Dashboard />
//                                 </MainLayout>
//                             </ProtectedRoute>
//                         }
//                     />
//                     <Route
//                         path="/bookings"
//                         element={
//                             <ProtectedRoute>
//                                 <MainLayout>
//                                     <BookingsPage />
//                                 </MainLayout>
//                             </ProtectedRoute>
//                         }
//                     />

//                     {/* ---------- Exclusive Offers (Public/Protected - your choice) ---------- */}
//                     <Route
//                         path="/exclusive-offers"
//                         element={
//                             <MainLayout>
//                                 <ExclusiveOffers />
//                             </MainLayout>
//                         }
//                     />
//                     {/* Other routes */}
//                     <Route path="/exclusive" element={<ExclusiveServicesComp />} />

//                     {/* ---------- Admin Routes (with Outlet inside AdminLayout) ---------- */}
//                     <Route
//                         path="/admin"
//                         element={
//                             <AdminRoute>
//                                 <AdminLayout />
//                             </AdminRoute>
//                         }
//                     >
//                         <Route index element={<AdminDashboard />} />
//                     </Route>

//                     {/* ---------- 404 Page ---------- */}
//                     <Route path="*" element={<NotFound />} />
//                 </Routes>
//             </Router>
//         </AuthProvider>
//     );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// ====== Components ======
import NavComponent from "./components/NavComponent";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import LogoIntro from "./components/LogoIntro";
// ====== Pages ======
import HomeComp from "./pages/HomeComp";
import AboutComp from "./pages/AboutComp";
import BlogComp from "./pages/BlogComp";
import ContactComp from "./pages/ContactComp";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import BookingsPage from "./pages/BookingsPage";
import ExclusiveOffers from "./pages/ExclusiveOffers";
import ExclusiveServicesComp from "./pages/ExclusiveServicesComp";
import DecorationServiceComp from "./pages/DecorationServiceComp";

// ====== Location Pages ======
import HyderabadComp from "./pages/locations/HyderabadComp";
import TirupatiComp from "./pages/locations/TirupatiComp";
import VijayawadaComp from "./pages/locations/VijayawadaComp";

// ====== Admin ======
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";

// ====== Auth Context ======
import { AuthProvider, useAuth } from "./context/AuthContext";

// ====== Protected Route Components ======
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

// ====== Main Layout ======
const MainLayout = ({ children }) => (
    <>
        <NavComponent />
        <main className="main-content">{children}</main>
        <Footer />
    </>
);

// ====== App Component ======
function App() {
    return (
        <AuthProvider>
            {/* ✅ Display logo intro on page load */}
            <LogoIntro />
            
            <Router>
                <Routes>
                    {/* ---------- Public Routes ---------- */}
                    <Route path="/" element={<MainLayout><HomeComp /></MainLayout>} />
                    <Route path="/about" element={<MainLayout><AboutComp /></MainLayout>} />
                    <Route path="/blog" element={<MainLayout><BlogComp /></MainLayout>} />
                    <Route path="/contact" element={<MainLayout><ContactComp /></MainLayout>} />

                    {/* ---------- Locations ---------- */}
                    <Route path="/hyderabad" element={<MainLayout><HyderabadComp /></MainLayout>} />
                    <Route path="/tirupati" element={<MainLayout><TirupatiComp /></MainLayout>} />
                    <Route path="/vijayawada" element={<MainLayout><VijayawadaComp /></MainLayout>} />

                    {/* ---------- Auth Routes ---------- */}
                    <Route path="/login" element={<Login />} />


                    <Route path="/signup" element={<SignUp />} />

                    {/* ---------- Protected User Routes ---------- */}
                    <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
                    <Route path="/bookings" element={<ProtectedRoute><MainLayout><BookingsPage /></MainLayout></ProtectedRoute>} />

                    {/* ---------- Exclusive Services ---------- */}
                    <Route path="/exclusive-services" element={<MainLayout><ExclusiveServicesComp /></MainLayout>} />
                    {/* Redirect /exclusive → /exclusive-services */}
                    <Route path="/exclusive" element={<Navigate to="/exclusive-services" replace />} />
                    <Route path="/decoration" element={<DecorationServiceComp />} />

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

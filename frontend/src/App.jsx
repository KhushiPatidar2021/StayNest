import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';

// Tenant Pages
import TenantDashboard from './pages/TenantDashboard';
import Favorites from './pages/Favorites';
import MyEnquiries from './pages/MyEnquiries';

// Owner Pages
import OwnerDashboard from './pages/OwnerDashboard';
import MyProperties from './pages/MyProperties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import OwnerEnquiries from './pages/OwnerEnquiries';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />

              {/* Shared Protected Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Tenant Only Protected Routes */}
              <Route
                path="/tenant-dashboard"
                element={
                  <ProtectedRoute role="tenant">
                    <TenantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute role="tenant">
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-enquiries"
                element={
                  <ProtectedRoute role="tenant">
                    <MyEnquiries />
                  </ProtectedRoute>
                }
              />

              {/* Owner Only Protected Routes */}
              <Route
                path="/owner-dashboard"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-properties"
                element={
                  <ProtectedRoute role="owner">
                    <MyProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-property"
                element={
                  <ProtectedRoute role="owner">
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-property/:id"
                element={
                  <ProtectedRoute role="owner">
                    <EditProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner-enquiries"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerEnquiries />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

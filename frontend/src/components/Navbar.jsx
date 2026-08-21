import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Building,
  Heart,
  MessageSquare,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Compass,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isOwner, isTenant, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl text-indigo-600 tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Home className="w-5 h-5" />
            </div>
            <span>Stay<span className="text-gray-900">Nest</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link
              to="/properties"
              className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <Compass className="w-4 h-4" />
              Browse PGs & Rooms
            </Link>

            {isAuthenticated ? (
              <>
                {isTenant && (
                  <>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Favorites
                    </Link>
                    <Link
                      to="/my-enquiries"
                      className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      My Enquiries
                    </Link>
                    <Link
                      to="/tenant-dashboard"
                      className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Dashboard
                    </Link>
                  </>
                )}

                {isOwner && (
                  <>
                    <Link
                      to="/my-properties"
                      className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                    >
                      <Building className="w-4 h-4" />
                      My Listings
                    </Link>
                    <Link
                      to="/owner-enquiries"
                      className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Enquiries
                    </Link>
                    <Link
                      to="/add-property"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-semibold transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Property
                    </Link>
                    <Link
                      to="/owner-dashboard"
                      className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Dashboard
                    </Link>
                  </>
                )}

                {/* Profile & Logout */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-xs text-gray-800">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-semibold text-sm transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-sm shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-gray-700 font-medium"
          >
            <Compass className="w-5 h-5 text-indigo-600" />
            Browse PGs & Rooms
          </Link>

          {isAuthenticated ? (
            <>
              {isTenant && (
                <>
                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <Heart className="w-5 h-5 text-pink-500" />
                    My Favorites
                  </Link>
                  <Link
                    to="/my-enquiries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    My Enquiries
                  </Link>
                  <Link
                    to="/tenant-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Tenant Dashboard
                  </Link>
                </>
              )}

              {isOwner && (
                <>
                  <Link
                    to="/my-properties"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <Building className="w-5 h-5 text-indigo-600" />
                    My Listings
                  </Link>
                  <Link
                    to="/owner-enquiries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    Owner Enquiries
                  </Link>
                  <Link
                    to="/add-property"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-indigo-600 font-semibold"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Add Property
                  </Link>
                  <Link
                    to="/owner-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 font-medium"
                  >
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    Owner Dashboard
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-gray-700 font-medium"
              >
                <User className="w-5 h-5 text-gray-600" />
                My Profile ({user?.role})
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold text-gray-800 border border-gray-300 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold text-white bg-indigo-600 rounded-xl"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

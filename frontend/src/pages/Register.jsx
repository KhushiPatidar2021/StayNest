import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerApi } from '../services/api';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Lock, UserPlus, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'tenant',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { name, email, phone, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password,
        role,
      });

      const { token, user } = res.data;
      register(token, user);
      toast.success(`Account registered! Welcome to StayNest, ${user.name}`);

      if (user.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/tenant-dashboard');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please check your details.';
      toast.error(msg);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Create StayNest Account</h2>
          <p className="text-gray-500 text-sm">
            Join as a Tenant to find PGs or as an Owner to list properties
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'tenant' })}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              role === 'tenant'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            I am a Tenant
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'owner' })}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              role === 'owner'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            I am an Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Rahul Kumar"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register as {role === 'owner' ? 'Owner' : 'Tenant'}</span>
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Already registered?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:underline"
            >
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

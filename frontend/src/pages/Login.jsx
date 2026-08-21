import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/api';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, ArrowRight, UserCheck, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      const { token, user } = res.data;

      login(token, user);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/tenant-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for demo/testing
  const fillDemoUser = (role) => {
    if (role === 'owner') {
      setFormData({
        email: 'owner@staynest.com',
        password: '123456',
      });
    } else {
      setFormData({
        email: 'tenant@staynest.com',
        password: '123456',
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Sign in to access your saved PGs, enquiries or owner listings
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100 space-y-2">
          <p className="text-xs font-bold text-indigo-800 text-center uppercase tracking-wider">
            ⚡ Demo Quick Credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => fillDemoUser('tenant')}
              className="py-2 px-3 bg-white hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Tenant Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoUser('owner')}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              Owner Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                required
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
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

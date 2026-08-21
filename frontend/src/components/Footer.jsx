import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MapPin, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span>Stay<span className="text-indigo-400">Nest</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find a place that feels like home. Verified PG accommodations, hostels, and rooms for students and working professionals.
            </p>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Popular Hubs</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/properties?search=Vijay+Nagar" className="hover:text-indigo-400 transition-colors">Vijay Nagar, Indore</Link></li>
              <li><Link to="/properties?search=Bhawarkua" className="hover:text-indigo-400 transition-colors">Bhawarkua (Student Hub)</Link></li>
              <li><Link to="/properties?search=Palasia" className="hover:text-indigo-400 transition-colors">Old Palasia</Link></li>
              <li><Link to="/properties?search=Rau" className="hover:text-indigo-400 transition-colors">Rau Bypass Road</Link></li>
              <li><Link to="/properties?search=Bengali+Square" className="hover:text-indigo-400 transition-colors">Bengali Square</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/properties" className="hover:text-indigo-400 transition-colors">Browse All PGs</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Tenant Login</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">List Your Property</Link></li>
              <li><Link to="/properties?roomType=Single" className="hover:text-indigo-400 transition-colors">Single Room PGs</Link></li>
              <li><Link to="/properties?genderPreference=Female" className="hover:text-indigo-400 transition-colors">Girls Hostels</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-sm text-gray-400">
            <h4 className="text-white font-semibold text-base mb-4">Get In Touch</h4>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              104, IT Park Road, Indore, MP
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              support@staynest.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} StayNest Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for seamless living.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

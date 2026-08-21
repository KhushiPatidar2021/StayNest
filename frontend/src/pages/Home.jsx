import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import Loading from '../components/Loading';
import { getPropertiesApi, getFavoritesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Building,
  Users,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const popularLocations = [
  {
    name: 'Vijay Nagar',
    tag: 'Indore IT & Commercial Hub',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bhawarkua',
    tag: 'Student & Coaching Hub',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Palasia',
    tag: 'Central & Premium Living',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Rau',
    tag: 'College & University Area',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isTenant } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await getPropertiesApi({ sort: 'newest' });
        setFeaturedProperties(res.data.slice(0, 6));

        if (isAuthenticated && isTenant) {
          try {
            const favRes = await getFavoritesApi();
            const map = {};
            favRes.data.forEach((fav) => {
              if (fav.property) {
                map[fav.property._id] = true;
              }
            });
            setFavoritesMap(map);
          } catch (e) {
            console.error('Failed to fetch user favorites', e);
          }
        }
      } catch (err) {
        console.error('Error fetching home properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [isAuthenticated, isTenant]);

  const handleSearchSubmit = (searchTerm) => {
    if (searchTerm) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl sm:rounded-b-[40px] shadow-2xl overflow-hidden">
        {/* Decorative background blur blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Verified PG & Room Rental Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Find a place that <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-300 via-white to-indigo-200 bg-clip-text text-transparent">
              feels like home.
            </span>
          </h1>

          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Discover verified PGs, hostels, and shared rooms with home-cooked meals, high-speed WiFi, and security. Zero hidden charges.
          </p>

          {/* Search Component */}
          <div className="pt-4">
            <SearchBar onSearch={handleSearchSubmit} />
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Popular Locality Hubs
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Top requested areas by students and professionals in Indore
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-indigo-600 font-bold text-sm hover:text-indigo-700"
          >
            Explore All Cities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularLocations.map((loc) => (
            <div
              key={loc.name}
              onClick={() => handleSearchSubmit(loc.name)}
              className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-lg">{loc.name}</h3>
                <p className="text-xs text-indigo-200 font-medium">{loc.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Building className="w-3.5 h-3.5" />
              Handpicked Accommodations
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured PG & Room Listings
            </h2>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-sm"
          >
            View All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loading message="Fetching live properties from backend..." />
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                initialIsFavorite={!!favoritesMap[property._id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-lg">No listings available right now</h3>
            <p className="text-gray-500 text-sm mt-1">
              Check back soon or register as an owner to list the first PG!
            </p>
          </div>
        )}
      </section>

      {/* Why Choose StayNest */}
      <section className="bg-indigo-50/60 py-16 px-4 sm:px-6 lg:px-8 border-y border-indigo-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Why Tenants & Owners Choose StayNest
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Designed to make finding and managing PG accommodation stress-free and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Verified Owners & PGs</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Direct owner communication with genuine photos, exact rent, and facility details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Direct Enquiries</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Send enquiries instantly to owners and track response status right from your tenant dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Zero Brokerage Fee</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                No middleman commissions. Pay only the agreed monthly rent directly to property owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/30">
              For Property Owners
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Have a PG or Room to Rent?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              List your property on StayNest and connect with thousands of verified student and working professional tenants.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center rounded-xl shadow-lg transition-all"
            >
              List Property Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-center rounded-xl border border-white/20 transition-all"
            >
              Owner Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

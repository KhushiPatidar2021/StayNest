import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { getFavoritesApi, getMyEnquiriesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageSquare, CheckCircle2, Compass, Clock, Building } from 'lucide-react';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [favRes, enqRes] = await Promise.all([
          getFavoritesApi(),
          getMyEnquiriesApi(),
        ]);
        setFavoritesCount(favRes.data.length);
        setEnquiries(enqRes.data);
      } catch (err) {
        console.error('Error loading tenant dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingEnquiries = enquiries.filter((e) => e.status === 'Pending').length;
  const acceptedEnquiries = enquiries.filter((e) => e.status === 'Accepted').length;

  if (loading) {
    return <Loading fullScreen message="Loading tenant dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 bg-white/10 text-indigo-200 text-xs font-semibold rounded-full border border-white/15">
            Tenant Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm">
            Track your saved PG listings and enquiry response statuses here.
          </p>
        </div>

        <Link
          to="/properties"
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Compass className="w-4 h-4" />
          Explore More PGs
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Favorite Saved PGs"
          value={favoritesCount}
          icon={Heart}
          color="rose"
          subtitle="Saved to your shortlist"
        />
        <StatCard
          title="Pending Enquiries"
          value={pendingEnquiries}
          icon={Clock}
          color="amber"
          subtitle="Awaiting owner response"
        />
        <StatCard
          title="Accepted Enquiries"
          value={acceptedEnquiries}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Ready for property visit"
        />
      </div>

      {/* Recent Sent Enquiries */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-lg">My Recent Enquiries</h3>
          </div>
          <Link
            to="/my-enquiries"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            View All ({enquiries.length})
          </Link>
        </div>

        {enquiries.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {enquiries.slice(0, 5).map((enq) => (
              <div key={enq._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={
                        enq.property?.images?.[0] ||
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80'
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{enq.property?.title}</h4>
                    <p className="text-xs text-gray-500">
                      Owner: {enq.owner?.name} • ₹{enq.property?.rent?.toLocaleString()}/mo
                    </p>
                    <p className="text-xs text-gray-600 italic mt-1 line-clamp-1">"{enq.message}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      enq.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : enq.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {enq.status}
                  </span>

                  {enq.property && (
                    <Link
                      to={`/properties/${enq.property._id}`}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View Property
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-2">
            <Building className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-sm font-medium">You haven't sent any property enquiries yet.</p>
            <Link
              to="/properties"
              className="inline-block text-xs font-bold text-indigo-600 underline"
            >
              Browse PGs and contact owners
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { getMyPropertiesApi, getOwnerEnquiriesApi, updateEnquiryStatusApi, deletePropertyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Building, Users, Clock, CheckCircle2, PlusCircle, Edit, Trash2, MessageSquare, Phone, Mail } from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const [propRes, enqRes] = await Promise.all([
        getMyPropertiesApi(),
        getOwnerEnquiriesApi(),
      ]);
      setProperties(propRes.data);
      setEnquiries(enqRes.data);
    } catch (err) {
      console.error('Error fetching owner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const totalAvailableRooms = properties.reduce((acc, curr) => acc + (curr.availableRooms || 0), 0);
  const pendingEnquiries = enquiries.filter((e) => e.status === 'Pending').length;
  const acceptedEnquiries = enquiries.filter((e) => e.status === 'Accepted').length;

  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      await updateEnquiryStatusApi(enquiryId, newStatus);
      toast.success(`Enquiry marked as ${newStatus}`);
      fetchOwnerData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProperty = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        await deletePropertyApi(id);
        toast.success('Property deleted successfully');
        setProperties(properties.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading owner dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Owner Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30">
            Property Owner Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm">
            Manage your PG listings, room vacancies, and tenant enquiries.
          </p>
        </div>

        <Link
          to="/add-property"
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Property
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={properties.length}
          icon={Building}
          color="indigo"
          subtitle="Active PG listings"
        />
        <StatCard
          title="Available Rooms"
          value={totalAvailableRooms}
          icon={Users}
          color="blue"
          subtitle="Vacant rooms remaining"
        />
        <StatCard
          title="Pending Enquiries"
          value={pendingEnquiries}
          icon={Clock}
          color="amber"
          subtitle="Awaiting your response"
        />
        <StatCard
          title="Accepted Enquiries"
          value={acceptedEnquiries}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Confirmed tenant requests"
        />
      </div>

      {/* Grid: My Properties & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Listed Properties */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              My Listed Properties ({properties.length})
            </h3>
            <Link to="/my-properties" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {properties.slice(0, 4).map((prop) => (
                <div key={prop._id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        prop.images?.[0] ||
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80'
                      }
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{prop.title}</h4>
                      <p className="text-xs text-gray-500">
                        {prop.location} • ₹{prop.rent?.toLocaleString()}/mo • {prop.availableRooms} rooms
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/edit-property/${prop._id}`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Property"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProperty(prop._id, prop.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <Building className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-gray-500 text-sm font-medium">No properties listed yet.</p>
              <Link to="/add-property" className="inline-block text-xs font-bold text-indigo-600 underline">
                Add your first PG listing
              </Link>
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Tenant Enquiries ({enquiries.length})
            </h3>
            <Link to="/owner-enquiries" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {enquiries.slice(0, 4).map((enq) => (
                <div key={enq._id} className="py-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{enq.tenant?.name}</h4>
                      <p className="text-xs text-gray-500">
                        Property: <strong className="text-gray-700">{enq.property?.title}</strong>
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        enq.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-700'
                          : enq.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl italic">
                    "{enq.message}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-indigo-500" /> {enq.tenant?.phone}
                      </span>
                    </div>

                    {enq.status === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusUpdate(enq._id, 'Accepted')}
                          className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(enq._id, 'Rejected')}
                          className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-gray-500 text-sm font-medium">No enquiries received yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;

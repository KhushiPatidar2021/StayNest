import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { getMyPropertiesApi, deletePropertyApi } from '../services/api';
import { toast } from 'react-toastify';
import { Building, PlusCircle, Edit, Trash2, MapPin, Users, ArrowRight } from 'lucide-react';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const res = await getMyPropertiesApi();
      setProperties(res.data);
    } catch (err) {
      console.error('Error fetching owner properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deletePropertyApi(id);
        toast.success('Property listing deleted successfully');
        setProperties(properties.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading your property listings..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30">
            Owner Listings
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2">
            My PG Properties
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1">
            Manage your active accommodation listings and availability
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

      {/* Grid of Owner Properties */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div
              key={prop._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-gray-100">
                  <img
                    src={
                      prop.images?.[0] ||
                      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 bg-gray-900/80 text-white text-xs font-bold rounded-lg backdrop-blur-md">
                      {prop.roomType}
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-600/90 text-white text-xs font-bold rounded-lg backdrop-blur-md">
                      {prop.availableRooms} Rooms Vacant
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {prop.location}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{prop.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{prop.address}</p>

                  <div className="pt-2 flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-gray-900">
                      ₹{prop.rent?.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">/month</span>
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="p-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to={`/properties/${prop._id}`}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/edit-property/${prop._id}`}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(prop._id, prop.title)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <Building className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-xl font-bold text-gray-900">You haven't listed any properties yet</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Click the button below to add your first PG or room accommodation listing.
          </p>
          <Link
            to="/add-property"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Add Property Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyProperties;

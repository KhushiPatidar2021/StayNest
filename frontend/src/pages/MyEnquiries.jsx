import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { getMyEnquiriesApi } from '../services/api';
import { MessageSquare, Calendar, MapPin, Phone, Mail, Building, ArrowRight } from 'lucide-react';

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const res = await getMyEnquiriesApi();
        setEnquiries(res.data);
      } catch (err) {
        console.error('Error loading enquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return <Loading fullScreen message="Loading sent enquiries..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-white/10 text-indigo-200 text-xs font-semibold rounded-full border border-white/15">
            Tenant Requests
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2">
            My Sent Enquiries
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1">
            Track response status from property owners for your room visit requests
          </p>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl hidden sm:block">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Enquiries List */}
      {enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Property & Message Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={
                      enq.property?.images?.[0] ||
                      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={enq.property?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{enq.property?.title}</h3>
                    <span className="text-xs text-indigo-600 font-semibold px-2.5 py-0.5 bg-indigo-50 rounded-md">
                      ₹{enq.property?.rent?.toLocaleString()}/mo
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {enq.property?.location} • {enq.property?.address}
                  </p>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 font-medium italic mt-2">
                    "{enq.message}"
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Sent on {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                    {enq.owner && (
                      <span className="flex items-center gap-1 text-gray-600 font-medium">
                        Owner: {enq.owner.name} ({enq.owner.phone})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Link */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 gap-3">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    enq.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : enq.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {enq.status}
                </span>

                {enq.property && (
                  <Link
                    to={`/properties/${enq.property._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View Property Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-xl font-bold text-gray-900">No sent enquiries yet</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            When you find a PG room you like, click "Send Enquiry" on the details page to contact the owner directly.
          </p>
          <Link
            to="/properties"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Explore Available PGs
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyEnquiries;

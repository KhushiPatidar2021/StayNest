import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { getOwnerEnquiriesApi, updateEnquiryStatusApi } from '../services/api';
import { toast } from 'react-toastify';
import { MessageSquare, Phone, Mail, User, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const OwnerEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await getOwnerEnquiriesApi();
      setEnquiries(res.data);
    } catch (err) {
      console.error('Error fetching owner enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiryStatusApi(id, status);
      toast.success(`Enquiry ${status.toLowerCase()} successfully`);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading tenant requests..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30">
            Owner Management
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2">
            Incoming Tenant Enquiries
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1">
            Review visit requests from potential tenants and accept or decline
          </p>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl hidden sm:block">
          <MessageSquare className="w-8 h-8 text-indigo-300" />
        </div>
      </div>

      {/* Enquiries Grid / List */}
      {enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                    Property: {enq.property?.title || 'Unknown Property'}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="font-bold text-gray-900 text-lg">{enq.tenant?.name || 'Anonymous Tenant'}</h3>
                  </div>
                </div>

                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                    enq.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : enq.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Status: {enq.status}
                </span>
              </div>

              {/* Message */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-1">Tenant Message:</p>
                <p className="text-sm font-medium text-gray-800 italic">"{enq.message}"</p>
              </div>

              {/* Contact Info & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
                  <a
                    href={`tel:${enq.tenant?.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call: {enq.tenant?.phone || 'N/A'}
                  </a>

                  <a
                    href={`mailto:${enq.tenant?.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email: {enq.tenant?.email || 'N/A'}
                  </a>

                  <span className="flex items-center gap-1 text-gray-400 font-normal">
                    <Calendar className="w-3.5 h-3.5" />
                    Received {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {enq.status === 'Pending' && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleStatusChange(enq._id, 'Accepted')}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Accept Request
                    </button>
                    <button
                      onClick={() => handleStatusChange(enq._id, 'Rejected')}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-xl font-bold text-gray-900">No tenant enquiries received yet</h3>
          <p className="text-gray-500 text-sm">
            Enquiries sent by tenants interested in your PG listings will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default OwnerEnquiries;

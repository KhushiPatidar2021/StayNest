import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getPropertyDetailsApi,
  addFavoriteApi,
  removeFavoriteApi,
  createEnquiryApi,
  getFavoritesApi,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import {
  MapPin,
  Heart,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  Building,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
  Share2,
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isTenant, isOwner } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Enquiry Form State
  const [enquiryMessage, setEnquiryMessage] = useState(
    'Hi, I am interested in your property. Is it available for immediate visit?'
  );
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await getPropertyDetailsApi(id);
        setProperty(res.data);

        // Check if favorited by tenant
        if (isAuthenticated && isTenant) {
          try {
            const favRes = await getFavoritesApi();
            const found = favRes.data.some(
              (fav) => fav.property && fav.property._id === id
            );
            setIsFavorite(found);
          } catch (e) {
            console.error('Error checking favorite status:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isAuthenticated, isTenant]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in as tenant to save favorites');
      return;
    }
    if (!isTenant) {
      toast.info('Only tenants can save favorites');
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFavoriteApi(id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addFavoriteApi(id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    if (!enquiryMessage.trim()) {
      toast.error('Please enter an enquiry message');
      return;
    }

    setEnquirySending(true);
    try {
      await createEnquiryApi({
        propertyId: id,
        message: enquiryMessage,
      });
      setEnquirySent(true);
      toast.success('Enquiry sent to owner successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setEnquirySending(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Property link copied to clipboard!');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading property details..." />;
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Property Not Found</h2>
        <p className="text-gray-500">The property listing you requested does not exist or was removed.</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
      </div>
    );
  }

  const isMyProperty =
    user && property.owner && user._id === property.owner._id;

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-indigo-600" />
            Share
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
            {isFavorite ? 'Saved' : 'Save Favorite'}
          </button>
        </div>
      </div>

      {/* Main Image Gallery Slider */}
      <div className="space-y-3">
        <div className="relative h-72 sm:h-96 lg:h-[420px] w-full rounded-3xl overflow-hidden bg-gray-900 shadow-md">
          <img
            src={images[activeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80';
            }}
          />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-sm">
              {property.roomType} Room
            </span>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-xl backdrop-blur-md shadow-sm ${
                property.genderPreference === 'Female'
                  ? 'bg-pink-600/90 text-white'
                  : property.genderPreference === 'Male'
                  ? 'bg-blue-600/90 text-white'
                  : 'bg-emerald-600/90 text-white'
              }`}
            >
              {property.genderPreference}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-medium">
            Photo {activeImageIndex + 1} of {images.length}
          </div>
        </div>

        {/* Thumbnail selector */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === index
                    ? 'border-indigo-600 scale-105 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content & Enquiry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="flex items-center gap-1 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4" />
                  {property.location}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {property.title}
                </h1>
              </div>

              <div className="text-left sm:text-right bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                <p className="text-xs text-indigo-600 font-semibold uppercase">Monthly Rent</p>
                <p className="text-2xl font-extrabold text-indigo-900">
                  ₹{property.rent?.toLocaleString()}
                  <span className="text-xs font-medium text-gray-500">/mo</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>Room Type: <strong className="text-gray-900">{property.roomType}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Available: <strong className="text-gray-900">{property.availableRooms} Rooms</strong></span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Address</h3>
              <p className="text-sm font-medium text-gray-800">{property.address}</p>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>

          {/* Facilities checklist */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Included Amenities & Facilities
            </h3>

            {property.facilities && property.facilities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2.5 text-xs font-semibold text-gray-800"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No specific amenities listed by owner.</p>
            )}
          </div>

          {/* Owner Info Card */}
          {property.owner && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Property Owner Information
              </h3>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-indigo-50 border-2 border-indigo-100 shrink-0">
                  <img
                    src={
                      property.owner.profileImage ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={property.owner.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-base">{property.owner.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    {property.owner.email}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    +91 {property.owner.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Send Enquiry Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-3xl border border-gray-100 shadow-lg space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600" />
                Send Owner Enquiry
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Direct message to owner regarding rent, visit timing, and deposit.
              </p>
            </div>

            {isMyProperty ? (
              <div className="p-4 bg-indigo-50 text-indigo-800 rounded-2xl border border-indigo-100 text-xs font-semibold text-center">
                You are the owner of this property. Manage this listing from your Owner Dashboard.
              </div>
            ) : isAuthenticated && isTenant ? (
              enquirySent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm">Enquiry Sent!</h4>
                  <p className="text-xs text-emerald-700">
                    The owner has received your request. Check status in your Tenant Dashboard.
                  </p>
                  <Link
                    to="/my-enquiries"
                    className="inline-block pt-1 font-bold text-xs text-emerald-800 underline"
                  >
                    View My Enquiries
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSendEnquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Message to Owner
                    </label>
                    <textarea
                      rows={4}
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="Ask about room availability, deposit, or food preferences..."
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enquirySending}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {enquirySending ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Enquiry Now
                      </>
                    )}
                  </button>
                </form>
              )
            ) : !isAuthenticated ? (
              <div className="space-y-3 text-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-xs font-medium text-gray-600">
                  You must be logged in as a Tenant to send an enquiry.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    className="py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-indigo-700"
                  >
                    Log In as Tenant
                  </Link>
                  <Link
                    to="/register"
                    className="py-2.5 bg-white text-gray-800 font-bold text-xs border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Create Tenant Account
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 text-xs font-semibold text-center">
                You are currently logged in as an Owner. Only Tenants can send enquiries.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

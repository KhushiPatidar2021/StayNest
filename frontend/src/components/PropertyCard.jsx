import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Users, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addFavoriteApi, removeFavoriteApi } from '../services/api';
import { toast } from 'react-toastify';

const PropertyCard = ({ property, initialIsFavorite = false, onFavoriteToggle }) => {
  const { isTenant, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favLoading, setFavLoading] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please log in to save properties to favorites');
      return;
    }

    if (!isTenant) {
      toast.info('Only tenants can save favorites');
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFavoriteApi(property._id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addFavoriteApi(property._id);
        setIsFavorite(true);
        toast.success('Saved to favorites');
      }
      if (onFavoriteToggle) {
        onFavoriteToggle(property._id, !isFavorite);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Room Type & Gender Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 bg-gray-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-lg shadow-sm">
            {property.roomType} Room
          </span>
          {property.genderPreference && (
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-md shadow-sm ${
                property.genderPreference === 'Female'
                  ? 'bg-pink-600/90 text-white'
                  : property.genderPreference === 'Male'
                  ? 'bg-blue-600/90 text-white'
                  : 'bg-emerald-600/90 text-white'
              }`}
            >
              {property.genderPreference}
            </span>
          )}
        </div>

        {/* Favorite Heart Toggle */}
        <button
          onClick={handleToggleFavorite}
          disabled={favLoading}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-700 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-md"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Rent Badge */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-gray-900 font-extrabold text-sm shadow-sm flex items-baseline gap-1">
          <span>₹{property.rent?.toLocaleString()}</span>
          <span className="text-gray-500 text-xs font-normal">/mo</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{property.location}</span>
          </div>

          <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
            {property.title}
          </h3>

          <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
            {property.address}
          </p>

          {/* Facilities Pills */}
          {property.facilities && property.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {property.facilities.slice(0, 4).map((facility, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-md"
                >
                  {facility}
                </span>
              ))}
              {property.facilities.length > 4 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-medium rounded-md">
                  +{property.facilities.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>{property.availableRooms || 1} Rooms Left</span>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:translate-x-0.5 transition-all"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

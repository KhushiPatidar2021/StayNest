import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import Loading from '../components/Loading';
import { getFavoritesApi } from '../services/api';
import { Heart, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavoritesApi();
      setFavorites(res.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (propertyId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((item) => item.property && item.property._id !== propertyId));
    }
  };

  if (loading) {
    return <Loading fullScreen message="Fetching saved properties..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/20">
            Tenant Shortlist
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 flex items-center gap-2">
            My Favorite PGs
          </h1>
          <p className="text-pink-100 text-xs sm:text-sm mt-1">
            Properties you saved for quick access and enquiry comparison
          </p>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl hidden sm:block">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(
            (fav) =>
              fav.property && (
                <PropertyCard
                  key={fav._id}
                  property={fav.property}
                  initialIsFavorite={true}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              )
          )}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No favorite properties saved yet</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Click the heart icon on any PG card while browsing to shortlist it here!
          </p>
          <Link
            to="/properties"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Browse PGs Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;

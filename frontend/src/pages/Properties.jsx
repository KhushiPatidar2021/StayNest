import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import PropertyCard from '../components/PropertyCard';
import Loading from '../components/Loading';
import { getPropertiesApi, getFavoritesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Filter, SlidersHorizontal, Building2, X } from 'lucide-react';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isTenant } = useAuth();

  const [properties, setProperties] = useState([]);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    roomType: searchParams.get('roomType') || 'All',
    genderPreference: searchParams.get('genderPreference') || 'All',
    facility: searchParams.get('facility') || 'All',
    sort: searchParams.get('sort') || 'newest',
  });

  // Sync state with URL params
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      minRent: searchParams.get('minRent') || '',
      maxRent: searchParams.get('maxRent') || '',
      roomType: searchParams.get('roomType') || 'All',
      genderPreference: searchParams.get('genderPreference') || 'All',
      facility: searchParams.get('facility') || 'All',
      sort: searchParams.get('sort') || 'newest',
    });
  }, [searchParams]);

  // Fetch properties from backend based on filters
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        if (filters.search) queryParams.search = filters.search;
        if (filters.minRent) queryParams.minRent = filters.minRent;
        if (filters.maxRent) queryParams.maxRent = filters.maxRent;
        if (filters.roomType && filters.roomType !== 'All') queryParams.roomType = filters.roomType;
        if (filters.genderPreference && filters.genderPreference !== 'All')
          queryParams.genderPreference = filters.genderPreference;
        if (filters.facility && filters.facility !== 'All') queryParams.facility = filters.facility;
        if (filters.sort) queryParams.sort = filters.sort;

        const res = await getPropertiesApi(queryParams);
        setProperties(res.data);

        // Fetch favorites if user is tenant
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
            console.error('Error fetching favorites:', e);
          }
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, isAuthenticated, isTenant]);

  const handleSearchSubmit = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  const updateUrlParams = (newFilters) => {
    const params = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key] && newFilters[key] !== 'All') {
        params[key] = newFilters[key];
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      minRent: '',
      maxRent: '',
      roomType: 'All',
      genderPreference: 'All',
      facility: 'All',
      sort: 'newest',
    };
    setFilters(defaultFilters);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-gray-900 text-white p-6 sm:p-10 rounded-3xl shadow-lg space-y-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Explore PGs & Hostels
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1">
            Browse verified single & sharing rooms across top localities with live availability
          </p>
        </div>

        <SearchBar onSearch={handleSearchSubmit} initialValue={filters.search} />
      </div>

      {/* Main Grid with Filter Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FilterPanel
              filters={filters}
              setFilters={(newFilters) => {
                setFilters(newFilters);
                if (typeof newFilters === 'function') {
                  const updated = newFilters(filters);
                  updateUrlParams(updated);
                } else {
                  updateUrlParams(newFilters);
                }
              }}
              onReset={handleResetFilters}
              totalResults={properties.length}
            />
          </div>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold text-gray-700">
            Showing <span className="font-bold text-indigo-600">{properties.length}</span> properties
          </p>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter & Sort
          </button>
        </div>

        {/* Property Grid Content */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loading message="Searching properties from MongoDB..." />
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  initialIsFavorite={!!favoritesMap[property._id]}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No properties found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                We couldn't find any properties matching your current search or filter options.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full p-6 overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                Filter Properties
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterPanel
              filters={filters}
              setFilters={(newFilters) => {
                setFilters(newFilters);
                if (typeof newFilters === 'function') {
                  const updated = newFilters(filters);
                  updateUrlParams(updated);
                } else {
                  updateUrlParams(newFilters);
                }
              }}
              onReset={handleResetFilters}
              totalResults={properties.length}
            />

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md"
            >
              Show {properties.length} Properties
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;

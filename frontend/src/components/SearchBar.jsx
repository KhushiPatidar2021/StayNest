import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const popularHubs = ['Vijay Nagar', 'Bhawarkua', 'Rau', 'Palasia', 'Bengali Square'];

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleQuickLocation = (loc) => {
    setSearchTerm(loc);
    if (onSearch) {
      onSearch(loc);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2 bg-white p-2.5 rounded-2xl shadow-xl border border-gray-100">
        <div className="relative flex-1 flex items-center px-3">
          <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by city, locality or property name (e.g. Vijay Nagar)..."
            className="w-full py-2.5 text-gray-800 placeholder-gray-400 bg-transparent text-sm sm:text-base focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Find PGs</span>
        </button>
      </form>

      {/* Popular locations quick select */}
      <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-500">
        <span className="flex items-center gap-1 font-semibold text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
          Popular Hubs:
        </span>
        {popularHubs.map((hub) => (
          <button
            key={hub}
            type="button"
            onClick={() => handleQuickLocation(hub)}
            className="px-3 py-1 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-full font-medium text-gray-700 transition-colors shadow-2xs"
          >
            {hub}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

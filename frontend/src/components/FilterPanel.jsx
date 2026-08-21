import React from 'react';
import { Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

const facilityList = [
  'WiFi',
  'Food',
  'AC',
  'Parking',
  'Laundry',
  'CCTV',
  'Electricity',
  'Housekeeping',
];

const FilterPanel = ({ filters, setFilters, onReset, totalResults }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setFilters((prev) => {
      const current = prev.facility || 'All';
      return { ...prev, facility: current === facility ? 'All' : facility };
    });
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-gray-900 text-base">Filter Properties</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
          Sort Results
        </label>
        <select
          name="sort"
          value={filters.sort || 'newest'}
          onChange={handleChange}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="newest">Newest First</option>
          <option value="rent-asc">Rent: Low to High</option>
          <option value="rent-desc">Rent: High to Low</option>
        </select>
      </div>

      {/* Monthly Rent Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Monthly Rent Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              name="minRent"
              placeholder="Min ₹"
              value={filters.minRent || ''}
              onChange={handleChange}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <input
              type="number"
              name="maxRent"
              placeholder="Max ₹"
              value={filters.maxRent || ''}
              onChange={handleChange}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      {/* Room Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Room Occupancy Type
        </label>
        <select
          name="roomType"
          value={filters.roomType || 'All'}
          onChange={handleChange}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All Room Types</option>
          <option value="Single">Single Room</option>
          <option value="Double">Double Sharing</option>
          <option value="Triple">Triple Sharing</option>
        </select>
      </div>

      {/* Gender Preference */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Gender Preference
        </label>
        <select
          name="genderPreference"
          value={filters.genderPreference || 'All'}
          onChange={handleChange}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All Preference</option>
          <option value="Male">Boys Only</option>
          <option value="Female">Girls Only</option>
          <option value="Any">Unisex / Any</option>
        </select>
      </div>

      {/* Key Facilities */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Key Amenities & Facilities
        </label>
        <div className="flex flex-wrap gap-1.5">
          {facilityList.map((facility) => {
            const isSelected = filters.facility === facility;
            return (
              <button
                key={facility}
                type="button"
                onClick={() => handleFacilityToggle(facility)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {facility}
              </button>
            );
          })}
        </div>
      </div>

      {totalResults !== undefined && (
        <div className="pt-2 border-t border-gray-100 text-center">
          <p className="text-xs font-medium text-gray-500">
            Found <span className="font-bold text-gray-900">{totalResults}</span> matching properties
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

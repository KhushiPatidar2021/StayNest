import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPropertyApi } from '../services/api';
import { toast } from 'react-toastify';
import { Building, PlusCircle, ArrowLeft, Upload, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';

const availableFacilitiesList = [
  'WiFi',
  'Food',
  'AC',
  'Parking',
  'Laundry',
  'CCTV',
  'Electricity',
  'Housekeeping',
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    location: '',
    address: '',
    roomType: 'Single',
    genderPreference: 'Any',
    availableRooms: 1,
  });

  const [selectedFacilities, setSelectedFacilities] = useState(['WiFi', 'CCTV']);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFacilityToggle = (facility) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.rent || !formData.location || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('rent', formData.rent);
    data.append('location', formData.location);
    data.append('address', formData.address);
    data.append('roomType', formData.roomType);
    data.append('genderPreference', formData.genderPreference);
    data.append('availableRooms', formData.availableRooms);
    data.append('facilities', JSON.stringify(selectedFacilities));

    selectedFiles.forEach((file) => {
      data.append('images', file);
    });

    setLoading(true);
    try {
      await createPropertyApi(data);
      toast.success('New PG property listed successfully!');
      navigate('/owner-dashboard');
    } catch (err) {
      console.error('Error creating property:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/owner-dashboard"
        className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-gray-900">Add New PG Listing</h1>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Fill in the property details, rent, amenities and upload images for tenants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Rent */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Royal Living Boys PG - Near Vijay Nagar Square"
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Monthly Rent (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="e.g. 6500"
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                City Locality / Hub <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Vijay Nagar, Indore"
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Available Vacant Rooms <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="availableRooms"
                value={formData.availableRooms}
                onChange={handleChange}
                min={1}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Plot 45, Near C21 Mall, Vijay Nagar, Indore, M.P."
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Room Type & Gender Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Room Occupancy Type
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Single">Single Room</option>
                <option value="Double">Double Sharing</option>
                <option value="Triple">Triple Sharing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Gender Preference
              </label>
              <select
                name="genderPreference"
                value={formData.genderPreference}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Male">Boys Only</option>
                <option value="Female">Girls Only</option>
                <option value="Any">Unisex / Any</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Property Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Mention proximity to coaching institutes, food menu timing, rules, deposit terms..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Facilities Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Select Provided Facilities & Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableFacilitiesList.map((facility) => {
                const isChecked = selectedFacilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => handleFacilityToggle(facility)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{facility}</span>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Upload Property Room Images
            </label>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                id="propertyImages"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="propertyImages"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <ImageIcon className="w-8 h-8 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-600">
                  Click to select property photos
                </span>
                <span className="text-[11px] text-gray-400">
                  Select multiple files (JPG, PNG, WEBP). Images will upload via ImageKit.
                </span>
              </label>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative h-20 rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-gray-900/80 text-white p-1 rounded-full opacity-90 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Uploading & Creating Listing...</span>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Publish Property Listing</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;

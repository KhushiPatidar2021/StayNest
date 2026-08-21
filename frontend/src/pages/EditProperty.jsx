import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPropertyDetailsApi, updatePropertyApi } from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { Edit, ArrowLeft, CheckCircle2, Image as ImageIcon, X, Save } from 'lucide-react';

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

const EditProperty = () => {
  const { id } = useParams();
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

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await getPropertyDetailsApi(id);
        const p = res.data;
        setFormData({
          title: p.title || '',
          description: p.description || '',
          rent: p.rent || '',
          location: p.location || '',
          address: p.address || '',
          roomType: p.roomType || 'Single',
          genderPreference: p.genderPreference || 'Any',
          availableRooms: p.availableRooms || 1,
        });
        setSelectedFacilities(p.facilities || []);
        setExistingImages(p.images || []);
      } catch (err) {
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

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

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
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
    data.append('existingImages', JSON.stringify(existingImages));

    selectedFiles.forEach((file) => {
      data.append('images', file);
    });

    setSaving(true);
    try {
      await updatePropertyApi(id, data);
      toast.success('Property updated successfully!');
      navigate('/owner-dashboard');
    } catch (err) {
      console.error('Error updating property:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading property details for edit..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/owner-dashboard"
        className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Owner Dashboard
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Edit className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-gray-900">Edit Property Listing</h1>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Update room availability, rent, details, or upload additional photos.
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
                min={0}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Room Type & Gender */}
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
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Provided Facilities
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

          {/* Current & New Images */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700">
              Current Property Images ({existingImages.length})
            </label>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {existingImages.map((imgUrl, index) => (
                  <div key={index} className="relative h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full hover:bg-red-700"
                      title="Remove Image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center">
              <input
                type="file"
                id="additionalImages"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="additionalImages"
                className="cursor-pointer flex flex-col items-center gap-1.5"
              >
                <ImageIcon className="w-6 h-6 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-600">
                  Add more photos to listing
                </span>
              </label>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative h-20 rounded-xl overflow-hidden border border-indigo-200">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-1 right-1 bg-gray-900/80 text-white p-1 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Property Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;

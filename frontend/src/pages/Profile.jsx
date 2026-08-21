import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi, uploadProfileImageApi } from '../services/api';
import { toast } from 'react-toastify';
import { User, Phone, Mail, Camera, Shield, Calendar, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await updateProfileApi(formData);
      updateUser(res.data);
      toast.success('Profile details updated successfully');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file first');
      return;
    }

    const data = new FormData();
    data.append('profileImage', selectedFile);

    setUploadingImage(true);
    try {
      const res = await uploadProfileImageApi(data);
      updateUser({ profileImage: res.data.profileImage });
      toast.success('Profile picture updated successfully');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-indigo-50 border-4 border-indigo-100 shadow-md">
            <img
              src={
                previewUrl ||
                user?.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
              }
              alt={user?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
              }}
            />
          </div>
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900">{user?.name}</h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                user?.role === 'owner'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {user?.role}
            </span>
          </div>

          <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-indigo-500" />
            {user?.email}
          </p>

          <p className="text-gray-500 text-xs flex items-center justify-center sm:justify-start gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Profile Image */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-base">Update Profile Picture</h3>
          </div>

          <form onSubmit={handleImageSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                id="profileImageInput"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="profileImageInput"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="text-xs font-semibold text-indigo-600">
                  {selectedFile ? selectedFile.name : 'Click to select photo (JPG, PNG, WEBP)'}
                </span>
                <span className="text-[11px] text-gray-400">Max size 5MB</span>
              </label>
            </div>

            {selectedFile && (
              <button
                type="submit"
                disabled={uploadingImage}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploadingImage ? 'Uploading to ImageKit...' : 'Upload Image'}
              </button>
            )}
          </form>
        </div>

        {/* Update Details Form */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-base">Edit Contact Details</h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {savingProfile ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Profile Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

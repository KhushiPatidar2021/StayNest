import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api',
});

// Request Interceptor: Attach JWT Token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Something went wrong. Please try again.';

    if (error.response) {
      const { status } = error.response;
      const isAuthMeCall = error.config?.url?.includes('/auth/me');

      if (status === 401) {
        // Only show toast for explicit 401s, not the background auth check on page load
        if (localStorage.getItem('token') && !isAuthMeCall) {
          toast.error(message || 'Session expired. Please log in again.');
        }
      } else if (status === 403) {
        toast.error(message || 'Access forbidden: You do not have permission.');
      } else if (status === 404) {
        toast.error(message || 'Requested resource not found.');
      } else if (status >= 500) {
        toast.error(message || 'Server error. Please try again later.');
      }
    } else if (error.request) {
      toast.error('Network error. Unable to connect to server.');
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const registerApi = (userData) => API.post('/auth/register', userData);
export const loginApi = (credentials) => API.post('/auth/login', credentials);
export const getMeApi = () => API.get('/auth/me');

// User Services
export const getProfileApi = () => API.get('/users/profile');
export const updateProfileApi = (data) => API.put('/users/profile', data);
export const uploadProfileImageApi = (formData) =>
  API.post('/users/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Property Services
export const getPropertiesApi = (params) => API.get('/properties', { params });
export const getPropertyDetailsApi = (id) => API.get(`/properties/${id}`);
export const getMyPropertiesApi = () => API.get('/properties/my');
export const createPropertyApi = (formData) =>
  API.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updatePropertyApi = (id, formData) =>
  API.put(`/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deletePropertyApi = (id) => API.delete(`/properties/${id}`);

// Favorite Services
export const getFavoritesApi = () => API.get('/favorites');
export const addFavoriteApi = (propertyId) => API.post(`/favorites/${propertyId}`);
export const removeFavoriteApi = (propertyId) => API.delete(`/favorites/${propertyId}`);

// Enquiry Services
export const createEnquiryApi = (data) => API.post('/enquiries', data);
export const getMyEnquiriesApi = () => API.get('/enquiries/my');
export const getOwnerEnquiriesApi = () => API.get('/enquiries/owner');
export const updateEnquiryStatusApi = (id, status) =>
  API.put(`/enquiries/${id}/status`, { status });

export default API;

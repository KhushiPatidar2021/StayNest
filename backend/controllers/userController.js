const User = require('../models/User');
const { uploadSingleFile } = require('../utils/upload');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Upload profile image
// @route   POST /api/users/profile-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image file to upload' });
    }

    const imageUrl = await uploadSingleFile(req.file.buffer, req.file.originalname);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profileImage = imageUrl;
    await user.save();

    return res.json({
      message: 'Profile image updated successfully',
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
};

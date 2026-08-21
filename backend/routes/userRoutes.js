const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post(
  '/profile-image',
  protect,
  upload.single('profileImage'),
  uploadProfileImage
);

module.exports = router;

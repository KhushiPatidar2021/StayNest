const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload } = require('../utils/upload');

// Public routes
router.get('/', getProperties);
router.get('/my', protect, authorize('owner'), getMyProperties);
router.get('/:id', getPropertyById);

// Owner protected routes
router.post(
  '/',
  protect,
  authorize('owner'),
  upload.array('images', 5),
  createProperty
);
router.put(
  '/:id',
  protect,
  authorize('owner'),
  upload.array('images', 5),
  updateProperty
);
router.delete('/:id', protect, authorize('owner'), deleteProperty);

module.exports = router;

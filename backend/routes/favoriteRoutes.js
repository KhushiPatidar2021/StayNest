const express = require('express');
const router = express.Router();
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/:propertyId', protect, authorize('tenant'), addFavorite);
router.get('/', protect, authorize('tenant'), getFavorites);
router.delete('/:propertyId', protect, authorize('tenant'), removeFavorite);

module.exports = router;

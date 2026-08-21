const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private (Tenant only)
const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Property is already in your favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });

    return res.status(201).json({
      message: 'Added to favorites',
      favorite,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get user's favorite properties
// @route   GET /api/favorites
// @access  Private (Tenant only)
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: {
          path: 'owner',
          select: 'name email phone profileImage',
        },
      })
      .sort({ createdAt: -1 });

    return res.json(favorites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private (Tenant only)
const removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite entry not found' });
    }

    return res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};

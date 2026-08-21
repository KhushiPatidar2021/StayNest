const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const Enquiry = require('../models/Enquiry');
const { uploadSingleFile } = require('../utils/upload');

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Owner only)
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      location,
      address,
      roomType,
      facilities,
      availableRooms,
      genderPreference,
    } = req.body;

    if (!title || !description || !rent || !location || !address || !roomType) {
      return res.status(400).json({ message: 'Please fill in all required property fields' });
    }

    // Process facility list (could be JSON string or array from form-data)
    let parsedFacilities = [];
    if (facilities) {
      if (typeof facilities === 'string') {
        try {
          parsedFacilities = JSON.parse(facilities);
        } catch (e) {
          parsedFacilities = facilities.split(',').map((f) => f.trim());
        }
      } else if (Array.isArray(facilities)) {
        parsedFacilities = facilities;
      }
    }

    // Process image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadSingleFile(file.buffer, file.originalname);
        imageUrls.push(url);
      }
    } else if (req.body.existingImages) {
      // Allow passing existing image URLs as strings if provided
      if (typeof req.body.existingImages === 'string') {
        imageUrls = [req.body.existingImages];
      } else if (Array.isArray(req.body.existingImages)) {
        imageUrls = req.body.existingImages;
      }
    }

    // Fallback image if none provided
    if (imageUrls.length === 0) {
      imageUrls.push('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');
    }

    const property = await Property.create({
      title,
      description,
      rent: Number(rent),
      location,
      address,
      roomType,
      facilities: parsedFacilities,
      images: imageUrls,
      availableRooms: availableRooms ? Number(availableRooms) : 1,
      genderPreference: genderPreference || 'Any',
      owner: req.user._id,
    });

    return res.status(201).json(property);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all properties with real backend search, filtering, and sorting
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      search,
      minRent,
      maxRent,
      roomType,
      genderPreference,
      facility,
      sort,
    } = req.query;

    let query = {};

    // 1. Search by title or location (regex)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { location: searchRegex }, { address: searchRegex }];
    }

    // 2. Filter by minimum and maximum rent
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    // 3. Filter by room type
    if (roomType && roomType !== 'All') {
      query.roomType = roomType;
    }

    // 4. Filter by gender preference
    if (genderPreference && genderPreference !== 'All') {
      query.genderPreference = genderPreference;
    }

    // 5. Filter by specific facility
    if (facility && facility !== 'All') {
      query.facilities = { $in: [facility] };
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sort === 'rent-asc') {
      sortOptions = { rent: 1 };
    } else if (sort === 'rent-desc') {
      sortOptions = { rent: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email phone profileImage')
      .sort(sortOptions);

    return res.json(properties);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone profileImage'
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.json(property);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get properties belonging to logged in owner
// @route   GET /api/properties/my
// @access  Private (Owner only)
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(properties);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const {
      title,
      description,
      rent,
      location,
      address,
      roomType,
      facilities,
      availableRooms,
      genderPreference,
      existingImages,
    } = req.body;

    // Update text fields
    if (title) property.title = title;
    if (description) property.description = description;
    if (rent) property.rent = Number(rent);
    if (location) property.location = location;
    if (address) property.address = address;
    if (roomType) property.roomType = roomType;
    if (availableRooms !== undefined) property.availableRooms = Number(availableRooms);
    if (genderPreference) property.genderPreference = genderPreference;

    // Facilities update
    if (facilities) {
      if (typeof facilities === 'string') {
        try {
          property.facilities = JSON.parse(facilities);
        } catch (e) {
          property.facilities = facilities.split(',').map((f) => f.trim());
        }
      } else if (Array.isArray(facilities)) {
        property.facilities = facilities;
      }
    }

    // Image updates
    let updatedImages = [];
    if (existingImages) {
      if (typeof existingImages === 'string') {
        updatedImages = [existingImages];
      } else if (Array.isArray(existingImages)) {
        updatedImages = existingImages;
      }
    } else {
      updatedImages = [...property.images];
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadSingleFile(file.buffer, file.originalname);
        updatedImages.push(url);
      }
    }

    property.images = updatedImages;

    const updatedProperty = await property.save();
    return res.json(updatedProperty);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner only)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    // Delete property
    await Property.findByIdAndDelete(req.params.id);

    // Also delete associated favorites and enquiries
    await Favorite.deleteMany({ property: req.params.id });
    await Enquiry.deleteMany({ property: req.params.id });

    return res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
};

const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

// @desc    Send enquiry for a property
// @route   POST /api/enquiries
// @access  Private (Tenant only)
const createEnquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({ message: 'Property ID and message are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const enquiry = await Enquiry.create({
      tenant: req.user._id,
      owner: property.owner,
      property: propertyId,
      message,
      status: 'Pending',
    });

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate('property', 'title location rent roomType images')
      .populate('owner', 'name email phone profileImage');

    return res.status(201).json(populatedEnquiry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get tenant's sent enquiries
// @route   GET /api/enquiries/my
// @access  Private (Tenant only)
const getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ tenant: req.user._id })
      .populate('property', 'title location address rent roomType images')
      .populate('owner', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    return res.json(enquiries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get owner's received enquiries
// @route   GET /api/enquiries/owner
// @access  Private (Owner only)
const getOwnerEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ owner: req.user._id })
      .populate('property', 'title location address rent roomType images')
      .populate('tenant', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    return res.json(enquiries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update enquiry status (Accept / Reject)
// @route   PUT /api/enquiries/:id/status
// @access  Private (Owner only)
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    // Verify ownership
    if (enquiry.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this enquiry' });
    }

    enquiry.status = status;
    await enquiry.save();

    const updatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate('property', 'title location address rent roomType images')
      .populate('tenant', 'name email phone profileImage');

    return res.json(updatedEnquiry);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  createEnquiry,
  getMyEnquiries,
  getOwnerEnquiries,
  updateEnquiryStatus,
};

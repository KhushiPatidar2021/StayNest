const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getMyEnquiries,
  getOwnerEnquiries,
  updateEnquiryStatus,
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('tenant'), createEnquiry);
router.get('/my', protect, authorize('tenant'), getMyEnquiries);
router.get('/owner', protect, authorize('owner'), getOwnerEnquiries);
router.put('/:id/status', protect, authorize('owner'), updateEnquiryStatus);

module.exports = router;

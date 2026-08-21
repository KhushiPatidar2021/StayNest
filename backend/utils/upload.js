const multer = require('multer');
const imagekit = require('../config/imagekit');

// Multer memory storage configuration
const storage = multer.memoryStorage();

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png and .webp image formats are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Helper function to upload buffer to ImageKit (with fallback to Data URI if ImageKit keys are missing)
const uploadSingleFile = async (fileBuffer, originalName) => {
  if (imagekit) {
    const response = await imagekit.upload({
      file: fileBuffer, // buffer
      fileName: `staynest_${Date.now()}_${originalName}`,
      folder: '/staynest',
    });
    return response.url;
  } else {
    // Fallback if ImageKit keys are not provided in process.env
    const base64 = fileBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }
};

module.exports = {
  upload,
  uploadSingleFile,
};

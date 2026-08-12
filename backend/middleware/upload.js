const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine upload folder based on file type
    if (file.fieldname === 'propertyImage' || file.fieldname === 'thumbnail') {
      uploadPath += 'properties/images/';
    } else if (file.fieldname === 'agentPhoto') {
      uploadPath += 'agents/';
    } else if (file.fieldname === 'blogImage') {
      uploadPath += 'blogs/';
    } else if (file.fieldname === 'floorPlan' || file.fieldname === 'brochure') {
      uploadPath += 'properties/documents/';
    } else {
      uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocumentTypes = ['application/pdf', 'application/msword'];
  
  if (allowedImageTypes.includes(file.mimetype) || 
      allowedDocumentTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
  }
};

// Configure upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
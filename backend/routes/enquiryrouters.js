const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', enquiryController.addEnquiry);

// Protected routes (Admin only)
router.get('/', verifyToken, isAdmin, enquiryController.getEnquiries);
router.get('/:id', verifyToken, isAdmin, enquiryController.getEnquiryById);
router.get('/property/:propertyId', verifyToken, isAdmin, enquiryController.getEnquiriesByProperty);
router.put('/:id', verifyToken, isAdmin, enquiryController.updateEnquiryStatus);
router.delete('/:id', verifyToken, isAdmin, enquiryController.deleteEnquiry);

module.exports = router;
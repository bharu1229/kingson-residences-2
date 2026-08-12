const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', propertyController.getProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, propertyController.addProperty);
router.put('/:id', verifyToken, isAdmin, propertyController.updateProperty);
router.delete('/:id', verifyToken, isAdmin, propertyController.deleteProperty);

module.exports = router;
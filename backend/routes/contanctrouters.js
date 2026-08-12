const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', contactController.addContactMessage);

// Protected routes (Admin only)
router.get('/', verifyToken, isAdmin, contactController.getContactMessages);
router.get('/unread-count', verifyToken, isAdmin, contactController.getUnreadCount);
router.get('/:id', verifyToken, isAdmin, contactController.getContactMessageById);
router.put('/:id', verifyToken, isAdmin, contactController.updateMessageStatus);
router.delete('/:id', verifyToken, isAdmin, contactController.deleteContactMessage);

module.exports = router;
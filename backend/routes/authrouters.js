const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile/:uid', verifyToken, authController.getUserProfile);
router.put('/profile/:uid', verifyToken, authController.updateUserProfile);

// Admin only routes
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);
router.delete('/users/:uid', verifyToken, isAdmin, authController.deleteUser);

module.exports = router;
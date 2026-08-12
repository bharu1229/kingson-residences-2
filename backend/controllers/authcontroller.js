const { auth, db } = require('../firebase');
const User = require('../models/User');

// User Registration
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name,
      phoneNumber: phone || ''
    });

    // Create user in Firestore
    const user = new User({
      uid: userRecord.uid,
      email: email,
      name: name,
      phone: phone || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await db.collection('users').doc(userRecord.uid).set(user.toObject());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toObject()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Firebase handles authentication on client-side
    // This endpoint is for additional server-side validation if needed
    
    res.status(200).json({
      success: true,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;

    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: userDoc.data()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    updates.updatedAt = new Date().toISOString();
    await userRef.update(updates);

    const updatedDoc = await userRef.get();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedDoc.data()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];

    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete User (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    // Delete from Firebase Auth
    await auth.deleteUser(uid);
    
    // Delete from Firestore
    await db.collection('users').doc(uid).delete();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
};
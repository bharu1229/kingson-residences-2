const { db } = require('../firebase');
const ContactMessage = require('../models/ContactMessage');

// Get all contact messages
exports.getContactMessages = async (req, res) => {
  try {
    const messagesRef = db.collection('contactMessages');
    const snapshot = await messagesRef.get();
    
    const messages = [];
    snapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get contact message by ID
exports.getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const messageDoc = await db.collection('contactMessages').doc(id).get();
    
    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      message: {
        id: messageDoc.id,
        ...messageDoc.data()
      }
    });
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add new contact message
exports.addContactMessage = async (req, res) => {
  try {
    const messageData = req.body;
    
    // Add IP and User Agent
    messageData.ipAddress = req.ip || req.connection.remoteAddress;
    messageData.userAgent = req.headers['user-agent'] || '';

    const message = new ContactMessage(messageData);
    message.validate();

    const docRef = await db.collection('contactMessages').add(message.toObject());
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Add contact message error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update message status (mark as read/replied)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const messageRef = db.collection('contactMessages').doc(id);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await messageRef.update({
      status: status,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await messageRef.get();

    res.status(200).json({
      success: true,
      message: 'Message status updated successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete contact message
exports.deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const messageRef = db.collection('contactMessages').doc(id);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await messageRef.delete();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get unread messages count
exports.getUnreadCount = async (req, res) => {
  try {
    const messagesRef = db.collection('contactMessages');
    const snapshot = await messagesRef.where('status', '==', 'unread').get();
    
    res.status(200).json({
      success: true,
      unreadCount: snapshot.size
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: error.message });
  }
};
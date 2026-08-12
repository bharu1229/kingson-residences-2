const { db } = require('../firebase');
const Enquiry = require('../models/Enquiry');

// Get all enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const enquiriesRef = db.collection('enquiries');
    const snapshot = await enquiriesRef.get();
    
    const enquiries = [];
    snapshot.forEach(doc => {
      enquiries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      enquiries: enquiries
    });
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get enquiry by ID
exports.getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const enquiryDoc = await db.collection('enquiries').doc(id).get();
    
    if (!enquiryDoc.exists) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.status(200).json({
      success: true,
      enquiry: {
        id: enquiryDoc.id,
        ...enquiryDoc.data()
      }
    });
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add new enquiry
exports.addEnquiry = async (req, res) => {
  try {
    const enquiryData = req.body;
    
    const enquiry = new Enquiry(enquiryData);
    enquiry.validate();

    const docRef = await db.collection('enquiries').add(enquiry.toObject());
    
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Add enquiry error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update enquiry status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const enquiryRef = db.collection('enquiries').doc(id);
    const enquiryDoc = await enquiryRef.get();

    if (!enquiryDoc.exists) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const updates = {
      status: status || enquiryDoc.data().status,
      updatedAt: new Date().toISOString()
    };

    if (notes) {
      updates.notes = notes;
    }

    await enquiryRef.update(updates);

    const updatedDoc = await enquiryRef.get();

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully',
      enquiry: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    console.error('Update enquiry error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiryRef = db.collection('enquiries').doc(id);
    const enquiryDoc = await enquiryRef.get();

    if (!enquiryDoc.exists) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    await enquiryRef.delete();

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get enquiries by property
exports.getEnquiriesByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const enquiriesRef = db.collection('enquiries');
    const snapshot = await enquiriesRef.where('propertyId', '==', propertyId).get();
    
    const enquiries = [];
    snapshot.forEach(doc => {
      enquiries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      enquiries: enquiries
    });
  } catch (error) {
    console.error('Get enquiries by property error:', error);
    res.status(500).json({ error: error.message });
  }
};
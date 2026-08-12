const { db } = require('../firebase');
const Property = require('../models/Property');

// Get all properties
exports.getProperties = async (req, res) => {
  try {
    const propertiesRef = db.collection('properties');
    const snapshot = await propertiesRef.get();
    
    const properties = [];
    snapshot.forEach(doc => {
      properties.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      properties: properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const propertyDoc = await db.collection('properties').doc(id).get();
    
    if (!propertyDoc.exists) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      property: {
        id: propertyDoc.id,
        ...propertyDoc.data()
      }
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add new property
exports.addProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    
    // Validate property data
    const property = new Property(propertyData);
    property.validate();

    const docRef = await db.collection('properties').add(property.toObject());
    
    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Add property error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const propertyRef = db.collection('properties').doc(id);
    const propertyDoc = await propertyRef.get();

    if (!propertyDoc.exists) {
      return res.status(404).json({ error: 'Property not found' });
    }

    updates.updatedAt = new Date().toISOString();
    await propertyRef.update(updates);

    const updatedDoc = await propertyRef.get();

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyRef = db.collection('properties').doc(id);
    const propertyDoc = await propertyRef.get();

    if (!propertyDoc.exists) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await propertyRef.delete();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get featured properties
exports.getFeaturedProperties = async (req, res) => {
  try {
    const propertiesRef = db.collection('properties');
    const snapshot = await propertiesRef.where('featured', '==', true).get();
    
    const properties = [];
    snapshot.forEach(doc => {
      properties.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      properties: properties
    });
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Search properties
exports.searchProperties = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, location, bedrooms } = req.query;
    
    let query = db.collection('properties');
    
    if (type && type !== 'all') {
      query = query.where('type', '==', type);
    }
    
    if (location && location !== 'all') {
      query = query.where('city', '==', location);
    }
    
    if (bedrooms && parseInt(bedrooms) > 0) {
      query = query.where('bedrooms', '==', parseInt(bedrooms));
    }
    
    if (minPrice && parseInt(minPrice) > 0) {
      query = query.where('price', '>=', parseInt(minPrice));
    }
    
    if (maxPrice && parseInt(maxPrice) > 0) {
      query = query.where('price', '<=', parseInt(maxPrice));
    }
    
    const snapshot = await query.get();
    
    const properties = [];
    snapshot.forEach(doc => {
      properties.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      properties: properties
    });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({ error: error.message });
  }
};
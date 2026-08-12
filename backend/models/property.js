// Property Model - Defines property schema and methods
class Property {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // apartment, house, land
    this.category = data.category || 'residential';
    this.price = data.price || 0;
    this.location = data.location || '';
    this.city = data.city || '';
    this.state = data.state || '';
    this.pincode = data.pincode || '';
    this.bedrooms = data.bedrooms || 0;
    this.bathrooms = data.bathrooms || 0;
    this.area = data.area || 0;
    this.areaUnit = data.areaUnit || 'sq.ft';
    this.parking = data.parking || 0;
    this.images = data.images || [];
    this.thumbnail = data.thumbnail || '';
    this.video = data.video || '';
    this.floorPlan = data.floorPlan || '';
    this.brochure = data.brochure || '';
    this.amenities = data.amenities || [];
    this.status = data.status || 'available'; // available, sold, under_construction
    this.featured = data.featured || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.agentId = data.agentId || '';
    this.views = data.views || 0;
  }

  // Convert to plain object
  toObject() {
    return {
      title: this.title,
      description: this.description,
      type: this.type,
      category: this.category,
      price: this.price,
      location: this.location,
      city: this.city,
      state: this.state,
      pincode: this.pincode,
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms,
      area: this.area,
      areaUnit: this.areaUnit,
      parking: this.parking,
      images: this.images,
      thumbnail: this.thumbnail,
      video: this.video,
      floorPlan: this.floorPlan,
      brochure: this.brochure,
      amenities: this.amenities,
      status: this.status,
      featured: this.featured,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      agentId: this.agentId,
      views: this.views
    };
  }

  // Validate property data
  validate() {
    if (!this.title) throw new Error('Title is required');
    if (!this.type) throw new Error('Property type is required');
    if (!this.price || this.price <= 0) throw new Error('Valid price is required');
    if (!this.location) throw new Error('Location is required');
    if (!this.area || this.area <= 0) throw new Error('Valid area is required');
    return true;
  }

  // Static method to create from Firestore data
  static fromFirestore(doc) {
    const data = doc.data();
    return new Property({
      id: doc.id,
      ...data
    });
  }
}

module.exports = Property;
// Agent Model - Defines agent schema and methods
class Agent {
  constructor(data) {
    this.id = data.id || null;
    this.uid = data.uid || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.photo = data.photo || '';
    this.specialization = data.specialization || '';
    this.experience = data.experience || 0;
    this.bio = data.bio || '';
    this.rating = data.rating || 0;
    this.totalSales = data.totalSales || 0;
    this.languages = data.languages || [];
    this.properties = data.properties || [];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Convert to plain object
  toObject() {
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      phone: this.phone,
      photo: this.photo,
      specialization: this.specialization,
      experience: this.experience,
      bio: this.bio,
      rating: this.rating,
      totalSales: this.totalSales,
      languages: this.languages,
      properties: this.properties,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Validate agent data
  validate() {
    if (!this.name) throw new Error('Name is required');
    if (!this.email) throw new Error('Email is required');
    if (!this.phone) throw new Error('Phone number is required');
    return true;
  }

  // Static method to create from Firestore data
  static fromFirestore(doc) {
    const data = doc.data();
    return new Agent({
      id: doc.id,
      ...data
    });
  }
}

module.exports = Agent;
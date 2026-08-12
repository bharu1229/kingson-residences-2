// User Model - Defines user schema and methods
class User {
  constructor(data) {
    this.uid = data.uid || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.phone = data.phone || '';
    this.role = data.role || 'user'; // user, admin, agent
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  // Convert to plain object
  toObject() {
    return {
      uid: this.uid,
      email: this.email,
      name: this.name,
      phone: this.phone,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive
    };
  }

  // Validate user data
  validate() {
    if (!this.email) {
      throw new Error('Email is required');
    }
    if (!this.name) {
      throw new Error('Name is required');
    }
    return true;
  }

  // Static method to create from Firestore data
  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      uid: doc.id,
      ...data
    });
  }
}

module.exports = User;
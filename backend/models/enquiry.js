// Enquiry Model - Defines enquiry schema and methods
class Enquiry {
  constructor(data) {
    this.id = data.id || null;
    this.propertyId = data.propertyId || '';
    this.userId = data.userId || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.message = data.message || '';
    this.preferredDate = data.preferredDate || '';
    this.preferredTime = data.preferredTime || '';
    this.status = data.status || 'pending'; // pending, contacted, viewed, closed
    this.notes = data.notes || '';
    this.assignedTo = data.assignedTo || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Convert to plain object
  toObject() {
    return {
      propertyId: this.propertyId,
      userId: this.userId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message,
      preferredDate: this.preferredDate,
      preferredTime: this.preferredTime,
      status: this.status,
      notes: this.notes,
      assignedTo: this.assignedTo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Validate enquiry data
  validate() {
    if (!this.name) throw new Error('Name is required');
    if (!this.email) throw new Error('Email is required');
    if (!this.phone) throw new Error('Phone number is required');
    if (!this.propertyId) throw new Error('Property ID is required');
    return true;
  }

  // Static method to create from Firestore data
  static fromFirestore(doc) {
    const data = doc.data();
    return new Enquiry({
      id: doc.id,
      ...data
    });
  }
}

module.exports = Enquiry;
// ContactMessage Model - Defines contact message schema and methods
class ContactMessage {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.subject = data.subject || '';
    this.message = data.message || '';
    this.status = data.status || 'unread'; // unread, read, replied
    this.ipAddress = data.ipAddress || '';
    this.userAgent = data.userAgent || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Convert to plain object
  toObject() {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      message: this.message,
      status: this.status,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Validate contact message data
  validate() {
    if (!this.name) throw new Error('Name is required');
    if (!this.email) throw new Error('Email is required');
    if (!this.message) throw new Error('Message is required');
    return true;
  }

  // Static method to create from Firestore data
  static fromFirestore(doc) {
    const data = doc.data();
    return new ContactMessage({
      id: doc.id,
      ...data
    });
  }
}

module.exports = ContactMessage;
import { 
  db, 
  auth, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  getDoc, 
  where, 
  Timestamp,
  serverTimestamp,
  setDoc
} from './firebase-config.js';

import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut
} from 'firebase/auth';

console.log('✅ firebase-auth.js loaded successfully!');

// Admin Login
export async function adminLogin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Admin logged in:', userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw new Error(error.message);
  }
}

// Check Auth State
export function checkAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// Logout
export async function logoutAdmin() {
  try {
    await signOut(auth);
    console.log('✅ Logged out successfully');
    return true;
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw error;
  }
}

// Add Contact Message
export async function addContactMessage(messageData) {
  try {
    console.log('📤 Sending to Firebase...', messageData);
    
    const messagesRef = collection(db, 'contactMessages');
    
    const docRef = await addDoc(messagesRef, {
      name: messageData.name,
      email: messageData.email,
      phone: messageData.phone,
      subject: messageData.subject,
      message: messageData.message,
      status: 'unread',
      createdAt: serverTimestamp(),
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Message sent! Document ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...messageData,
      status: 'unread'
    };
  } catch (error) {
    console.error('❌ Error adding message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
}

// Get Contact Messages
export async function getContactMessages() {
  try {
    const messagesRef = collection(db, 'contactMessages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.timestamp || new Date().toISOString()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('❌ Error getting messages:', error);
    throw error;
  }
}

// Mark Message as Read
export async function markMessageAsRead(messageId) {
  try {
    const messageRef = doc(db, 'contactMessages', messageId);
    await updateDoc(messageRef, {
      status: 'read',
      readAt: serverTimestamp()
    });
    console.log('✅ Message marked as read:', messageId);
    return true;
  } catch (error) {
    console.error('❌ Error marking message as read:', error);
    throw error;
  }
}

// Get All Data for Dashboard
export async function getFirestoreData(collectionName) {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    const data = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        ...docData
      });
    });
    
    return data;
  } catch (error) {
    console.error(`❌ Error getting ${collectionName}:`, error);
    return [];
  }
}

// Update Firestore Document
export async function updateFirestoreDoc(collectionName, docId, updateData) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('❌ Error updating document:', error);
    throw error;
  }
}
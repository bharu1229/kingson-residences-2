const admin = require('firebase-admin');

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBenvwHgwgfMczvYVl94wxJGym5IGr1bl4",
  authDomain: "kingson-r1.firebaseapp.com",
  projectId: "kingson-r1",
  storageBucket: "kingson-r1.firebasestorage.app",
  messagingSenderId: "687203127290",
  appId: "1:687203127290:web:79eddadc4d91286adb9e43",
  measurementId: "G-VGPWS6Z409"
};

// Initialize Firebase Admin SDK
// For development - using environment variables
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

// Initialize Firestore
const db = admin.firestore();

// Initialize Authentication
const auth = admin.auth();

// Initialize Storage
const storage = admin.storage();

// Export services
module.exports = {
  admin,
  db,
  auth,
  storage,
  firebaseConfig
};
// Firebase client-side configuration for Kingson Residences
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { 
    getFirestore, 
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
    setDoc,
    serverTimestamp 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBenvwHgwgfMczvYVl94wxJGym5IGr1bl4",
  authDomain: "kingson-r1.firebaseapp.com",
  projectId: "kingson-r1",
  storageBucket: "kingson-r1.firebasestorage.app",
  messagingSenderId: "687203127290",
  appId: "1:687203127290:web:79eddadc4d91286adb9e43",
  measurementId: "G-VGPWS6Z409"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services for use in other files
export { 
  app, 
  analytics, 
  auth, 
  db, 
  storage,
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
  setDoc,
  serverTimestamp,
  firebaseConfig
};
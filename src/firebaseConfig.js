// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBSI0cFAYzQKTCtI1kzr-pmHs6RYGiTTKw",
  authDomain: "nathaniel-portfolio-c437d.firebaseapp.com",
  projectId: "nathaniel-portfolio-c437d",
  storageBucket: "nathaniel-portfolio-c437d.firebasestorage.app",
  messagingSenderId: "222689026223",
  appId: "1:222689026223:web:2b3edcd90bcd201e35345a",
  measurementId: "G-7ZXJJ3ZHYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore
export const storage = getStorage(app);
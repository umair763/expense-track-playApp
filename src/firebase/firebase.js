// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWXg08LAVxRQ4bZ0LJcFy3ddsVJVS4lJA",
  authDomain: "expense-track-playapp.firebaseapp.com",
  projectId: "expense-track-playapp",
  storageBucket: "expense-track-playapp.firebasestorage.app",
  messagingSenderId: "389916813478",
  appId: "1:389916813478:web:d1653506dc89d25f18ac67",
  measurementId: "G-5D10VGB3TE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH0zAent93J60LoT3YxpGaXLNabA9_W_s",
  authDomain: "swimmingjournal-739f2.firebaseapp.com",
  projectId: "swimmingjournal-739f2",
  storageBucket: "swimmingjournal-739f2.firebasestorage.app",
  messagingSenderId: "274554243839",
  appId: "1:274554243839:web:3e84f12910ff8321d29aca",
  measurementId: "G-82CRJ3D7N3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };

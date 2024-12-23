// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoazJLq-cr7UAILgw6YNoGf014PAG4xW0",
  authDomain: "smartmeter-3f0cc.firebaseapp.com",
  projectId: "smartmeter-3f0cc",
  storageBucket: "smartmeter-3f0cc.appspot.com",
  messagingSenderId: "871085712513",
  appId: "1:871085712513:web:7578b8c5a38a3343ae5980",
  measurementId: "G-ZS358DHYHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance for the app
const auth = getAuth(app);
// Get the Firestore instance
const db = getFirestore(app);

export { auth, db };
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDH8ycwi2t7Yr3keAZUw62unnm8kz5Wnqw",
  authDomain: "guardx-app-in.firebaseapp.com",
  projectId: "guardx-app-in",
  storageBucket: "guardx-app-in.firebasestorage.app",
  messagingSenderId: "759714153819",
  appId: "1:759714153819:web:9b4d624e26fd27e220467e",
  measurementId: "G-97RXSSKB0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize authentication

export { auth };

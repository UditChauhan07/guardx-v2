const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyCN4WHI8jMIF_D54cpPK9dZBz7sZ8qU2iY",
  authDomain: "guardx-95fed.firebaseapp.com",
  databaseURL: "https://guardx-95fed-default-rtdb.firebaseio.com",
  projectId: "guardx-95fed",
  storageBucket: "guardx-95fed.appspot.com", // Corrected URL
  messagingSenderId: "627987328108",
  appId: "1:627987328108:web:eb6f5b4ecd7bb528e47c49",
  measurementId: "G-QG76B3KMK4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

module.exports = { auth, database };
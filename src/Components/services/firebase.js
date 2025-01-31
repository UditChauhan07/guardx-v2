import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCN4WHI8jMIF_D54cpPK9dZBz7sZ8qU2iY",
  authDomain: "guardx-95fed.firebaseapp.com",
  databaseURL: "https://guardx-95fed-default-rtdb.firebaseio.com",
  projectId: "guardx-95fed",
  storageBucket: "guardx-95fed.appspot.com",
  messagingSenderId: "627987328108",
  appId: "1:627987328108:web:eb6f5b4ecd7bb528e47c49",
  measurementId: "G-QG76B3KMK4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

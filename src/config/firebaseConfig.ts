import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD4YV-OegsxBZtxj3ZuGkIWuzvJfccthww",
  authDomain: "tinderesturant.firebaseapp.com",
  databaseURL: "https://tinderesturant-default-rtdb.firebaseio.com",
  projectId: "tinderesturant",
  storageBucket: "tinderesturant.firebasestorage.app",
  messagingSenderId: "915903302235",
  appId: "1:915903302235:web:56d3a006c4685efd4d8d7e",
  measurementId: "G-5SG41S22SH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmsQ0htohthTV9D3sQD_7jbxhVwu9ZCUc",
  authDomain: "online-movie-streaming-1610.firebaseapp.com",
  projectId: "online-movie-streaming-1610",
  storageBucket: "online-movie-streaming-1610.appspot.com",
  messagingSenderId: "31136552793",
  appId: "1:31136552793:web:20e5e1c377abbfae32de48",
  measurementId: "G-J6B4DQDJ48",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore(app);

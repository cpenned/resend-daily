// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG57-lGhxlnNqXRVjlgdFYsqT_O1ckgeE",
  authDomain: "resend-daily.firebaseapp.com",
  projectId: "resend-daily",
  storageBucket: "resend-daily.firebasestorage.app",
  messagingSenderId: "749808376087",
  appId: "1:749808376087:web:ce9ef03bbac0ced9313f52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
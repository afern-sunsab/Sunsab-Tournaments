// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKw_fCvh4PFYhUUToCaeA9aliL5PfwrUA",
  authDomain: "sunsabtournamenttest.firebaseapp.com",
  projectId: "sunsabtournamenttest",
  storageBucket: "sunsabtournamenttest.appspot.com",
  messagingSenderId: "335426801759",
  appId: "1:335426801759:web:710b457567c3ee6c154bea",
  measurementId: "G-Y39D5G9KCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
export const strg = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

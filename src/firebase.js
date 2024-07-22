// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvaHW79g9yuPpAdI8Pso_-y7_xClWfCJ8",
  authDomain: "video-library-9ac33.firebaseapp.com",
  projectId: "video-library-9ac33",
  storageBucket: "video-library-9ac33.appspot.com",
  messagingSenderId: "684380179632",
  appId: "1:684380179632:web:2868dce94a35424ad3bf75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC4plBV-fHAMVskez6ehxPDNbEhvMbaFoQ",
    authDomain: "rutwa-in.firebaseapp.com",
    databaseURL: "https://rutwa-in-default-rtdb.firebaseio.com",
    projectId: "rutwa-in",
    storageBucket: "rutwa-in.appspot.com",
    messagingSenderId: "1006936828276",
    appId: "1:1006936828276:web:6fd09b43ccb6a3bde3e421",
    measurementId: "G-6R3F77FJ65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const db = getDatabase(app)
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app)
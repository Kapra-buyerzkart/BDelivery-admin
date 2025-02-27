// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmwh5SPrkF3pj2wMeGDgVHDNNHzcvOVls",
    authDomain: "bdeliverydev.firebaseapp.com",
    projectId: "bdeliverydev",
    storageBucket: "bdeliverydev.firebasestorage.app",
    messagingSenderId: "959806247625",
    appId: "1:959806247625:web:eca9dff56dc9cbad357318",
    measurementId: "G-RJ5TN3DNJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


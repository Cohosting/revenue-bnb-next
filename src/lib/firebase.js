// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyBPh_xGy7LXiMku-1sR8pqVlBRRGwJveQA",
    authDomain: "auth.revenuebnb.com",
    projectId: "price-prediction-52b23",
    storageBucket: "price-prediction-52b23.appspot.com",
    messagingSenderId: "395647856066",
    appId: "1:395647856066:web:7739297c6dbc8ea25aba5b",
    measurementId: "G-BYJ328WFTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app)
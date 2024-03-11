// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBSFk4V-EtoGvWanmoz3gzYhsrHVDeK3A0",
  authDomain: "price-prediction-56917.firebaseapp.com",
  projectId: "price-prediction-56917",
  storageBucket: "price-prediction-56917.appspot.com",
  messagingSenderId: "559357871168",
  appId: "1:559357871168:web:14ddce50a675c16a7ecba5",
  measurementId: "G-6QHYHEDLHT",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app)
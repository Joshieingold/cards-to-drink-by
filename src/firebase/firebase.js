// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPh9WaLlpxSprRhqVpqWbXMgmvjZVRcMA",
  authDomain: "warehousemanager-37f64.firebaseapp.com",
  databaseURL: "https://warehousemanager-37f64-default-rtdb.firebaseio.com",
  projectId: "warehousemanager-37f64",
  storageBucket: "warehousemanager-37f64.firebasestorage.app",
  messagingSenderId: "77701863150",
  appId: "1:77701863150:web:b44f4b67ef8a10f575c5ff",
  measurementId: "G-FXLE969QHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {app, db};
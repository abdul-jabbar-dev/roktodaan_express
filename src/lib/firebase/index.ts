// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1_UWx9gRZ3__kQd0fNElVchP-ftzIAh8",
  authDomain: "roktodan-5e1f6.firebaseapp.com",
  projectId: "roktodan-5e1f6",
  storageBucket: "roktodan-5e1f6.firebasestorage.app",
  messagingSenderId: "1090053624760",
  appId: "1:1090053624760:web:9b1066686a09c7b65f354d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

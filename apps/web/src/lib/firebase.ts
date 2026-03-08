// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR87EfPJcH_1C3dG0Nzi2jj68tukpYqUw",
  authDomain: "pharmaos-5fc57.firebaseapp.com",
  projectId: "pharmaos-5fc57",
  storageBucket: "pharmaos-5fc57.firebasestorage.app",
  messagingSenderId: "902966407858",
  appId: "1:902966407858:web:f21a52d811e65568360fab",
  measurementId: "G-H0S7EKF95Q"
};

// Initialize Firebase only if it hasn't been initialized
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Export GoogleAuthProvider for OAuth sign-in
export const googleProvider = new GoogleAuthProvider();

export default app;

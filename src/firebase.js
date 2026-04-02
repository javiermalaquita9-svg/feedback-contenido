// Import the functions you need from the SDKs you need
// Agrega esta importación arriba
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Importa getAuth para autenticación
import { getStorage } from "firebase/storage"; // Importa getStorage para el almacenamiento de archivos

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWSv4HmAdcHZCGstlzrzlA8qHXXmU9ig8",
  authDomain: "feedback-contenido.firebaseapp.com",
  projectId: "feedback-contenido",
  storageBucket: "feedback-contenido.firebasestorage.app",
  messagingSenderId: "282132077608",
  appId: "1:282132077608:web:b73b5303c95be8c8f3a91d",
  measurementId: "G-ZV75Y74W13"
};

// Initialize Firebase and export services
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app); // Exporta la instancia de autenticación
export const db = getFirestore(app); // Exporta la instancia de Firestore
export const storage = getStorage(app); // Exporta la instancia de Storage
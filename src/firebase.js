import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getStorage } from "firebase/storage";
// Cambiamos getFirestore por initializeFirestore para poder configurar la estabilidad
import { initializeFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBWSv4HmAdcHZCGstlzrzlA8qHXXmU9ig8",
  authDomain: "feedback-contenido.firebaseapp.com",
  projectId: "feedback-contenido",
  storageBucket: "feedback-contenido.firebasestorage.app",
  messagingSenderId: "282132077608",
  appId: "1:282132077608:web:b73b5303c95be8c8f3a91d",
  measurementId: "G-ZV75Y74W13"
};

// Inicializamos la App
const app = initializeApp(firebaseConfig);

// Exportamos los servicios con la configuración de estabilidad (Long Polling)
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Esta es la línea clave para eliminar el error QUIC y asegurar que los datos se guarden
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBPbQuMvRIwk4dDkQmIvYf4IqcTCb61uv0",
  authDomain: "condominio-conectado-94f9f.firebaseapp.com",
  projectId: "condominio-conectado-94f9f",
  storageBucket: "condominio-conectado-94f9f.firebasestorage.app",
  messagingSenderId: "510887003433",
  appId: "1:510887003433:web:fb6184a861455c9d2ca338",
  measurementId: "G-8S2389TYYV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const chatDb = getFirestore(app); // Apenas para chat

// Messaging para notificações
export const messaging = isSupported() ? getMessaging(app) : null;
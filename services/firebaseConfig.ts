import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper para persistencia no React Native com Firebase modular
const { getReactNativePersistence } = require("firebase/auth") as any;

// Configuracao do Firebase (pode ser substituida pelas credenciais do seu projeto Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyBdS8IWKwBVhGlx4OBse3Zd3d4ZUh1ZMXQ",
  authDomain: "projetofirebase-40cfd.firebaseapp.com",
  projectId: "projetofirebase-40cfd",
  storageBucket: "projetofirebase-40cfd.firebasestorage.app",
  messagingSenderId: "712586661792",
  appId: "1:712586661792:web:41a4c2613423c3c5a6dec5"
};

// Inicializacao do App Firebase (com protecao contra reinicializacao em Fast Refresh)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializacao do Firebase Auth com AsyncStorage configurado
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;

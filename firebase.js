import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDMlE3ljSbAv9QNnvspqyewIJANJJyLPZM",
  authDomain: "btcinvestbr.firebaseapp.com",
  projectId: "btcinvestbr",
  storageBucket: "btcinvestbr.firebasestorage.app",
  messagingSenderId: "867549398021",
  appId: "1:867549398021:web:916df8bf77ea302698c86c",
  measurementId: "G-Y7VXPDBH2G"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMlE3ljSbAv9QNnvspqyewIJANJJyLPZM",
  authDomain: "btcinvestbr.firebaseapp.com",
  projectId: "btcinvestbr",
  storageBucket: "btcinvestbr.firebasestorage.app",
  messagingSenderId: "867549398021",
  appId: "1:867549398021:web:916df8bf77ea302698c86c",
  measurementId: "G-Y7VXPDBH2G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

auth.languageCode = "pt-BR";

const form = document.getElementById("cadastroForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

        await sendEmailVerification(userCredential.user);

        alert("Conta criada com sucesso!\n\nVerifique seu e-mail para confirmar sua conta.");

form.reset();

// Aguarda 3 segundos e abre a tela de login
setTimeout(() => {
    window.location.href = "login.html";
}, 3000);

    } catch (erro) {

        alert("Erro: " + erro.message);

    }

});
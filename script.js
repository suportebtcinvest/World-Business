import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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
const auth = getAuth(app);

auth.languageCode = "pt-BR";

// Procura o formulário
const form = document.getElementById("cadastroForm");

if (!form) {
  alert("Erro: formulário com id 'cadastroForm' não foi encontrado.");
} else {

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      await sendEmailVerification(userCredential.user);

      alert("Conta criada com sucesso!\n\nVerifique seu e-mail para confirmar sua conta.");

      form.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);

    } catch (erro) {
      alert("Erro: " + erro.message);
      console.error(erro);
    }

  });

}
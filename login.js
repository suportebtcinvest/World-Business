import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
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

// Formulário de login
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, senha);

        // Verifica se o e-mail foi confirmado
        if (!userCredential.user.emailVerified) {

            alert("Você precisa confirmar seu e-mail antes de fazer login.");

            await signOut(auth);

            return;
        }

        alert("Login realizado com sucesso!");

        // Redireciona para o painel
        window.location.href = "painel.html";

    } catch (erro) {

        switch (erro.code) {

            case "auth/invalid-credential":
                alert("E-mail ou senha incorretos.");
                break;

            case "auth/user-not-found":
                alert("Usuário não encontrado.");
                break;

            case "auth/wrong-password":
                alert("Senha incorreta.");
                break;

            case "auth/invalid-email":
                alert("E-mail inválido.");
                break;

            case "auth/too-many-requests":
                alert("Muitas tentativas. Tente novamente mais tarde.");
                break;

            default:
                console.error(erro);
                alert("Erro ao fazer login: " + erro.message);

        }

    }

});
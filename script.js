import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";

auth.languageCode = "pt-BR";

// Procura o formulário
const form = document.getElementById("cadastroForm");

if (!form) {

  alert("Erro: formulário com id 'cadastroForm' não foi encontrado.");

} else {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    // Dados do formulário
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const indicador = document.getElementById("indicador").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {

      // Cria a conta no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      // Salva os dados do usuário no Firestore
      await setDoc(doc(db, "usuarios", userCredential.user.uid), {

        nome: nome,
        telefone: telefone,
        cpf: cpf,
        indicador: indicador,
        email: email,

        // Administrador
        admin: false,

        // Situação da conta
        status: "pendente",

        // Plano ainda não escolhido
        plano: "",

        // Situação do pagamento
        statusPagamento: "nao_selecionado",

        // Conta bloqueada até aprovação
        contaLiberada: false,

        // Dados financeiros
        saldo: 0,
        indicados: 0,
        ganhos: 0,
        rendimento: 0,

        // Data do cadastro
        dataCadastro: serverTimestamp()

      });

      // Envia o e-mail de confirmação
      await sendEmailVerification(userCredential.user);

      alert(
        "Conta criada com sucesso!\n\nVerifique seu e-mail para confirmar sua conta."
      );

      form.reset();

      setTimeout(() => {

        window.location.href = "investimento.html";

      }, 3000);

    } catch (erro) {

      console.error(erro);

      alert("Erro ao criar conta: " + erro.message);

    }

  });

}
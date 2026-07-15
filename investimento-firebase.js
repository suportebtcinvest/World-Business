import { auth, db } from "./firebase.js";

import {
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const btnPrata = document.getElementById("planoPrata");
const btnOuro = document.getElementById("planoOuro");

async function salvarPlano(plano, valor) {

    const usuario = auth.currentUser;

    if (!usuario) {
        console.log("Usuário não está logado.");
        return;
    }

    try {

        await updateDoc(doc(db, "usuarios", usuario.uid), {

            plano: plano,
            valorPlano: valor,
            statusPagamento: "aguardando_pagamento",
            contaLiberada: false,
            dataEscolhaPlano: serverTimestamp()

        });

        console.log("Plano salvo com sucesso!");

    } catch (erro) {

        console.error("Erro ao salvar plano:", erro);

    }

}

btnPrata.addEventListener("click", () => {

    salvarPlano("prata", 500);

});

btnOuro.addEventListener("click", () => {

    salvarPlano("ouro", 1000);

});
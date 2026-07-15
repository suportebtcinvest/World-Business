import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const tabela = document.getElementById("listaUsuarios");

async function carregarUsuarios() {

    tabela.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "usuarios"));

    querySnapshot.forEach((documento) => {

        const usuario = documento.data();
        const id = documento.id;

        tabela.innerHTML += `
            <tr>
                <td>${usuario.nome || ""}</td>
                <td>${usuario.email || ""}</td>
                <td>${usuario.plano || "Nenhum"}</td>
                <td>${usuario.status || "pendente"}</td>
                <td>R$ ${usuario.saldo || 0}</td>

                <td>
                    <button onclick="ativarUsuario('${id}')">
                        Ativar
                    </button>
                </td>
            </tr>
        `;
    });
}

window.ativarUsuario = async function(id){

    try{

        await updateDoc(doc(db, "usuarios", id), {
            status: "ativo"
        });

        alert("Usuário ativado com sucesso!");

        carregarUsuarios();

    }catch(error){

        console.error(error);
        alert("Erro ao ativar usuário.");

    }

}

carregarUsuarios();
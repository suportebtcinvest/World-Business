import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const tabela = document.getElementById("listaUsuarios");

const areaEdicao = document.getElementById("areaEdicao");

const usuarioId = document.getElementById("usuarioId");

const editPlano = document.getElementById("editPlano");
const editSaldo = document.getElementById("editSaldo");
const editRendimento = document.getElementById("editRendimento");
const editGanhos = document.getElementById("editGanhos");
const editIndicados = document.getElementById("editIndicados");
const editStatus = document.getElementById("editStatus");
const editContaLiberada = document.getElementById("editContaLiberada");

const salvarAlteracoes = document.getElementById("salvarAlteracoes");
const cancelarEdicao = document.getElementById("cancelarEdicao");



async function carregarUsuarios(){

    tabela.innerHTML = "";


    const usuarios = await getDocs(collection(db,"usuarios"));


    usuarios.forEach((documento)=>{


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

                <button onclick="editarUsuario('${id}')">
                    Editar
                </button>


            </td>


        </tr>

        `;


    });


}




window.editarUsuario = async function(id){


    const usuarios = await getDocs(collection(db,"usuarios"));


    usuarios.forEach((documento)=>{


        if(documento.id === id){


            const usuario = documento.data();


            usuarioId.value = id;


            editPlano.value = usuario.plano || "";

            editSaldo.value = usuario.saldo || 0;

            editRendimento.value = usuario.rendimento || 0;

            editGanhos.value = usuario.ganhos || 0;

            editIndicados.value = usuario.indicados || 0;

            editStatus.value = usuario.status || "pendente";


            editContaLiberada.value = usuario.contaLiberada ? "true" : "false";



            areaEdicao.style.display = "block";


        }


    });


}




salvarAlteracoes.addEventListener("click", async ()=>{


    const id = usuarioId.value;



    try{


        await updateDoc(doc(db,"usuarios",id),{


            plano: editPlano.value,


            saldo: Number(editSaldo.value),


            rendimento: Number(editRendimento.value),


            ganhos: Number(editGanhos.value),


            indicados: Number(editIndicados.value),


            status: editStatus.value,


            contaLiberada: editContaLiberada.value === "true"


        });



        alert("Dados atualizados com sucesso!");


        areaEdicao.style.display = "none";


        carregarUsuarios();



    }catch(error){


        console.error(error);

        alert("Erro ao atualizar usuário.");


    }


});




cancelarEdicao.addEventListener("click", ()=>{


    areaEdicao.style.display = "none";


});




carregarUsuarios();
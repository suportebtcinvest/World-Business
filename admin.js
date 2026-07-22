import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ===============================
// ELEMENTOS USUÁRIOS
// ===============================

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



// ===============================
// CARREGAR USUÁRIOS
// ===============================


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


            <td>
                R$ ${usuario.saldo || 0}
            </td>


            <td>

                <button onclick="editarUsuario('${id}')">
                    Editar
                </button>

            </td>


        </tr>


        `;


    });


}




// ===============================
// EDITAR USUÁRIO
// ===============================


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


            editContaLiberada.value =
            usuario.contaLiberada ? "true" : "false";



            areaEdicao.style.display = "block";


        }


    });


}





// ===============================
// SALVAR ALTERAÇÕES
// ===============================


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

            contaLiberada:
            editContaLiberada.value === "true"


        });



        alert("Dados atualizados com sucesso!");


        areaEdicao.style.display = "none";


        carregarUsuarios();



    }catch(error){


        console.error(error);


        alert("Erro ao atualizar usuário.");


    }


});






// ===============================
// CANCELAR EDIÇÃO
// ===============================


cancelarEdicao.addEventListener("click", ()=>{


    areaEdicao.style.display = "none";


});







// ===============================
// SAQUES
// ===============================


const tabelaSaques = document.getElementById("listaSaques");



async function carregarSaques(){


    tabelaSaques.innerHTML = "";



    const saques = await getDocs(collection(db,"saques"));



    saques.forEach((documento)=>{


        const saque = documento.data();

        const id = documento.id;



        tabelaSaques.innerHTML += `


        <tr>


            <td>${saque.nome || ""}</td>


            <td>${saque.email || ""}</td>


            <td>
                R$ ${saque.valor || 0}
            </td>


            <td>
                ${saque.status || "pendente"}
            </td>


            <td>


                <button onclick="aprovarSaque('${id}')">
                    Aprovar
                </button>



                <button onclick="recusarSaque('${id}')">
                    Recusar
                </button>


            </td>


        </tr>


        `;



    });


}





// ===============================
// APROVAR SAQUE
// ===============================

window.aprovarSaque = async function(id){

    // Busca o saque
    const saqueRef = doc(db,"saques",id);
    const saqueSnap = await getDoc(saqueRef);

    const saque = saqueSnap.data();


    // Busca o usuário dono do saque
    const usuarioRef = doc(db,"usuarios",saque.usuarioId);
    const usuarioSnap = await getDoc(usuarioRef);

    const usuario = usuarioSnap.data();


    // Novo saldo
    const novoSaldo = Number(usuario.saldo || 0) - Number(saque.valor);


    // Atualiza saldo do usuário
    await updateDoc(usuarioRef,{

        saldo: novoSaldo

    });


    // Atualiza status do saque
    await updateDoc(saqueRef,{

        status:"aprovado"

    });


    alert("Saque aprovado e saldo atualizado!");


    carregarSaques();

}

// ===============================
// RECUSAR SAQUE
// ===============================

window.recusarSaque = async function(id){


    const saqueRef = doc(db,"saques",id);


    await updateDoc(saqueRef,{

        status:"recusado"

    });


    alert("Saque recusado!");


    carregarSaques();


}

// INICIAR PAINEL

carregarUsuarios();
carregarSaques();
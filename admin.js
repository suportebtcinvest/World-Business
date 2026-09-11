import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    getDoc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// ======================================================
// ELEMENTOS - USUÁRIOS
// ======================================================

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



// ======================================================
// ELEMENTOS - SAQUES
// ======================================================

const listaSaquesPendentes =
    document.getElementById("listaSaquesPendentes");

const listaSaquesPagos =
    document.getElementById("listaSaquesPagos");

const listaSaquesRecusados =
    document.getElementById("listaSaquesRecusados");


const contadorPendentes =
    document.getElementById("contadorPendentes");

const contadorPagos =
    document.getElementById("contadorPagos");

const contadorRecusados =
    document.getElementById("contadorRecusados");



// ======================================================
// VARIÁVEL DOS SAQUES
// ======================================================

let todosSaques = [];



// ======================================================
// CARREGAR USUÁRIOS
// ======================================================

async function carregarUsuarios() {

    tabela.innerHTML = "";

    try {

        const usuarios =
            await getDocs(collection(db, "usuarios"));


        usuarios.forEach((documento) => {

            const usuario = documento.data();

            const id = documento.id;


            tabela.innerHTML += `

                <tr>

                    <td>
                        ${usuario.nome || ""}
                    </td>

                    <td>
                        ${usuario.email || ""}
                    </td>

                    <td>
                        ${usuario.plano || "Nenhum"}
                    </td>

                    <td>
                        ${usuario.status || "pendente"}
                    </td>

                    <td>
                        R$ ${Number(usuario.saldo || 0).toFixed(2)}
                    </td>

                    <td>

                        <button
                            onclick="editarUsuario('${id}')">

                            Editar

                        </button>

                    </td>

                </tr>

            `;

        });


    } catch (error) {

        console.error(
            "Erro ao carregar usuários:",
            error
        );

    }

}



// ======================================================
// EDITAR USUÁRIO
// ======================================================

window.editarUsuario = async function (id) {

    try {

        const usuarioRef =
            doc(db, "usuarios", id);

        const usuarioSnap =
            await getDoc(usuarioRef);


        if (!usuarioSnap.exists()) {

            alert("Usuário não encontrado.");

            return;

        }


        const usuario =
            usuarioSnap.data();


        usuarioId.value = id;

        editPlano.value =
            usuario.plano || "";

        editSaldo.value =
            usuario.saldo || 0;

        editRendimento.value =
            usuario.rendimento || 0;

        editGanhos.value =
            usuario.ganhos || 0;

        editIndicados.value =
            usuario.indicados || 0;

        editStatus.value =
            usuario.status || "pendente";

        editContaLiberada.value =
            usuario.contaLiberada
                ? "true"
                : "false";


        areaEdicao.style.display =
            "block";


        areaEdicao.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        alert(
            "Erro ao carregar os dados do usuário."
        );

    }

};



// ======================================================
// SALVAR ALTERAÇÕES DO USUÁRIO
// ======================================================

salvarAlteracoes.addEventListener(
    "click",
    async () => {

        const id =
            usuarioId.value;


        if (!id) {

            alert(
                "Nenhum usuário selecionado."
            );

            return;

        }


        try {

            await updateDoc(
                doc(db, "usuarios", id),
                {

                    plano:
                        editPlano.value,

                    saldo:
                        Number(editSaldo.value),

                    rendimento:
                        Number(editRendimento.value),

                    ganhos:
                        Number(editGanhos.value),

                    indicados:
                        Number(editIndicados.value),

                    status:
                        editStatus.value,

                    contaLiberada:
                        editContaLiberada.value === "true"

                }
            );


            alert(
                "Dados atualizados com sucesso!"
            );


            areaEdicao.style.display =
                "none";


            carregarUsuarios();


        } catch (error) {

            console.error(error);

            alert(
                "Erro ao atualizar usuário."
            );

        }

    }
);



// ======================================================
// CANCELAR EDIÇÃO
// ======================================================

cancelarEdicao.addEventListener(
    "click",
    () => {

        areaEdicao.style.display =
            "none";

    }
);



// ======================================================
// FORMATAR DATA DO FIREBASE
// ======================================================

function formatarData(data) {

    if (!data) {

        return "Não informado";

    }


    try {

        let dataJS;


        // Timestamp do Firebase

        if (
            typeof data.toDate === "function"
        ) {

            dataJS = data.toDate();

        }

        // Date normal

        else if (
            data instanceof Date
        ) {

            dataJS = data;

        }

        else {

            return "Não informado";

        }


        return dataJS.toLocaleDateString(
            "pt-BR"
        ) + " às " +
        dataJS.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    } catch (error) {

        console.error(
            "Erro ao formatar data:",
            error
        );

        return "Não informado";

    }

}



// ======================================================
// CARREGAR SAQUES
// ======================================================

async function carregarSaques() {

    listaSaquesPendentes.innerHTML = "";

    listaSaquesPagos.innerHTML = "";

    listaSaquesRecusados.innerHTML = "";


    try {

        const resultado =
            await getDocs(
                collection(db, "saques")
            );


        todosSaques = [];


        resultado.forEach(
            (documento) => {

                todosSaques.push({

                    id: documento.id,

                    ...documento.data()

                });

            }
        );


        // ============================================
        // SEPARAR POR STATUS
        // ============================================

        const pendentes =
            todosSaques.filter(
                saque =>
                    (saque.status || "pendente")
                    .toLowerCase() ===
                    "pendente"
            );


        const pagos =
            todosSaques.filter(
                saque =>
                    (saque.status || "")
                    .toLowerCase() ===
                    "aprovado"
            );


        const recusados =
            todosSaques.filter(
                saque =>
                    (saque.status || "")
                    .toLowerCase() ===
                    "recusado"
            );


        // ============================================
        // CONTADORES
        // ============================================

        contadorPendentes.textContent =
            pendentes.length;

        contadorPagos.textContent =
            pagos.length;

        contadorRecusados.textContent =
            recusados.length;



        // ============================================
        // PENDENTES
        // ============================================

        if (pendentes.length === 0) {

            listaSaquesPendentes.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="mensagem-vazia">

                        Nenhum saque pendente.

                    </td>

                </tr>

            `;

        } else {

            pendentes.forEach(
                (saque) => {

                    listaSaquesPendentes.innerHTML += `

                        <tr>

                            <td>
                                ${saque.nome || ""}
                            </td>

                            <td>
                                ${saque.email || ""}
                            </td>

                            <td>
                                R$ ${Number(
                                    saque.valor || 0
                                ).toFixed(2)}
                            </td>

                            <td class="data-saque">

                                ${formatarData(
                                    saque.data
                                )}

                            </td>

                            <td>

                                <span
                                    class="status-pendente">

                                    Pendente

                                </span>

                            </td>

                            <td>

                                <button
                                    class="btn-aprovar"
                                    onclick="aprovarSaque('${saque.id}')">

                                    Aprovar

                                </button>


                                <button
                                    class="btn-recusar"
                                    onclick="recusarSaque('${saque.id}')">

                                    Recusar

                                </button>

                            </td>

                        </tr>

                    `;

                }
            );

        }



        // ============================================
        // PAGOS
        // ============================================

        if (pagos.length === 0) {

            listaSaquesPagos.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="mensagem-vazia">

                        Nenhum saque pago ainda.

                    </td>

                </tr>

            `;

        } else {

            pagos.forEach(
                (saque) => {

                    listaSaquesPagos.innerHTML += `

                        <tr>

                            <td>
                                ${saque.nome || ""}
                            </td>

                            <td>
                                ${saque.email || ""}
                            </td>

                            <td>
                                R$ ${Number(
                                    saque.valor || 0
                                ).toFixed(2)}
                            </td>

                            <td class="data-saque">

                                ${formatarData(
                                    saque.dataPagamento ||
                                    saque.data
                                )}

                            </td>

                            <td>

                                <span
                                    class="status-aprovado">

                                    Pago

                                </span>

                            </td>

                        </tr>

                    `;

                }
            );

        }



        // ============================================
        // RECUSADOS
        // ============================================

        if (recusados.length === 0) {

            listaSaquesRecusados.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="mensagem-vazia">

                        Nenhum saque recusado.

                    </td>

                </tr>

            `;

        } else {

            recusados.forEach(
                (saque) => {

                    listaSaquesRecusados.innerHTML += `

                        <tr>

                            <td>
                                ${saque.nome || ""}
                            </td>

                            <td>
                                ${saque.email || ""}
                            </td>

                            <td>
                                R$ ${Number(
                                    saque.valor || 0
                                ).toFixed(2)}
                            </td>

                            <td class="data-saque">

                                ${formatarData(
                                    saque.dataRecusa ||
                                    saque.data
                                )}

                            </td>

                            <td>

                                <span
                                    class="status-recusado">

                                    Recusado

                                </span>

                            </td>

                        </tr>

                    `;

                }
            );

        }


    } catch (error) {

        console.error(
            "Erro ao carregar saques:",
            error
        );


        alert(
            "Erro ao carregar as solicitações de saque."
        );

    }

}



// ======================================================
// MOSTRAR ABA DE SAQUES
// ======================================================

window.mostrarSaques = function (tipo) {

    const secaoPendentes =
        document.getElementById(
            "secaoPendentes"
        );

    const secaoPagos =
        document.getElementById(
            "secaoPagos"
        );

    const secaoRecusados =
        document.getElementById(
            "secaoRecusados"
        );


    secaoPendentes.style.display =
        "none";

    secaoPagos.style.display =
        "none";

    secaoRecusados.style.display =
        "none";


    if (tipo === "pendentes") {

        secaoPendentes.style.display =
            "block";

    }


    if (tipo === "pagos") {

        secaoPagos.style.display =
            "block";

    }


    if (tipo === "recusados") {

        secaoRecusados.style.display =
            "block";

    }

};



// ======================================================
// APROVAR SAQUE
// ======================================================

window.aprovarSaque = async function (id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja APROVAR este saque?"
        );


    if (!confirmar) {

        return;

    }


    try {

        // ============================================
        // TRANSAÇÃO
        // Evita aprovação duplicada
        // ============================================

        await runTransaction(
            db,
            async (transaction) => {

                const saqueRef =
                    doc(db, "saques", id);


                const saqueSnap =
                    await transaction.get(
                        saqueRef
                    );


                if (!saqueSnap.exists()) {

                    throw new Error(
                        "Saque não encontrado."
                    );

                }


                const saque =
                    saqueSnap.data();


                // ====================================
                // PROTEÇÃO
                // ====================================

                if (
                    saque.status &&
                    saque.status !== "pendente"
                ) {

                    throw new Error(
                        "Este saque já foi processado."
                    );

                }


                if (!saque.usuarioId) {

                    throw new Error(
                        "Este saque não possui usuário vinculado."
                    );

                }


                const usuarioRef =
                    doc(
                        db,
                        "usuarios",
                        saque.usuarioId
                    );


                const usuarioSnap =
                    await transaction.get(
                        usuarioRef
                    );


                if (!usuarioSnap.exists()) {

                    throw new Error(
                        "Usuário não encontrado."
                    );

                }


                const usuario =
                    usuarioSnap.data();


                const saldoAtual =
                    Number(
                        usuario.saldo || 0
                    );


                const valorSaque =
                    Number(
                        saque.valor || 0
                    );


                // ====================================
                // VERIFICAR SALDO
                // ====================================

                if (valorSaque <= 0) {

                    throw new Error(
                        "Valor do saque inválido."
                    );

                }


                if (saldoAtual < valorSaque) {

                    throw new Error(
                        "O usuário não possui saldo suficiente para este saque."
                    );

                }


                const novoSaldo =
                    saldoAtual - valorSaque;


                // ====================================
                // ATUALIZAR SALDO
                // ====================================

                transaction.update(
                    usuarioRef,
                    {

                        saldo: novoSaldo

                    }
                );


                // ====================================
                // APROVAR SAQUE
                // ====================================

                transaction.update(
                    saqueRef,
                    {

                        status: "aprovado",

                        dataPagamento:
                            serverTimestamp()

                    }
                );

            }
        );


        alert(
            "Saque aprovado e saldo atualizado com sucesso!"
        );


        // Atualiza a tabela

        await carregarUsuarios();

        await carregarSaques();


        // Volta para pendentes

        mostrarSaques("pendentes");


    } catch (error) {

        console.error(
            "Erro ao aprovar saque:",
            error
        );


        alert(
            error.message ||
            "Erro ao aprovar o saque."
        );

    }

};



// ======================================================
// RECUSAR SAQUE
// ======================================================

window.recusarSaque = async function (id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja RECUSAR este saque?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const saqueRef =
            doc(db, "saques", id);


        const saqueSnap =
            await getDoc(saqueRef);


        if (!saqueSnap.exists()) {

            alert(
                "Saque não encontrado."
            );

            return;

        }


        const saque =
            saqueSnap.data();


        // ============================================
        // PROTEÇÃO
        // ============================================

        if (
            saque.status &&
            saque.status !== "pendente"
        ) {

            alert(
                "Este saque já foi processado."
            );

            return;

        }


        await updateDoc(
            saqueRef,
            {

                status: "recusado",

                dataRecusa:
                    serverTimestamp()

            }
        );


        alert(
            "Saque recusado com sucesso!"
        );


        await carregarSaques();


        mostrarSaques("pendentes");


    } catch (error) {

        console.error(
            "Erro ao recusar saque:",
            error
        );


        alert(
            "Erro ao recusar o saque."
        );

    }

};



// ======================================================
// INICIAR PAINEL
// ======================================================

carregarUsuarios();

carregarSaques();

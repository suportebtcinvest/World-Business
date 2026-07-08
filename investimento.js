// SUA CHAVE PIX
const chavePix = "11286897408";

// Abre o modal
function abrirPlano(plano, valor){

    document.getElementById("tituloPlano").innerHTML = "Plano " + plano;

    document.getElementById("valorPlano").innerHTML = valor;

    document.getElementById("pix").innerHTML = chavePix;

    document.getElementById("modal").style.display = "flex";

}

// Fecha o modal
function fecharModal(){

    document.getElementById("modal").style.display = "none";

}

// Copia a chave PIX
function copiarPix(){

    navigator.clipboard.writeText(chavePix);

    alert("✅ Chave PIX copiada com sucesso!");

}

// Fecha o modal ao clicar fora dele
window.onclick = function(event){

    const modal = document.getElementById("modal");

    if(event.target == modal){

        modal.style.display = "none";

    }

}
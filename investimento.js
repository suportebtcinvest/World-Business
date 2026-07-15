// SUA CHAVE PIX
const chavePix = "81997987043";

// LINK DO TELEGRAM
const linkTelegram = "https://t.me/worldbussiness";

// Abre o modal
function abrirPlano(plano, valor) {

    document.getElementById("tituloPlano").innerHTML = "Plano " + plano;

    document.getElementById("valorPlano").innerHTML = valor;

    document.getElementById("pix").innerHTML = chavePix;

    document.getElementById("modal").style.display = "flex";

}

// Fecha o modal
function fecharModal() {

    document.getElementById("modal").style.display = "none";

}

// Copia a chave PIX
function copiarPix() {

    navigator.clipboard.writeText(chavePix);

    alert("✅ Chave PIX copiada com sucesso!");

}

// Envia para o Telegram
function enviarComprovante() {

    window.open(linkTelegram, "_blank");

}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {

    const modal = document.getElementById("modal");

    if (event.target == modal) {

        modal.style.display = "none";

    }

}

// Deixa as funções disponíveis para o HTML
window.abrirPlano = abrirPlano;
window.fecharModal = fecharModal;
window.copiarPix = copiarPix;
window.enviarComprovante = enviarComprovante;
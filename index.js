const botao = window.document.getElementById("botaoaparecer");
botao.addEventListener("click",aparecerdiv);
const botao3 = window.document.getElementById("botaoaparecer3");
botao3.addEventListener("click",aparecerdiv);
const botao2 = window.document.getElementById("buttonDivChat");
botao2.addEventListener("click",desaparecerdiv);

function aparecerdiv()
{
    let div = window.document.getElementById("div1");
    botao.classList.add("sumir");
    botao3.classList.add("sumir");
    div.classList.remove("sumir");
    div.classList.add("adicionar");
}
function desaparecerdiv()
{
    let div = window.document.getElementById("div1");
    botao.classList.remove("sumir");
    botao3.classList.remove("sumir");
    div.classList.remove("adicionar");
    div.classList.add("sumir");
}

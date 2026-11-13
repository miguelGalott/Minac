// imports e dados iniciais
import { buscarProdutos, renderizarProdutos } from "./script.js";

let todosProdutos = [];
let categoriaAtual = "geral";
let textoPesquisa = "";
let apenasPromocao = false;

const normalizar = (t) =>
    String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function aplicarFiltros() {
    const filtrados = todosProdutos.filter(produto => {
        const bateCategoria =
            categoriaAtual === "geral" ||
            normalizar(produto.animal) === categoriaAtual;

        const bateNome = normalizar(produto.title).includes(textoPesquisa);

        const batePromocao = !apenasPromocao || produto.promocao === true;

        return bateCategoria && bateNome && batePromocao;
    });

    renderizarProdutos(filtrados);
}

async function iniciar() {
    todosProdutos = await buscarProdutos();
    renderizarProdutos(todosProdutos);

    // Pesquisa
    const barraPesquisa = document.getElementById("barraPesquisa");
    if (barraPesquisa) {
        barraPesquisa.addEventListener("input", (e) => {
            textoPesquisa = normalizar(e.target.value.trim());
            aplicarFiltros();
        });
    }

    
    document.querySelectorAll(".bar-categorias a[data-promocao]").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            apenasPromocao = !apenasPromocao;
            link.classList.toggle("ativo", apenasPromocao);
            aplicarFiltros();
        });
    });


    document.querySelectorAll(".bar-categorias a[data-categoria]").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            categoriaAtual = normalizar(link.dataset.categoria);
            aplicarFiltros();
        });
    });
}

iniciar();
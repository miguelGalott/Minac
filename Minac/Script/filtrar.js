//imports e dados iniciais

import { buscarProdutos, renderizarProdutos } from "./script.js";

let todosProdutos = [];
let categoriaAtual = "geral";
let textoPesquisa = "";

// filtro
const normalizar = (t) =>
    String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function aplicarFiltros() {
    const filtrados = todosProdutos.filter(produto => {
        const bateCategoria =
            categoriaAtual === "geral" ||
            normalizar(produto.animal) === categoriaAtual;
        const bateNome = normalizar(produto.title).includes(textoPesquisa);
        return bateCategoria && bateNome;
    });
    renderizarProdutos(filtrados);
}

async function iniciar() {
    todosProdutos = await buscarProdutos();
    renderizarProdutos(todosProdutos);

    document.getElementById("barraPesquisa").addEventListener("input", (e) => {
        textoPesquisa = normalizar(e.target.value.trim());
        aplicarFiltros();
    });

    document.querySelectorAll(".bar-categorias a[data-categoria]").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            categoriaAtual = link.dataset.categoria;
            aplicarFiltros();
        });
    });
}

iniciar();
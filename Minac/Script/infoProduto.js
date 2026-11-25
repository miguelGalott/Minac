import { buscarProdutosLocais, buscarProdutosApi, formatarBRL } from './produtos.js';

const ID_BASE_API = 1000;
const el = id => document.getElementById(id);

function mostrarErro(mensagem) {
    el('titulo').textContent = mensagem;
    el('fotoDeComplemento').alt = mensagem;
}

async function carregarProduto() {
    const id = Number(new URLSearchParams(location.search).get('id'));

  
    const lista = id > ID_BASE_API ? await buscarProdutosApi() : await buscarProdutosLocais();
    const produto = lista.find(item => item.id === id);

    if (!produto) {
        mostrarErro('Produto não encontrado');
        return;
    }

    document.title = `${produto.title} - Minac Shop`;
    el('fotoDeComplemento').src = produto.image;
    el('fotoDeComplemento').alt = produto.title;
    el('titulo').textContent = produto.title;
    el('price').textContent = formatarBRL(produto.price);
    el('descricao').textContent = produto.descricao;

    if (produto.precoOriginal > produto.price) {
        const porcentagem = Math.round((1 - produto.price / produto.precoOriginal) * 100);
        el('precoAntigo').textContent = formatarBRL(produto.precoOriginal);
        el('precoAntigo').hidden = false;
        el('desconto').textContent = `${porcentagem}% OFF`;
        el('desconto').hidden = false;
    }
}

carregarProduto();
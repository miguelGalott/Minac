import { adicionarAoCarrinho } from './carrinho.js';

const MIN = 1;
const MAX = 99;

const idProduto = Number(new URLSearchParams(location.search).get('id'));

const btnAdicionar = document.querySelector('#btnConfirmar');
const painel = document.querySelector('#painelQuantidade');
const campo = document.querySelector('#quantidadeValor');
const btnMenos = document.querySelector('#quantidadeMenos');
const btnMais = document.querySelector('#quantidadeMais');
const btnColocar = document.querySelector('#colocarNoCarrinho');
const aviso = document.querySelector('#avisoCarrinho');

let quantProduto = 1;

function mostrarQuantidade() {
    campo.textContent = quantProduto;
    btnMenos.disabled = quantProduto <= MIN;
    btnMais.disabled = quantProduto >= MAX;
}

function abrir() {
    aviso.textContent = '';
    painel.classList.add('aberto');
    painel.removeAttribute('inert');
    btnAdicionar.setAttribute('aria-expanded', 'true');
}

function fechar() {
    painel.classList.remove('aberto');
    painel.setAttribute('inert', '');
    btnAdicionar.setAttribute('aria-expanded', 'false');
}

btnAdicionar.addEventListener('click', evento => {
    evento.preventDefault();
    if (painel.classList.contains('aberto')) fechar();
    else abrir();
});

btnMenos.addEventListener('click', () => {
    if (quantProduto > MIN) quantProduto--;
    mostrarQuantidade();
});

btnMais.addEventListener('click', () => {
    if (quantProduto < MAX) quantProduto++;
    mostrarQuantidade();
});

btnColocar.addEventListener('click', () => {
    if (!adicionarAoCarrinho(idProduto, quantProduto)) {
        aviso.textContent = 'Não foi possível identificar o produto.';
        return;
    }

    aviso.textContent = '✓ Salvo! ' + quantProduto + (quantProduto === 1 ? ' unidade no carrinho. ' : ' unidades no carrinho. ');
    const link = document.createElement('a');
    link.href = 'carrinho.html';
    link.textContent = 'Ver carrinho';
    aviso.appendChild(link);

    // some o painel de quantidade e continua na página do produto
    quantProduto = 1;
    mostrarQuantidade();
    fechar();
    btnAdicionar.focus();
});

document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') fechar();
});

mostrarQuantidade();
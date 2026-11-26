import { CarrinhoProdutoInfo, puxarProdutos, alterarQuantidade, removerDoCarrinho } from './carrinho.js';
import { formatarBRL } from './produtos.js';

const containerCarrinho = document.querySelector('.carrinho-produtos');
const checkTudo = document.querySelector('#selecionarTudo');
const btnRemoverSelecionados = document.querySelector('.btn-remover-selecionados');
const totalTexto = document.querySelector('.total-texto');
const btnFinalizar = document.querySelector('.btn-finalizar-compra');
const dicaResumo = document.querySelector('#dicaResumo');

const MIN = 1;
const MAX = 99;

let itens = [];
const selecionados = new Set();

function renderizarCarrinho() {
    if (itens.length === 0) {
        containerCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <span class="emoji" aria-hidden="true">🐾</span>
                <h2>Seu carrinho está vazio</h2>
                <p>Que tal dar uma olhada nos produtos para o seu pet?</p>
                <a href="../index.html" class="btn-continuar">Ver produtos</a>
            </div>`;
    } else {
        containerCarrinho.innerHTML = itens.map(item => `
            <div class="item-carrinho" data-id="${item.id}">
                <input type="checkbox" name="checkProduto" class="check-item"
                    aria-label="Selecionar ${item.title}"
                    ${selecionados.has(item.id) ? 'checked' : ''}>
                <a href="infoProduto.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.title}" class="foto-carrinho" loading="lazy" decoding="async">
                </a>

                <div class="info-produto">
                    <p class="nome-produto">${item.title}</p>
                    <span class="preco-unitario">${formatarBRL(item.price)} cada</span>
                    <button type="button" class="btn-remover-item" aria-label="Remover ${item.title} do carrinho">Remover</button>
                </div>

                <div class="controle-quantidade">
                    <button type="button" class="btn-qtd" data-acao="menos"
                        aria-label="Diminuir quantidade" ${item.quantidade <= MIN ? 'disabled' : ''}>-</button>
                    <span class="qtd-numero">${item.quantidade}</span>
                    <button type="button" class="btn-qtd" data-acao="mais"
                        aria-label="Aumentar quantidade" ${item.quantidade >= MAX ? 'disabled' : ''}>+</button>
                </div>

                <div class="preco-subtotal">
                    <small>Subtotal</small>
                    <span>${formatarBRL(item.subtotal)}</span>
                </div>
            </div>
        `).join('');
    }

    atualizarResumo();
}

function atualizarResumo() {
    const marcados = itens.filter(item => selecionados.has(item.id));
    const quantidade = marcados.reduce((soma, item) => soma + item.quantidade, 0);
    const total = marcados.reduce((soma, item) => soma + item.subtotal, 0);

    totalTexto.innerHTML = `Total (${quantidade} ${quantidade === 1 ? 'item' : 'itens'}) <strong>${formatarBRL(total)}</strong>`;

    checkTudo.checked = itens.length > 0 && marcados.length === itens.length;
    btnRemoverSelecionados.disabled = marcados.length === 0;

    btnFinalizar.classList.toggle('desativado', marcados.length === 0);
    btnFinalizar.setAttribute('aria-disabled', String(marcados.length === 0));
    if (dicaResumo) dicaResumo.hidden = marcados.length > 0 || itens.length === 0;
}

function mudarQuantidade(id, delta) {
    const novaQuantidade = alterarQuantidade(id, delta);
    if (novaQuantidade === false) return;

    const item = itens.find(produto => produto.id === id);
    item.quantidade = novaQuantidade;
    item.subtotal = +(item.price * novaQuantidade).toFixed(2);
    renderizarCarrinho();
}

function removerSelecionados() {
    for (const id of selecionados) removerDoCarrinho(id);

    itens = itens.filter(item => !selecionados.has(item.id));
    selecionados.clear();
    renderizarCarrinho();
}

containerCarrinho.addEventListener('click', evento => {
    const botaoRemover = evento.target.closest('.btn-remover-item');
    if (botaoRemover) {
        const id = Number(botaoRemover.closest('.item-carrinho').dataset.id);
        removerDoCarrinho(id);
        itens = itens.filter(item => item.id !== id);
        selecionados.delete(id);
        renderizarCarrinho();
        return;
    }

    const botao = evento.target.closest('.btn-qtd');
    if (!botao) return;

    const id = Number(botao.closest('.item-carrinho').dataset.id);
    mudarQuantidade(id, botao.dataset.acao === 'mais' ? 1 : -1);
});

containerCarrinho.addEventListener('change', evento => {
    if (!evento.target.classList.contains('check-item')) return;

    const id = Number(evento.target.closest('.item-carrinho').dataset.id);
    if (evento.target.checked) selecionados.add(id);
    else selecionados.delete(id);
    atualizarResumo();
});

checkTudo.addEventListener('change', () => {
    selecionados.clear();
    if (checkTudo.checked) itens.forEach(item => selecionados.add(item.id));

    containerCarrinho.querySelectorAll('.check-item').forEach(check => {
        check.checked = checkTudo.checked;
    });
    atualizarResumo();
});

btnRemoverSelecionados.addEventListener('click', removerSelecionados);

btnFinalizar.addEventListener('click', evento => {
    if (selecionados.size === 0) {
        evento.preventDefault();
        return;
    }
    
    sessionStorage.setItem('ItensSelecionados', JSON.stringify([...selecionados]));
});

async function iniciar() {
    containerCarrinho.innerHTML = '<p>Carregando carrinho...</p>';
    itens = await puxarProdutos();

    if (itens.length === 0 && CarrinhoProdutoInfo.length > 0) {
        containerCarrinho.innerHTML = '<p>Não foi possível carregar os produtos agora.</p>';
        atualizarResumo();
        return;
    }

    
    itens.forEach(item => selecionados.add(item.id));
    renderizarCarrinho();
}

iniciar();
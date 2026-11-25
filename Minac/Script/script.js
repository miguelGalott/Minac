import { buscarProdutosLocais, buscarProdutosApi, formatarBRL } from '../produtos.js'; // Ajuste o caminho se necessário (ex: './produtos.js' se estiver na mesma pasta)
import { adicionarAoCarrinho } from '../carrinho.js';


const containerPrincipal = document.querySelector('#produtos-container');
const btnEsqPrincipal = document.querySelector('#ofertas-principal .seta-esquerda');
const btnDirPrincipal = document.querySelector('#ofertas-principal .seta-direita');


const containerApi = document.querySelector('#produtos-container-api');
const btnEsqApi = document.querySelector('#ofertas-api .seta-esquerda-api') || document.querySelector('#ofertas-api .seta-esquerda');
const btnDirApi = document.querySelector('#ofertas-api .seta-direita-api') || document.querySelector('#ofertas-api .seta-direita');

async function inicializarHome() {
 
    if (containerPrincipal) {
        const produtosLocais = await buscarProdutosLocais();
        renderizarLista(produtosLocais, containerPrincipal);
        configurarCarrossel(containerPrincipal, btnEsqPrincipal, btnDirPrincipal);
    }

  
    if (containerApi) {
        const produtosApi = await buscarProdutosApi();
        renderizarLista(produtosApi, containerApi);
        configurarCarrossel(containerApi, btnEsqApi, btnDirApi);
    }
}

function renderizarLista(lista, container) {
    if (!container) return;
    
    if (lista.length === 0) {
        container.innerHTML = '<p style="padding: 20px;">Nenhum produto encontrado.</p>';
        return;
    }

    container.innerHTML = lista.map(produto => `
        <div class="card-produto">
            ${produto.promocao ? '<span class="selo-promocao">Promoção</span>' : ''}
            <button type="button" class="btn-carrinho-card" data-id="${produto.id}" aria-label="Adicionar ao carrinho: ${produto.title}">
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
            </button>
            <a href="Pages/infoProduto.html?id=${produto.id}">
                <div class="img-container">
                    <img src="${produto.image}" alt="${produto.title}" loading="lazy" decoding="async">
                </div>
                <p class="produto-titulo">${produto.title}</p>
                ${produto.promocao && produto.precoOriginal ? `<p class="produto-preco-antigo"><s>${formatarBRL(produto.precoOriginal)}</s></p>` : ''}
                <p class="produto-preco">${formatarBRL(produto.price)}</p>
            </a>
        </div>
    `).join('');

    container.scrollLeft = 0;
}

function configurarCarrossel(container, btnEsq, btnDir) {
    if (!container) return;

    function passo() {
        const card = container.querySelector('.card-produto');
        if (!card) return 0;
        const gap = parseFloat(getComputedStyle(container).columnGap) || 16;
        return card.offsetWidth + gap;
    }

    function atualizarSetas() {
        if (!btnEsq || !btnDir) return;
        const max = container.scrollWidth - container.clientWidth;
        btnEsq.disabled = container.scrollLeft <= 1;
        btnDir.disabled = container.scrollLeft >= max - 1;
    }

    function rolar(direcao) {
        container.style.scrollSnapType = 'none';
        container.scrollBy({ left: direcao * passo(), behavior: 'smooth' });
        setTimeout(() => {
            container.style.scrollSnapType = 'x mandatory';
        }, 600);
    }

    if (btnEsq) btnEsq.addEventListener('click', () => rolar(-1));
    if (btnDir) btnDir.addEventListener('click', () => rolar(1));

    container.addEventListener('scroll', atualizarSetas, { passive: true });
    window.addEventListener('resize', atualizarSetas);

    container.addEventListener('click', (e) => {
        const botao = e.target.closest('.btn-carrinho-card');
        if (botao) {
            e.preventDefault();
            const idProduto = botao.dataset.id;
            adicionarAoCarrinho(idProduto, 1);
            

            const icone = botao.querySelector('i');
            if (icone) {
                icone.className = 'fas fa-check';
                setTimeout(() => { icone.className = 'fas fa-shopping-cart'; }, 1500);
            }
        }
    });

    atualizarSetas();
}

document.addEventListener('DOMContentLoaded', inicializarHome);
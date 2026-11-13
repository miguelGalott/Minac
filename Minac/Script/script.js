const containerProdutos = document.querySelector('#produtos-container');
const btnEsq = document.querySelector('.seta-esquerda');
const btnDir = document.querySelector('.seta-direita');

// ===================== API =====================

async function carregarProdutos() {
    try {
        const resposta = await fetch('Script/produtos.json');
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
        const produtos = await resposta.json();

        containerProdutos.innerHTML = produtos.map(produto => `
            <div class="card-produto">
                <a href="Pages/carrinho.html" class="btn-carrinho-card" aria-label="Adicionar ao carrinho: ${produto.title}">
                    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                </a>
                <a href="Pages/infoProduto.html">
                    <div class="img-container">
                        <img src="${produto.image}" alt="${produto.title}" loading="lazy" decoding="async">
                    </div>
                    <p class="produto-titulo">${produto.title}</p>
                    <p class="produto-preco">${produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </a>
            </div>
        `).join('');

        atualizarSetas();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        containerProdutos.innerHTML = '<p>Não foi possível carregar os produtos agora.</p>';
    }
}

carregarProdutos();

// ===================== CARROSSEL =====================

// quanto rolar por clique: 1 card + o espaço entre os cards
function passo() {
    const card = containerProdutos.querySelector('.card-produto');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(containerProdutos).columnGap) || 0;
    return card.offsetWidth + gap;
}

// desabilita a seta quando chega no começo ou no fim
function atualizarSetas() {
    const max = containerProdutos.scrollWidth - containerProdutos.clientWidth;
    btnEsq.disabled = containerProdutos.scrollLeft <= 1;
    btnDir.disabled = containerProdutos.scrollLeft >= max - 1;
}

// desliga o snap durante a animação para a rolagem ficar suave
let timerSnap;
function rolar(direcao) {
    containerProdutos.style.scrollSnapType = 'none';
    containerProdutos.scrollBy({ left: direcao * passo(), behavior: 'smooth' });

    clearTimeout(timerSnap);
    timerSnap = setTimeout(() => {
        containerProdutos.style.scrollSnapType = '';
    }, 600);
}

btnEsq.addEventListener('click', () => rolar(-1));
btnDir.addEventListener('click', () => rolar(1));
containerProdutos.addEventListener('scroll', atualizarSetas, { passive: true });
window.addEventListener('resize', atualizarSetas);
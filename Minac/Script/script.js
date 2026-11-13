const containerProdutos = document.querySelector('#produtos-container');
const btnEsq = document.querySelector('.seta-esquerda');
const btnDir = document.querySelector('.seta-direita');

const API_URL = "https://fakestoreapi.com/products";


// mudar uns nomes ai porque essa api é uma merda 

const CATEGORIA_PARA_ANIMAL = {
    "men's clothing": "cachorro",
    "women's clothing": "gato",
    "jewelery": "passaro",
    "electronics": "peixe",
};

const NOMES_PET = {
    cachorro: [
        "Ração Premium para Cães Adultos 10kg",
        "Coleira Ajustável com Guia",
        "Cama Confort para Cães",
        "Brinquedo Mordedor de Corda",
    ],
    gato: [
        "Ração para Gatos Castrados 3kg",
        "Arranhador Torre 3 Andares",
        "Areia Sanitária Granulada 4kg",
        "Fonte de Água para Gatos",
        "Caixa de Transporte Pet",
        "Bolinhas com Guizo (kit 6un)",
    ],
    passaro: [
        "Gaiola Espaçosa para Calopsita",
        "Alpiste Premium 500g",
        "Poleiro de Madeira Natural",
        "Bebedouro Automático para Aves",
    ],
    peixe: [
        "Aquário 40L com Filtro",
        "Ração em Flocos Tropicais 100g",
        "Kit Decoração para Aquário",
        "Aquecedor com Termostato 100W",
        "Bomba de Ar Silenciosa",
        "Condicionador de Água 120ml",
    ],
};

// Converte  produto da API em um produto de pet shop
function adaptarProdutos(listaApi) {
    const contador = {};

    return listaApi.map(item => {
        const animal = CATEGORIA_PARA_ANIMAL[item.category] || "cachorro";
        const nomes = NOMES_PET[animal];

        contador[animal] = (contador[animal] ?? -1) + 1;
        const titulo = nomes[contador[animal] % nomes.length];

        const promocao = item.id % 3 === 0; 
        const precoOriginal = item.price;
        const preco = promocao ? +(precoOriginal * 0.85).toFixed(2) : precoOriginal;

        return {
            id: item.id,
            title: titulo,
            price: preco,
            precoOriginal,
            image: item.image,
            animal,
            promocao,
        };
    });
}

// API
export async function buscarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
        const dados = await resposta.json();
        return adaptarProdutos(dados);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        containerProdutos.innerHTML = '<p>Não foi possível carregar os produtos agora.</p>';
        return [];
    }
}

const formatarBRL = (valor) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Desenha
export function renderizarProdutos(lista) {
    if (lista.length === 0) {
        containerProdutos.innerHTML = '<p>Nenhum produto encontrado.</p>';
    } else {
        containerProdutos.innerHTML = lista.map(produto => `
            <div class="card-produto">
                ${produto.promocao ? '<span class="selo-promocao">Promoção</span>' : ''}
                <a href="Pages/carrinho.html" class="btn-carrinho-card" aria-label="Adicionar ao carrinho: ${produto.title}">
                    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                </a>
                <a href="Pages/infoProduto.html?id=${produto.id}">
                    <div class="img-container">
                        <img src="${produto.image}" alt="${produto.title}" loading="lazy" decoding="async">
                    </div>
                    <p class="produto-titulo">${produto.title}</p>
                    ${produto.promocao
                        ? `<p class="produto-preco-antigo"><s>${formatarBRL(produto.precoOriginal)}</s></p>`
                        : ''}
                    <p class="produto-preco">${formatarBRL(produto.price)}</p>
                </a>
            </div>
        `).join('');
    }

    containerProdutos.scrollLeft = 0; // volta o carrossel pro começo após filtrar
    atualizarSetas();
}

function passo() {
    const card = containerProdutos.querySelector('.card-produto');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(containerProdutos).columnGap) || 0;
    return card.offsetWidth + gap;
}

function atualizarSetas() {
    const max = containerProdutos.scrollWidth - containerProdutos.clientWidth;
    if (btnEsq) btnEsq.disabled = containerProdutos.scrollLeft <= 1;
    if (btnDir) btnDir.disabled = containerProdutos.scrollLeft >= max - 1;
}

let timerSnap;
function rolar(direcao) {
    containerProdutos.style.scrollSnapType = 'none';
    containerProdutos.scrollBy({ left: direcao * passo(), behavior: 'smooth' });

    clearTimeout(timerSnap);
    timerSnap = setTimeout(() => {
        containerProdutos.style.scrollSnapType = '';
    }, 600);
}

btnEsq?.addEventListener('click', () => rolar(-1));
btnDir?.addEventListener('click', () => rolar(1));
containerProdutos.addEventListener('scroll', atualizarSetas, { passive: true });
window.addEventListener('resize', atualizarSetas);
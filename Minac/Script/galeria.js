const galeria = document.querySelector('#galeria-container');
const btnMais = document.querySelector('#btnMais');
const busca = document.querySelector('#barraPesquisa');

const API_URL = "https://dog.ceo/api/breeds/image/random/24";

function nomeDaRaca(url) {
    const parte = url.split('/breeds/')[1]?.split('/')[0] || 'cachorro';
    return parte.split('-').reverse().join(' ');
}

export async function buscarFotos() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
        const dados = await resposta.json();
        if (dados.status !== 'success') throw new Error('Resposta inválida');
        return dados.message.map(url => ({ url, raca: nomeDaRaca(url) }));
    } catch (error) {
        console.error('Erro ao carregar fotos:', error);
        return [];
    }
}

function criarCard(foto) {
    return `
        <figure class="foto-card" data-raca="${foto.raca}">
            <img src="${foto.url}" alt="Cachorro da raça ${foto.raca}" loading="lazy" decoding="async">
            <figcaption>${foto.raca}</figcaption>
        </figure>
    `;
}

export function renderizarFotos(lista, limpar = false) {
    if (limpar) galeria.innerHTML = '';
    if (lista.length === 0 && galeria.children.length === 0) {
        galeria.innerHTML = '<p>Não foi possível carregar as fotos agora.</p>';
        return;
    }
    galeria.insertAdjacentHTML('beforeend', lista.map(criarCard).join(''));
    filtrar();
}

function filtrar() {
    const termo = busca.value.trim().toLowerCase();
    galeria.querySelectorAll('.foto-card').forEach(card => {
        card.hidden = termo !== '' && !card.dataset.raca.includes(termo);
    });
}

async function carregar(limpar = false) {
    btnMais.disabled = true;
    renderizarFotos(await buscarFotos(), limpar);
    btnMais.disabled = false;
}

btnMais.addEventListener('click', () => carregar());
busca.addEventListener('input', filtrar);

carregar(true);
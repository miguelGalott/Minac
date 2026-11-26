import { lerHistorico } from './historico.js';
import { formatarBRL } from './produtos.js';

const CHAVE_USUARIO = 'DadosUsuario';

/* ---------- Tema (BUG-ER03) ---------- */
const radiosTema = document.querySelectorAll('input[name="tema"]');

function marcarTemaAtual() {
    const atual = window.TemaMinac ? window.TemaMinac.ler() : 'claro';
    radiosTema.forEach(r => { r.checked = r.value === atual; });
}

radiosTema.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.checked && window.TemaMinac) window.TemaMinac.definir(radio.value);
    });
});
marcarTemaAtual();

/* ---------- Salvar dados do usuário (BUG-ER01) ---------- */
const form = document.querySelector('#painelUsuario form');
const aviso = document.getElementById('avisoSalvar');
const campos = {
    nome: document.getElementById('uNome'),
    email: document.getElementById('uEmail'),
    pet: document.getElementById('uPet'),
};

function carregarUsuario() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_USUARIO)) || {};
        Object.entries(campos).forEach(([chave, campo]) => { if (campo) campo.value = dados[chave] ?? ''; });
    } catch (erro) {
        console.error('Não foi possível ler os dados salvos.', erro);
    }
}

function mostrarAviso(texto, erro = false) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.classList.toggle('erro', erro);
}

if (form) {
    form.addEventListener('submit', evento => {
        evento.preventDefault(); // evita o POST para uma página estática (HTTP 405)

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const dados = {
            nome: campos.nome.value.trim(),
            email: campos.email.value.trim(),
            pet: campos.pet.value.trim(),
        };

        try {
            localStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados));
            mostrarAviso('✓ Dados salvos!');
        } catch (erro) {
            console.error('Não foi possível salvar os dados.', erro);
            mostrarAviso('Não foi possível salvar os dados neste navegador.', true);
        }
    });
    carregarUsuario();
}

/* ---------- Histórico de compras (BUG-ER02) ---------- */
const painelHistorico = document.getElementById('painelHistorico');

function renderizarHistorico() {
    if (!painelHistorico) return;
    painelHistorico.replaceChildren();

    const pedidos = lerHistorico();
    if (pedidos.length === 0) {
        const vazio = document.createElement('p');
        vazio.textContent = 'Você ainda não fez nenhuma compra.';
        painelHistorico.appendChild(vazio);
        return;
    }

    pedidos.forEach(pedido => {
        const item = document.createElement('article');
        item.className = 'item-historico';

        const numero = document.createElement('span');
        numero.textContent = `Pedido #${pedido.numero}`;

        const data = document.createElement('span');
        data.textContent = new Date(pedido.data).toLocaleDateString('pt-BR');

        const total = document.createElement('strong');
        total.textContent = formatarBRL(pedido.total);

        item.append(numero, data, total);
        painelHistorico.appendChild(item);
    });
}

renderizarHistorico();
// ao voltar com o botão "voltar" do navegador a página pode vir do cache
window.addEventListener('pageshow', () => { marcarTemaAtual(); renderizarHistorico(); });

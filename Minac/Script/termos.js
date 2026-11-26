// Janela de Termos de uso (BUG-ER04): abre pelo link do rodapé.
const CHAVE_TERMOS = 'TermosAceitos';

const janela = document.getElementById('termosUso');
const check = document.getElementById('termosCheck');
const btnAceitar = document.getElementById('termosAceitar');
const btnRecusar = document.getElementById('termosRecusar');
const aviso = document.getElementById('termosAviso');
const links = document.querySelectorAll('.abrir-termos');

let ultimoFoco = null;

function abrir() {
    if (!janela) return;
    ultimoFoco = document.activeElement;
    check.checked = false;
    btnAceitar.disabled = true;
    aviso.hidden = true;
    janela.hidden = false;
    document.body.classList.add('termos-aberto');
    janela.querySelector('.termos-texto')?.focus();
}

function fechar() {
    janela.hidden = true;
    document.body.classList.remove('termos-aberto');
    if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
}

links.forEach(link => {
    link.addEventListener('click', evento => {
        evento.preventDefault();
        abrir();
    });
});

check?.addEventListener('change', () => {
    btnAceitar.disabled = !check.checked;
    if (check.checked) aviso.hidden = true;
});

btnAceitar?.addEventListener('click', () => {
    if (!check.checked) return;
    try { localStorage.setItem(CHAVE_TERMOS, 'true'); } catch (erro) { /* segue sem salvar */ }
    fechar();
});

btnRecusar?.addEventListener('click', () => {
    aviso.hidden = false;
});

document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && janela && !janela.hidden) fechar();
});

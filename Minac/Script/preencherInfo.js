import {
    apenasDigitos,
    formatarCpf, formatarCep, formatarTelefone, formatarCartao, formatarValidade,
    cpfValido, telefoneValido, cepValido, cartaoValido, validadeValida, cvvValido,
    mascararCpf, mascararEmail, mascararTelefone, mascararCep, mascararCartao, mascararCartaoCampo,
} from './privacidade.js';

const CHAVE_PEDIDO = 'PedidoDadosSeguros';
const CHAVE_RASCUNHO = 'RascunhoPreencherInfo';

const form = document.querySelector('form');
const el = id => document.getElementById(id);

const pgPix = el('pgPix');
const blocoCartao = document.querySelector('.campos-cartao');
const blocoPix = document.querySelector('.campos-pix');
const camposCartao = [el('numCartao'), el('nomeCartao'), el('validade'), el('cvv')].filter(Boolean);

/* ---------- Máscara LGPD nos campos ----------
   Enquanto o cliente digita, o campo mostra o valor inteiro.
   Ao sair do campo, ele passa a mostrar só uma parte (ex.: ***.456.789-**).
   O valor real fica em data-real e volta quando o campo ganha foco
   ou quando o formulário é enviado. */
const mascaras = {
    cpf: mascararCpf,
    email: mascararEmail,
    telefone: mascararTelefone,
    cep: mascararCep,
    numCartao: mascararCartaoCampo,
};
const camposMascarados = Object.keys(mascaras).map(el).filter(Boolean);

function revelar(campo) {
    if (campo.dataset.real === undefined) return;
    campo.value = campo.dataset.real;
    delete campo.dataset.real;
}

function ocultar(campo) {
    if (campo.disabled || campo.dataset.real !== undefined) return;
    const mascara = mascaras[campo.id](campo.value);
    if (!mascara) return; // valor incompleto: segue visível (o aviso de erro já aparece)
    campo.dataset.real = campo.value;
    campo.value = mascara;
}

camposMascarados.forEach(campo => {
    campo.addEventListener('focus', () => revelar(campo));
    campo.addEventListener('blur', () => ocultar(campo));
});

/* ---------- Pagamento ---------- */
function atualizarPagamento() {
    if (!pgPix) return;

    const isPix = pgPix.checked;

    if (blocoCartao) blocoCartao.hidden = isPix;
    if (blocoPix) blocoPix.hidden = !isPix;

    camposCartao.forEach(campo => {
        campo.disabled = isPix;
        campo.required = !isPix;
        if (isPix) {
            campo.value = '';
            delete campo.dataset.real;
            campo.setCustomValidity('');
        }
    });
}

document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener('change', atualizarPagamento);
});

/* ---------- Formatação e validação ---------- */
const regras = [
    { campo: el('cpf'), formatar: formatarCpf, valido: cpfValido, msg: 'CPF inválido. Confira os números.' },
    { campo: el('telefone'), formatar: formatarTelefone, valido: telefoneValido, msg: 'Telefone inválido. Use DDD + número.' },
    { campo: el('cep'), formatar: formatarCep, valido: cepValido, msg: 'CEP inválido. Use 8 números.' },
    { campo: el('numCartao'), formatar: formatarCartao, valido: cartaoValido, msg: 'Número de cartão inválido. Use 16 números.' },
    { campo: el('validade'), formatar: formatarValidade, valido: validadeValida, msg: 'Validade inválida ou vencida (MM/AA).' },
    { campo: el('cvv'), formatar: v => apenasDigitos(v).slice(0, 4), valido: cvvValido, msg: 'Código de segurança inválido.' },
].filter(r => r.campo !== null);

function aplicar(regra) {
    if (!regra.campo || regra.campo.disabled) return;
    revelar(regra.campo);
    regra.campo.value = regra.formatar(regra.campo.value);
    const ok = regra.campo.value === '' || regra.valido(regra.campo.value);
    regra.campo.setCustomValidity(ok ? '' : regra.msg);
}

// preenchimento automático do navegador pode mudar o campo sem foco: mascara de novo
function aoMudar(campo, regra) {
    if (regra) aplicar(regra);
    if (camposMascarados.includes(campo) && document.activeElement !== campo) ocultar(campo);
}

regras.forEach(regra => {
    regra.campo.addEventListener('input', () => aoMudar(regra.campo, regra));
    regra.campo.addEventListener('change', () => aoMudar(regra.campo, regra));
});

// e-mail não tem regra de formatação, mas também é mascarado
const campoEmail = el('email');
if (campoEmail) {
    campoEmail.addEventListener('input', () => {
        delete campoEmail.dataset.real;
        aoMudar(campoEmail, null);
    });
}

/* ---------- Rascunho: não perder o que foi digitado ao ler a Política de Privacidade ----------
   Guardamos só durante a ida e volta (sessionStorage, some ao fechar a aba) e
   NUNCA guardamos número do cartão, nome no cartão, validade nem CVV. */
function guardarRascunho() {
    if (!form) return;
    camposMascarados.forEach(revelar);

    const rascunho = {};
    ['nome', 'cpf', 'email', 'telefone', 'cep', 'complemento'].forEach(id => {
        if (el(id)) rascunho[id] = el(id).value;
    });
    rascunho.pagamento = form.querySelector('input[name="pagamento"]:checked')?.value;
    rascunho.tipoEntrega = form.querySelector('input[name="tipoEntrega"]:checked')?.value;
    rascunho.ciencia = !!form.querySelector('input[name="ciencia"]')?.checked;

    try { sessionStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho)); } catch (erro) { /* segue sem guardar */ }
}

function restaurarRascunho() {
    let rascunho = null;
    try {
        rascunho = JSON.parse(sessionStorage.getItem(CHAVE_RASCUNHO));
        sessionStorage.removeItem(CHAVE_RASCUNHO); // usa uma vez e apaga
    } catch (erro) { /* sem rascunho */ }
    if (!rascunho) return;

    ['nome', 'cpf', 'email', 'telefone', 'cep', 'complemento'].forEach(id => {
        if (el(id) && rascunho[id]) el(id).value = rascunho[id];
    });
    if (rascunho.pagamento) {
        const radio = form.querySelector(`input[name="pagamento"][value="${rascunho.pagamento}"]`);
        if (radio) radio.checked = true;
    }
    if (rascunho.tipoEntrega) {
        const radio = form.querySelector(`input[name="tipoEntrega"][value="${rascunho.tipoEntrega}"]`);
        if (radio) radio.checked = true;
    }
    const ciencia = form.querySelector('input[name="ciencia"]');
    if (ciencia) ciencia.checked = !!rascunho.ciencia;

    regras.forEach(aplicar);
    camposMascarados.forEach(ocultar);
}

document.querySelectorAll('a[data-guardar-rascunho]').forEach(link => {
    link.addEventListener('click', guardarRascunho);
});

/* ---------- Envio ---------- */
if (form) {
    form.addEventListener('submit', evento => {
        evento.preventDefault();

        // volta o valor real dos campos mascarados para validar e ler
        camposMascarados.forEach(revelar);
        regras.forEach(aplicar);

        if (!form.checkValidity()) {
            form.reportValidity();
            // reportValidity foca o 1º campo com erro; os demais voltam a ficar mascarados
            camposMascarados.forEach(campo => { if (document.activeElement !== campo) ocultar(campo); });
            return;
        }

        const dados = new FormData(form);
        const pagamento = dados.get('pagamento');
        const tipoEntrega = dados.get('tipoEntrega') || 'retirada';

        const resumo = {
            nome: String(dados.get('nome')).trim(),
            email: mascararEmail(dados.get('email')),
            telefone: mascararTelefone(dados.get('telefone')),
            cpf: mascararCpf(dados.get('cpf')),
            cep: mascararCep(dados.get('cep')),
            complemento: String(dados.get('complemento') || '').trim(),
            pagamento,
            tipoEntrega,
            cartao: pagamento === 'cartao' ? mascararCartao(dados.get('numCartao')) : null,
        };

        try {
            sessionStorage.setItem(CHAVE_PEDIDO, JSON.stringify(resumo));
            sessionStorage.removeItem('PedidoNumeroRegistrado');
            sessionStorage.removeItem(CHAVE_RASCUNHO);
        } catch (erro) {
            console.error('Não foi possível guardar o resumo do pedido.', erro);
        }

        camposCartao.forEach(campo => { campo.value = ''; delete campo.dataset.real; });
        location.href = form.getAttribute('action');
    });

    form.addEventListener('reset', () => {
        setTimeout(() => {
            camposMascarados.forEach(campo => { delete campo.dataset.real; });
            regras.forEach(({ campo }) => { if (campo) campo.setCustomValidity(''); });
            atualizarPagamento();
        }, 0);
    });
}

restaurarRascunho();
atualizarPagamento();

window.addEventListener('pageshow', atualizarPagamento);

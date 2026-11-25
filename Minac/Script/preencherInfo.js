import {
    apenasDigitos,
    formatarCpf, formatarCep, formatarTelefone, formatarCartao, formatarValidade,
    cpfValido, telefoneValido, cepValido, cartaoValido, validadeValida, cvvValido,
    mascararCpf, mascararEmail, mascararTelefone, mascararCep, mascararCartao,
} from './privacidade.js';

const CHAVE_PEDIDO = 'PedidoDadosSeguros';

const form = document.querySelector('form');
const el = id => document.getElementById(id);

const pgPix = el('pgPix');
const blocoCartao = document.querySelector('.campos-cartao');
const blocoPix = document.querySelector('.campos-pix');
const camposCartao = [el('numCartao'), el('nomeCartao'), el('validade'), el('cvv')].filter(Boolean);

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
            campo.setCustomValidity('');
        }
    });
}

document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener('change', atualizarPagamento);
});

const regras = [
    { campo: el('cpf'), formatar: formatarCpf, valido: cpfValido, msg: 'CPF inválido. Confira os números.' },
    { campo: el('telefone'), formatar: formatarTelefone, valido: telefoneValido, msg: 'Telefone inválido. Use DDD + número.' },
    { campo: el('cep'), formatar: formatarCep, valido: cepValido, msg: 'CEP inválido. Use 8 números.' },
    { campo: el('numCartao'), formatar: formatarCartao, valido: cartaoValido, msg: 'Número de cartão inválido.' },
    { campo: el('validade'), formatar: formatarValidade, valido: validadeValida, msg: 'Validade inválida ou vencida (MM/AA).' },
    { campo: el('cvv'), formatar: v => apenasDigitos(v).slice(0, 4), valido: cvvValido, msg: 'Código de segurança inválido.' },
].filter(r => r.campo !== null);

function aplicar(regra) {
    if (!regra.campo || regra.campo.disabled) return;
    regra.campo.value = regra.formatar(regra.campo.value);
    const ok = regra.campo.value === '' || regra.valido(regra.campo.value);
    regra.campo.setCustomValidity(ok ? '' : regra.msg);
}

regras.forEach(regra => {
    regra.campo.addEventListener('input', () => aplicar(regra));
    regra.campo.addEventListener('change', () => aplicar(regra));
});

if (form) {
    form.addEventListener('submit', evento => {
        evento.preventDefault();

      
        regras.forEach(aplicar);

        if (!form.checkValidity()) {
            form.reportValidity();
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
        } catch (erro) {
            console.error('Não foi possível guardar o resumo do pedido.', erro);
        }

        camposCartao.forEach(campo => { campo.value = ''; });
        location.href = form.getAttribute('action');
    });

    form.addEventListener('reset', () => {
        setTimeout(() => {
            regras.forEach(({ campo }) => { if (campo) campo.setCustomValidity(''); });
            atualizarPagamento();
        }, 0);
    });
}


atualizarPagamento();

window.addEventListener('pageshow', atualizarPagamento);
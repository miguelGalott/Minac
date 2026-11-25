
export const apenasDigitos = valor => String(valor ?? '').replace(/\D/g, '');



export function formatarCpf(valor) {
    const d = apenasDigitos(valor).slice(0, 11);
    if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
    if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
    return d;
}

export function formatarCep(valor) {
    const d = apenasDigitos(valor).slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function formatarTelefone(valor) {
    const d = apenasDigitos(valor).slice(0, 11);
    if (d.length > 10) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length > 6) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 0) return `(${d}`;
    return '';
}

export function formatarCartao(valor) {
    return apenasDigitos(valor).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatarValidade(valor) {
    const d = apenasDigitos(valor).slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}



export function cpfValido(valor) {
    const d = apenasDigitos(valor);
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

    const digito = tamanho => {
        let soma = 0;
        for (let i = 0; i < tamanho; i++) soma += Number(d[i]) * (tamanho + 1 - i);
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

export function telefoneValido(valor) {

    return /^[1-9]{2}9?\d{8}$/.test(apenasDigitos(valor));
}

export function cepValido(valor) {
    return /^\d{8}$/.test(apenasDigitos(valor));
}


export function cartaoValido(valor) {
    const d = apenasDigitos(valor);
    if (d.length < 13 || d.length > 19) return false;

    let soma = 0;
    let dobrar = false;
    for (let i = d.length - 1; i >= 0; i--) {
        let n = Number(d[i]);
        if (dobrar) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        soma += n;
        dobrar = !dobrar;
    }
    return soma % 10 === 0;
}

export function validadeValida(valor, hoje = new Date()) {
    const m = /^(\d{2})\/(\d{2})$/.exec(valor);
    if (!m) return false;

    const mes = Number(m[1]);
    const ano = 2000 + Number(m[2]);
    if (mes < 1 || mes > 12) return false;

    
    return ano > hoje.getFullYear() || (ano === hoje.getFullYear() && mes >= hoje.getMonth() + 1);
}

export function cvvValido(valor) {
    return /^\d{3,4}$/.test(apenasDigitos(valor));
}


export function mascararCpf(valor) {
    const d = apenasDigitos(valor);
    return d.length === 11 ? `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**` : '';
}

export function mascararEmail(valor) {
    const [usuario, dominio] = String(valor ?? '').split('@');
    return usuario && dominio ? `${usuario[0]}***@${dominio}` : '';
}

export function mascararTelefone(valor) {
    const d = apenasDigitos(valor);
    if (d.length === 11) return `(${d.slice(0, 2)}) *****-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ****-${d.slice(6)}`;
    return '';
}

export function mascararCep(valor) {
    const d = apenasDigitos(valor);
    return d.length === 8 ? `${d.slice(0, 5)}-***` : '';
}

export function mascararCartao(valor) {
    const d = apenasDigitos(valor);
    return d.length >= 4 ? `•••• ${d.slice(-4)}` : '';
}
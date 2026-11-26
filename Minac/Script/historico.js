const CHAVE_HISTORICO = 'HistoricoPedidos';
const CHAVE_CONTADOR = 'ContadorPedidos';

export function lerHistorico() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_HISTORICO));
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

function proximoNumero() {
    let atual = 0;
    try { atual = Number(localStorage.getItem(CHAVE_CONTADOR)) || 0; } catch (erro) { /* segue em 0 */ }
    return atual + 1;
}

// Registra um pedido e devolve o número formatado (ex.: "000001").
export function registrarPedido({ itens, frete, total }) {
    const numero = proximoNumero();
    const pedido = {
        numero: String(numero).padStart(6, '0'),
        data: new Date().toISOString(),
        itens: itens.map(i => ({ id: i.id, title: i.title, quantidade: i.quantidade, price: i.price })),
        frete,
        total: +Number(total).toFixed(2),
    };

    try {
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify([pedido, ...lerHistorico()]));
        localStorage.setItem(CHAVE_CONTADOR, String(numero));
    } catch (erro) {
        console.error('Não foi possível salvar o pedido no histórico.', erro);
    }
    return pedido.numero;
}

import { puxarProdutos } from './carrinho.js';
import { formatarBRL } from './produtos.js';

const CHAVE_PEDIDO = 'PedidoDadosSeguros';

async function inicializarFinalizacao() {

    let dadosPedido = {};
    try {
        dadosPedido = JSON.parse(sessionStorage.getItem(CHAVE_PEDIDO)) || {};
    } catch (e) {
        console.error('Erro ao ler dados do pedido', e);
    }


    document.getElementById('resumoNome').textContent = dadosPedido.nome || 'Não informado';
    document.getElementById('resumoCep').textContent = dadosPedido.cep || 'Não informado';
    
    const isEntregaCasa = dadosPedido.tipoEntrega === 'casa';
    document.getElementById('resumoEntrega').textContent = isEntregaCasa ? 'Receber em casa' : 'Retirar na loja';
    
    const pagamentoTexto = dadosPedido.pagamento === 'pix' ? 'Pix' : `Cartão (${dadosPedido.cartao || '****'})`;
    document.getElementById('resumoPagamento').textContent = pagamentoTexto;


    // mostra só o que foi marcado no carrinho, com a quantidade escolhida
    let selecionados = [];
    try {
        selecionados = JSON.parse(sessionStorage.getItem('ItensSelecionados')) || [];
    } catch (e) {
        console.error('Erro ao ler os itens selecionados', e);
    }
    const produtosCarrinho = (await puxarProdutos()).filter(item => selecionados.includes(item.id));
    const containerProdutos = document.getElementById('listaProdutosFinal');
    
    let subtotalProdutos = 0;

    if (produtosCarrinho.length === 0) {
        containerProdutos.innerHTML = '<p>Nenhum produto no carrinho.</p>';
    } else {
        containerProdutos.innerHTML = produtosCarrinho.map(item => {
            subtotalProdutos += item.subtotal;
            return `
                <div class="linha">
                    <div class="linha-produto">
                        <img class="foto-mini" src="${item.image}" alt="${item.title}">
                        <span>${item.title}<br>${item.quantidade} × ${formatarBRL(item.price)}</span>
                    </div>
                    <strong>${formatarBRL(item.subtotal)}</strong>
                </div>
            `;
        }).join('');
    }


    const valorFrete = isEntregaCasa ? 20.00 : 0.00;
    document.getElementById('valorFrete').textContent = formatarBRL(valorFrete);

    const totalGeral = subtotalProdutos + valorFrete;
    document.getElementById('valorTotalGeral').textContent = formatarBRL(totalGeral);


}

document.addEventListener('DOMContentLoaded', inicializarFinalizacao);
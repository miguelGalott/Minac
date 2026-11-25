import { buscarProdutos } from './produtos.js';

const CHAVE = 'CarrinhoProdutoInfo';
const MIN_POR_PRODUTO = 1;
const MAX_POR_PRODUTO = 99;

function carregar() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE));
        if (!Array.isArray(dados)) return [];
        return dados.filter(par => Array.isArray(par) && par.length === 2);
    } catch (erro) {
        return [];
    }
}

function salvar() {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(CarrinhoProdutoInfo));
    } catch (erro) {
        console.error('Não foi possível salvar o carrinho.', erro);
    }
}

export const CarrinhoProdutoInfo = carregar();

export function adicionarAoCarrinho(id, quantidade = 1) {
    id = Number(id);
    quantidade = Math.floor(Number(quantidade));
    if (!Number.isInteger(id) || id <= 0 || !(quantidade >= 1)) return false;

    const existente = CarrinhoProdutoInfo.find(par => par[0] === id);
    if (existente) {
        existente[1] = Math.min(existente[1] + quantidade, MAX_POR_PRODUTO);
    } else {
        CarrinhoProdutoInfo.push([id, Math.min(quantidade, MAX_POR_PRODUTO)]);
    }
    salvar();
    return true;
}

export async function puxarProdutos() {
    const todosOsProdutos = await buscarProdutos();
    const listaFinal = [];

    for (const [id, quantidade] of CarrinhoProdutoInfo) {
        const produto = todosOsProdutos.find(item => item.id === id);

        if (produto) {
            listaFinal.push({
                ...produto,
                quantidade,
                subtotal: +(produto.price * quantidade).toFixed(2),
            });
        }
    }

    return listaFinal;
}

export function alterarQuantidade(id, delta) {
    const par = CarrinhoProdutoInfo.find(par => par[0] === Number(id));
    if (!par) return false;

    par[1] = Math.min(Math.max(par[1] + delta, MIN_POR_PRODUTO), MAX_POR_PRODUTO);
    salvar();
    return par[1];
}

export function removerDoCarrinho(id) {
    const posicao = CarrinhoProdutoInfo.findIndex(par => par[0] === Number(id));
    if (posicao === -1) return false;
    CarrinhoProdutoInfo.splice(posicao, 1);
    salvar();
    return true;
}

export function totalDeItens() {
    return CarrinhoProdutoInfo.reduce((soma, par) => soma + par[1], 0);
}

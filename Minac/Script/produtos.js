const API_URL = 'https://fakestoreapi.com/products';
const COTACAO_DOLAR = 5.5;
const DESCONTO = 0.15; // 15% OFF
const ID_BASE_API = 1000; 

export function formatarBRL(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


export async function buscarProdutosLocais() {
    try {
        const resposta = await fetch(new URL('./produtos.json', import.meta.url));
        if (!resposta.ok) throw new Error('Erro ao carregar produtos locais');
        const dados = await resposta.json();
        
        return dados.map(p => ({
            id: p.id,
            title: p.title,
            image: p.image,
            descricao: 'Produto exclusivo Minac Shop para o seu pet.',
            categoria: p.category,
            animal: p.animal,
            promocao: p.promocoes === 'true',
            precoOriginal: p.price,
            price: p.price,
        }));
    } catch (erro) {
        console.error('Erro ao buscar produtos locais:', erro);
        return [];
    }
}


export async function buscarProdutosApi() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
        const dados = await resposta.json();
        
        return dados.map(p => {
            const precoOriginal = +(p.price * COTACAO_DOLAR).toFixed(2);
            const promocao = p.id % 3 === 0;
            return {
                id: ID_BASE_API + p.id,
                title: p.title,
                image: p.image,
                descricao: p.description,
                categoria: p.category,
                promocao,
                precoOriginal,
                price: promocao ? +(precoOriginal * (1 - DESCONTO)).toFixed(2) : precoOriginal,
            };
        });
    } catch (erro) {
        console.error('Erro na API externa:', erro);
        return [];
    }
}

export async function buscarProdutos() {
    const locais = await buscarProdutosLocais();
    const externas = await buscarProdutosApi();
    return [...locais, ...externas];
}
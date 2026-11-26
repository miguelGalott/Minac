// Botão "voltar" das páginas de informação (privacidade, cookies...).
// Se a página foi aberta de dentro da compra (?voltar=preencherInfo.html),
// volta para lá em vez de mandar o cliente para a página inicial.
(function () {
    // só aceita destinos conhecidos (evita redirecionar para qualquer endereço)
    var PERMITIDOS = ['preencherInfo.html', 'carrinho.html', 'finalizarCompra.html'];

    function destino() {
        var pedido = new URLSearchParams(location.search).get('voltar');
        if (pedido && PERMITIDOS.indexOf(pedido) !== -1) return pedido;
        return null;
    }

    function referrerDoSite() {
        try { return !!document.referrer && new URL(document.referrer).origin === location.origin; }
        catch (e) { return false; }
    }

    document.addEventListener('click', function (evento) {
        var botao = evento.target.closest('.btn-voltar');
        if (!botao) return;

        var alvo = destino();
        if (alvo) {
            evento.preventDefault();
            location.assign(alvo);
        } else if (referrerDoSite() && history.length > 1) {
            evento.preventDefault();
            history.back();
        }
        // senão, segue o link normal para ../index.html
    });
})();

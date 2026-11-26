// Aplica o tema salvo. Roda no <head> (sem type="module") para a página
// já abrir no tema certo, sem piscar o tema claro antes.
(function () {
    var CHAVE = 'TemaMinac';
    var escuroDoAparelho = window.matchMedia('(prefers-color-scheme: dark)');

    function lerEscolha() {
        try {
            var v = localStorage.getItem(CHAVE);
            return v === 'escuro' || v === 'auto' ? v : 'claro';
        } catch (e) {
            return 'claro';
        }
    }

    function aplicar(escolha) {
        var escuro = escolha === 'escuro' || (escolha === 'auto' && escuroDoAparelho.matches);
        if (escuro) document.documentElement.setAttribute('data-tema', 'escuro');
        else document.documentElement.removeAttribute('data-tema');
    }

    function definir(escolha) {
        try { localStorage.setItem(CHAVE, escolha); } catch (e) { /* sem armazenamento: vale só nesta página */ }
        aplicar(escolha);
    }

    // "Seguir o aparelho" acompanha a mudança do sistema em tempo real
    if (escuroDoAparelho.addEventListener) {
        escuroDoAparelho.addEventListener('change', function () { aplicar(lerEscolha()); });
    }

    window.TemaMinac = { ler: lerEscolha, definir: definir };
    aplicar(lerEscolha());
})();

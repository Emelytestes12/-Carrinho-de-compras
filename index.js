const Carrinho = require('./carrinho');

const meuCarrinho = new Carrinho();
console.log("--- Iniciando Venda ---");

meuCarrinho.adicionarItem("1", 3); // Adiciona 3 mouses
console.log("Total do carrinho:", meuCarrinho.total);

const status = meuCarrinho.finalizarVenda("pix");
console.log("Status da operação:", status);
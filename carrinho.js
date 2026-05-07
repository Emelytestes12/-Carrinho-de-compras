const { consultarEstoque, atualizarEstoque } = require('./produtos');
const { processarPagamento } = require('./api_banco');

class Carrinho {
    constructor() {
        this.itens = [];
        this.total = 0;
    }

    adicionarItem(id, qtd) {
        const produto = consultarEstoque(id);
        if (produto && produto.estoque >= qtd) {
            this.itens.push({ id, qtd, preco: produto.preco });
            this.total += produto.preco * qtd;
            return true;
        }
        return false;
    }

    finalizarVenda(metodoPagamento) {
        if (this.itens.length === 0) return "Carrinho vazio";

        const resposta = processarPagamento(metodoPagamento, this.total);

        if (resposta.status === "sucesso") {
            this.itens.forEach(item => atualizarEstoque(item.id, item.qtd));
            return "Venda concluída";
        }
        return "Falha no pagamento";
    }
}

module.exports = Carrinho;
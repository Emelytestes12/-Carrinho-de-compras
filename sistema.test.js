const Carrinho = require('./carrinho');
const { consultarEstoque, atualizarEstoque } = require('./produtos');
const { processarPagamento } = require('./api_banco');
const fs = require('fs');

// Fazemos o mock dos módulos
jest.mock('./produtos');
jest.mock('./api_banco');

describe('Testes do Sistema de Vendas', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Resetamos o banco.json para um estado inicial conhecido antes de cada teste
        const estadoInicial = {
            "1": { "nome": "Mouse", "preco": 50, "estoque": 10 }
        };
        fs.writeFileSync('./banco.json', JSON.stringify(estadoInicial, null, 2));
    });

    test('Unitário: Deve adicionar item ao carrinho usando Mock', () => {
        // Simulamos o retorno sem ler o arquivo
        consultarEstoque.mockReturnValue({ preco: 100, estoque: 10 });
        
        const cart = new Carrinho();
        const sucesso = cart.adicionarItem("1", 1);
        
        expect(sucesso).toBe(true);
        expect(cart.total).toBe(100);
    });

    test('Integração: Fluxo completo (Venda -> Banco -> Estoque)', () => {
        // Importamos as funções REAIS para este teste de integração
        const produtosReais = jest.requireActual('./produtos');
        const bancoReal = jest.requireActual('./api_banco');

        // Mandamos o Mock usar a implementação real apenas neste teste
        consultarEstoque.mockImplementation(produtosReais.consultarEstoque);
        atualizarEstoque.mockImplementation(produtosReais.atualizarEstoque);
        processarPagamento.mockImplementation(bancoReal.processarPagamento);
        
        const cart = new Carrinho();
        cart.adicionarItem("1", 2); // Adiciona 2 mouses
        
        const resultado = cart.finalizarVenda("pix");
        
        expect(resultado).toBe("Venda concluída");

        // Lemos o arquivo para ver se o estoque realmente baixou
        const dados = JSON.parse(fs.readFileSync('./banco.json', 'utf-8'));
        
        // Se tinha 10 e vendeu 2, tem que ser 8
        expect(dados["1"].estoque).toBe(8); 
    });
});
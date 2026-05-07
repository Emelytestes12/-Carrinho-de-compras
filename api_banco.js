const processarPagamento = (metodo, valor) => {
    const metodosValidos = ['pix', 'cartao'];
    if (metodosValidos.includes(metodo.toLowerCase()) && valor > 0) {
        return { status: "sucesso", codigo: 200 };
    }
    return { status: "erro", codigo: 400 };
};

module.exports = { processarPagamento };
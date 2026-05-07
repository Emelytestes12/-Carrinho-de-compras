const fs = require('fs');
const caminhoBanco = './banco.json';

const consultarEstoque = (id) => {
    const dados = JSON.parse(fs.readFileSync(caminhoBanco, 'utf-8'));
    return dados[id] || null;
};

const atualizarEstoque = (id, quantidade) => {
    const dados = JSON.parse(fs.readFileSync(caminhoBanco, 'utf-8'));
    if (dados[id]) {
        dados[id].estoque -= quantidade;
        fs.writeFileSync(caminhoBanco, JSON.stringify(dados, null, 2));
        return true;
    }
    return false;
};

module.exports = { consultarEstoque, atualizarEstoque };
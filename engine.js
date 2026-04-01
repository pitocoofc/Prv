const fs = require('fs');
const path = require('path');

/**
 * SISTEMA DE TAGS HÍBRIDO (ORQUESTRADOR LOCAL)
 */
function motorHibrido(conteudo) {
    const regexTag = /<\/(\w+)>\s*([\s\S]*?)\s*<\/\1>/g;
    let execucaoFinal = "";
    let match;

    while ((match = regexTag.exec(conteudo)) !== null) {
        const tag = match[1].toLowerCase();
        const codigoInterno = match[2];

        if (tag === 'javascript' || tag === 'js') {
            execucaoFinal += `\n// [Bloco JS Direto]\n${codigoInterno}\n`;
        } else {
            // Tenta carregar o tradutor local (ex: ./portugol.js)
            const caminhoTradutor = path.join(__dirname, `${tag}.js`);
            
            if (fs.existsSync(caminhoTradutor)) {
                const tradutor = require(caminhoTradutor);
                execucaoFinal += `\n// [Bloco ${tag} Traduzido]\n${tradutor(codigoInterno)}\n`;
            } else {
                console.warn(`[Aviso] Tradutor para "${tag}" não encontrado em: ${caminhoTradutor}`);
            }
        }
    }
    return execucaoFinal;
}

// --- LÓGICA DE EXECUÇÃO ---

const caminhoArquivo = process.argv[2];

if (!caminhoArquivo) {
    console.error("ERRO: Informe o arquivo de entrada (ex: node engine.js teste.poly)");
    process.exit(1);
}

try {
    const textoBruto = fs.readFileSync(caminhoArquivo, 'utf-8');
    const codigoPronto = motorHibrido(textoBruto);

    if (!codigoPronto) {
        console.log("AVISO: Nenhuma tag válida encontrada.");
        process.exit(0);
    }

    console.log("--- BUNDLE GERADO ---");
    console.log(codigoPronto);
    console.log("\n--- EXECUÇÃO ---");

    eval(codigoPronto);

} catch (e) {
    console.error("ERRO CRÍTICO:");
    console.error(e.message);
}

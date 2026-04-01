const fs = require('fs');
const path = require('path');

/**
 * SISTEMA DE TAGS HÍBRIDO (ORQUESTRADOR LOCAL)
 */
function motorHibrido(conteudo) {
    // Regex para capturar blocos </tag> ... </tag>
    const regexTag = /<\/(\w+)>\s*([\s\S]*?)\s*<\/\1>/g;
    let execucaoFinal = "";
    let match;

    while ((match = regexTag.exec(conteudo)) !== null) {
        const tag = match[1].toLowerCase();
        const codigoInterno = match[2];

        if (tag === 'javascript' || tag === 'js') {
            execucaoFinal += `\n// --- [Bloco JS Direto] ---\n${codigoInterno}\n`;
        } else {
            // Busca o tradutor correspondente na mesma pasta (ex: ./portugol.js)
            const caminhoTradutor = path.resolve(__dirname, `${tag}.js`);
            
            if (fs.existsSync(caminhoTradutor)) {
                try {
                    // Carrega a função de tradução do arquivo externo
                    const tradutor = require(caminhoTradutor);
                    execucaoFinal += `\n// --- [Bloco ${tag} Traduzido] ---\n${tradutor(codigoInterno)}\n`;
                } catch (e) {
                    console.error(`[Erro] Falha ao carregar o tradutor "${tag}":`, e.message);
                }
            } else {
                console.warn(`[Aviso] Tradutor para "${tag}" não encontrado em: ${caminhoTradutor}`);
            }
        }
    }
    return execucaoFinal;
}

// --- LÓGICA DE BUSCA E EXECUÇÃO ---

// Pega o nome do arquivo do argumento ou usa 'code.mts' como padrão se existir
const argArquivo = process.argv[2];
const arquivoAlvo = argArquivo || 'code.mts';
const caminhoAbsoluto = path.resolve(process.cwd(), arquivoAlvo);

if (!fs.existsSync(caminhoAbsoluto)) {
    console.error(`ERRO: Arquivo de código "${arquivoAlvo}" não encontrado na pasta atual.`);
    console.log("Uso: node engine.js [arquivo.mts]");
    process.exit(1);
}

try {
    const textoBruto = fs.readFileSync(caminhoAbsoluto, 'utf-8');
    const codigoPronto = motorHibrido(textoBruto);

    if (!codigoPronto.trim()) {
        console.log("AVISO: Nenhuma tag </portugol> ou </javascript> processada.");
        process.exit(0);
    }

    console.log("========================================");
    console.log(`   EXECUTANDO: ${arquivoAlvo}`);
    console.log("========================================\n");

    // Executa o bundle final transpilado
    eval(codigoPronto);

    console.log("\n========================================");
    console.log("   FIM DA EXECUÇÃO");
    console.log("========================================");

} catch (e) {
    console.error("\n[ERRO DE EXECUÇÃO]:");
    console.error(e.stack);
}

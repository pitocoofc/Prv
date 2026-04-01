const fs = require('fs');
const path = require('path');

/**
 * Função Recursiva para buscar um arquivo em todas as subpastas
 */
function buscarArquivo(diretorio, nomeArquivo) {
    const arquivos = fs.readdirSync(diretorio);

    for (const arquivo of arquivos) {
        const caminhoCompleto = path.join(diretorio, arquivo);
        const estatistica = fs.statSync(caminhoCompleto);

        if (estatistica.isDirectory()) {
            const resultado = buscarArquivo(caminhoCompleto, nomeArquivo);
            if (resultado) return resultado;
        } else if (arquivo === nomeArquivo) {
            return caminhoCompleto;
        }
    }
    return null;
}

/**
 * SISTEMA DE TAGS HÍBRIDO (ORQUESTRADOR COM BUSCA)
 */
function motorHibrido(conteudo) {
    const regexTag = /<\/(\w+)>\s*([\s\S]*?)\s*<\/\1>/g;
    let execucaoFinal = "";
    let match;

    while ((match = regexTag.exec(conteudo)) !== null) {
        const tag = match[1].toLowerCase();
        const codigoInterno = match[2];

        // O ";" no início de cada bloco impede que o JS tente invocar o resultado anterior
        if (tag === 'javascript' || tag === 'js') {
            execucaoFinal += `\n; // --- [JS Direto] ---\n${codigoInterno}\n;`;
        } else {
            const nomeTradutor = `${tag}.js`;
            const caminhoTradutor = buscarArquivo(__dirname, nomeTradutor);
            
            if (caminhoTradutor) {
                try {
                    delete require.cache[require.resolve(caminhoTradutor)];
                    const tradutor = require(caminhoTradutor);
                    // Adicionando ";" antes e depois da tradução por segurança
                    execucaoFinal += `\n; // --- [Bloco ${tag} Traduzido de: ${path.relative(__dirname, caminhoTradutor)}] ---\n${tradutor(codigoInterno)}\n;`;
                } catch (e) {
                    console.error(`[Erro] Falha ao carregar o tradutor "${tag}":`, e.message);
                }
            } else {
                console.warn(`[Aviso] Tradutor "${nomeTradutor}" não encontrado na raiz ou subpastas.`);
            }
        }
    }
    return execucaoFinal;
}

// --- LÓGICA DE BUSCA DO ARQUIVO DE CÓDIGO (code.mts) ---

const argArquivo = process.argv[2];
const arquivoAlvo = argArquivo || 'code.mts';
const caminhoAbsoluto = path.resolve(process.cwd(), arquivoAlvo);

if (!fs.existsSync(caminhoAbsoluto)) {
    console.error(`ERRO: Arquivo de código "${arquivoAlvo}" não encontrado.`);
    process.exit(1);
}

try {
    const textoBruto = fs.readFileSync(caminhoAbsoluto, 'utf-8');
    const codigoPronto = motorHibrido(textoBruto);

    if (!codigoPronto.trim()) {
        console.log("AVISO: Nenhuma tag processada.");
        process.exit(0);
    }

    console.log("========================================");
    console.log(`   MOTOR POLIGLOTA - EXECUTANDO: ${arquivoAlvo}`);
    console.log("========================================\n");

    // Agora o código rodará sem tentar invocar logs como funções
    eval(codigoPronto);

    console.log("\n========================================");
} catch (e) {
    console.error("\n[ERRO NA EXECUÇÃO]:", e.stack);
}

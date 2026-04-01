const fs = require('fs');

/**
 * TRADUTOR PORTUGOL -> JAVASCRIPT (O Motor que você definiu)
 */
function tradutorPortugol(codigo) {
    let js = codigo;

    // 1. Limpeza Inicial e Comentários
    js = js.replace(/algoritmo\s+".*"/gi, '');
    
    // 2. Tratamento de Variáveis (Bloco VAR)
    js = js.replace(/var[\s\S]*?inicio/gi, (match) => {
        return match
            .replace(/var/gi, '')
            .replace(/inicio/gi, '')
            .replace(/([\w\s,]+)\s*:\s*(inteiro|real|caractere|logico|vetor.*)/gi, 'let $1;')
            .trim();
    });

    // 3. Operadores Lógicos e Matemáticos
    js = js.replace(/\bnao\b/gi, '!')
           .replace(/\be\b/gi, '&&')
           .replace(/\bou\b/gi, '||')
           .replace(/<>/g, '!=')
           .replace(/MOD/gi, '%')
           .replace(/DIV/gi, 'Math.floor');

    // 4. Atribuição
    js = js.replace(/(<-|:=)/g, '=');

    // 5. Estruturas de Repetição
    js = js.replace(/para\s+(\w+)\s+de\s+(.*)\s+ate\s+(.*)\s+faca/gi, 'for(let $1 = $2; $1 <= $3; $1++) {');
    js = js.replace(/fimpara/gi, '}');
    js = js.replace(/enquanto\s+(.*)\s+faca/gi, 'while ($1) {');
    js = js.replace(/fimenquanto/gi, '}');
    js = js.replace(/repita/gi, 'do {');
    js = js.replace(/ate\s+(.*)/gi, '} while (!($1));');

    // 6. Condicionais
    js = js.replace(/se\s+(.*)\s+entao/gi, 'if ($1) {')
           .replace(/senao/gi, '} else {')
           .replace(/fimse/gi, '}');

    // 7. Saída de Dados
    js = js.replace(/escreva\((.*)\)/gi, 'console.log($1)')
           .replace(/escreval\((.*)\)/gi, 'console.log($1)');

    // 8. Limpeza Final
    js = js.replace(/fimalgoritmo|inicio/gi, '');

    return js.trim();
}

/**
 * SISTEMA DE TAGS HÍBRIDO (O Coração da sua ideia)
 */
function motorHibrido(conteudo) {
    // Regex para achar blocos </linguagem> ... </linguagem>
    // Agora aceita tanto </portugol> quanto </javascript>
    const regexTag = /<\/(\w+)>\s*([\s\S]*?)\s*<\/\1>/g;
    
    let execucaoFinal = "";
    let match;

    while ((match = regexTag.exec(conteudo)) !== null) {
        const tag = match[1].toLowerCase();
        const codigoInterno = match[2];

        if (tag === 'portugol') {
            // Aplica a tradução robusta no bloco de portugol
            execucaoFinal += `\n// [Bloco Portugol Traduzido]\n${tradutorPortugol(codigoInterno)}\n`;
        } else if (tag === 'javascript' || tag === 'js') {
            // Libera o JavaScript direto sem mexer em nada
            execucaoFinal += `\n// [Bloco JS Direto]\n${codigoInterno}\n`;
        }
    }

    return execucaoFinal;
}

// --- LOGICA DE SISTEMA ---

const caminhoArquivo = process.argv[2];

if (!caminhoArquivo) {
    console.error("ERRO: Informe o arquivo (ex: node engine.js teste.poly)");
    process.exit(1);
}

try {
    const textoBruto = fs.readFileSync(caminhoArquivo, 'utf-8');
    const codigoPronto = motorHibrido(textoBruto);

    if (!codigoPronto) {
        console.log("AVISO: Nenhuma tag </portugol> ou </javascript> encontrada.");
        process.exit(0);
    }

    console.log("========================================");
    console.log("   CÓDIGO FINAL (TRANSPILED)            ");
    console.log("========================================");
    console.log(codigoPronto);
    console.log("\n========================================");
    console.log("   RESULTADO DA EXECUÇÃO                ");
    console.log("========================================");

    // Executa o bundle final
    eval(codigoPronto);

    console.log("\n========================================");

} catch (e) {
    console.error("ERRO NO PROCESSAMENTO:");
    console.error(e.message);
}
      

/**
 * Lógica de Tradução: Portugol -> JavaScript
 * Este arquivo é carregado dinamicamente pelo motor.
 */
function traduzir(codigo) {
    let js = codigo;

    // 1. Limpeza Inicial
    js = js.replace(/algoritmo\s+".*"/gi, '');
    
    // 2. Variáveis (Bloco VAR)
    js = js.replace(/var[\s\S]*?inicio/gi, (match) => {
        return match
            .replace(/var/gi, '')
            .replace(/inicio/gi, '')
            .replace(/([\w\s,]+)\s*:\s*(inteiro|real|caractere|logico|vetor.*)/gi, 'let $1;')
            .trim();
    });

    // 3. Operadores
    js = js.replace(/\bnao\b/gi, '!')
           .replace(/\be\b/gi, '&&')
           .replace(/\bou\b/gi, '||')
           .replace(/<>/g, '!=')
           .replace(/MOD/gi, '%')
           .replace(/DIV/gi, 'Math.floor');

    // 4. Atribuição e Estruturas
    js = js.replace(/(<-|:=)/g, '=');
    js = js.replace(/para\s+(\w+)\s+de\s+(.*)\s+ate\s+(.*)\s+faca/gi, 'for(let $1 = $2; $1 <= $3; $1++) {');
    js = js.replace(/fimpara/gi, '}');
    js = js.replace(/enquanto\s+(.*)\s+faca/gi, 'while ($1) {');
    js = js.replace(/fimenquanto/gi, '}');
    js = js.replace(/repita/gi, 'do {');
    js = js.replace(/ate\s+(.*)/gi, '} while (!($1));');

    // 5. Condicionais e Saída
    js = js.replace(/se\s+(.*)\s+entao/gi, 'if ($1) {')
           .replace(/senao/gi, '} else {')
           .replace(/fimse/gi, '}');
    js = js.replace(/escreval?\((.*)\)/gi, 'console.log($1)');

    // 6. Limpeza Final
    js = js.replace(/fimalgoritmo|inicio/gi, '');

    return js.trim();
}

// Exporta para o motor local
module.exports = traduzir;

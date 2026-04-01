/**
 * Tradutor Modular: Brainfuck -> JavaScript
 * Focado em manipulação de fita de memória (Uint8Array)
 */
function traduzir(codigo) {
    // Inicializamos uma fita de 30.000 células (padrão BF)
    // Usamos Uint8Array para garantir que cada célula tenha 1 byte (0-255)
    let js = `
        (function() {
            const fita = new Uint8Array(30000);
            let p = 0;
    `;

    // Mapeamento de símbolos para comandos JS
    const tokens = {
        '>': 'p++;',                                // Move ponteiro para direita
        '<': 'p--;',                                // Move ponteiro para esquerda
        '+': 'fita[p]++;',                          // Incrementa valor na célula
        '-': 'fita[p]--;',                          // Decrementa valor na célula
        '.': 'process.stdout.write(String.fromCharCode(fita[p]));', // Saída ASCII
        ',': '// leia não implementado;',            // Entrada (ignorado conforme seu pedido)
        '[': 'while (fita[p]) {',                   // Início do loop
        ']': '}'                                    // Fim do loop
    };

    // Processa o código caractere por caractere
    for (let char of codigo) {
        if (tokens[char]) {
            js += `\n            ${tokens[char]}`;
        }
    }

    js += `\n        })();`;
    return js;
}

module.exports = traduzir;

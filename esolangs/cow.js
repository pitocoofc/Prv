/**
 * Tradutor Modular: COW -> JavaScript (Versão Estável)
 */
function traduzir(codigo) {
    // Regex precisa pegar exatamente as variações de "moo"
    const instrucoes = codigo.match(/moo|mOo|moO|mOO|Moo|MOo|MoO|MOO|OOO|MMM|OOM|oom/gi) || [];
    
    let js = `
    (function() {
        const fita = new Uint8Array(30000);
        let p = 0;
        let registro = null;
        const comandos = ${JSON.stringify(instrucoes)};
        let ptr = 0;

        while (ptr < comandos.length) {
            let cmd = comandos[ptr++];
            if (!cmd) break; // Trava de segurança

            switch(cmd) { // Removido toLowerCase aqui para usar case-sensitive real da COW
                case 'moO': p++; break;
                case 'mOo': p--; break;
                case 'moo': // Início de Loop
                    if (fita[p] === 0) {
                        let loop = 1;
                        while (loop > 0 && ptr < comandos.length) {
                            let c = comandos[ptr++];
                            if (c === 'moo') loop++;
                            else if (c === 'mOO') loop--;
                        }
                    } break;
                case 'mOO': // Fim de Loop
                    if (fita[p] !== 0) {
                        let loop = 1;
                        ptr -= 2; // Volta para o comando anterior ao mOO
                        while (loop > 0 && ptr >= 0) {
                            let c = comandos[ptr--];
                            if (c === 'mOO') loop++;
                            else if (c === 'moo') loop--;
                        }
                        ptr++; // Ajusta posição após achar o par
                    } break;
                case 'Moo': // Saída ASCII ou Entrada
                    if (fita[p] === 0) {
                        // Simulação de entrada simplificada (pode deixar 0)
                    } else {
                        process.stdout.write(String.fromCharCode(fita[p]));
                    }
                    break;
                case 'MOo': fita[p]--; break;
                case 'MoO': fita[p]++; break;
                case 'MOO': // Executa instrução baseada no valor da célula (Pula se for mOO para evitar recursão infinita)
                    break; 
                case 'OOO': fita[p] = 0; break;
                case 'MMM': 
                    if (registro === null) registro = fita[p];
                    else { fita[p] = registro; registro = null; }
                    break;
                case 'OOM': process.stdout.write(fita[p].toString()); break;
                case 'oom': // Entrada de número (ignorado)
                    break;
            }
            
            // Garante que o ponteiro da fita não saia dos limites
            if (p < 0) p = 0;
            if (p > 29999) p = 29999;
        }
    })();\n`;

    return js;
}

module.exports = traduzir;

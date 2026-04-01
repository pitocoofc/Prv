/**
 * Tradutor: Assembly Simplificado (ASM-S) -> JavaScript
 * Mapeia mnemônicos diretamente para ações JS
 */
function traduzir(codigo) {
    // Inicializa a estrutura da CPU Virtual se ela não existir
    let js = `
    if (!global.cpu) {
        global.cpu = {
            mem: new Uint8Array(1024), // 1KB de RAM
            reg: { ax: 0, bx: 0, cx: 0, dx: 0 }, // Registradores de uso geral
            flags: { z: false, s: false } // Zero e Sign flags
        };
    }
    `;

    const linhas = codigo.split('\n');

    linhas.forEach(linha => {
        const l = linha.trim().toUpperCase();
        if (!l || l.startsWith(';')) return; // Pula vazios ou comentários

        // Regex para capturar: COMANDO ARG1, ARG2
        const partes = l.match(/^(\w+)\s+([^,]+)(?:,\s*(.+))?$/);
        if (!partes) return;

        const [_, cmd, arg1, arg2] = partes;
        const r1 = arg1.toLowerCase();
        const r2 = arg2 ? arg2.toLowerCase() : null;

        switch (cmd) {
            case 'MOV': // MOV AX, 10 ou MOV AX, BX
                if (isNaN(r2)) js += `cpu.reg.${r1} = cpu.reg.${r2};\n`;
                else js += `cpu.reg.${r1} = ${r2};\n`;
                break;

            case 'ADD': // ADD AX, 5
                js += `cpu.reg.${r1} += ${isNaN(r2) ? `cpu.reg.${r2}` : r2};\n`;
                break;

            case 'SUB': // SUB AX, 1
                js += `cpu.reg.${r1} -= ${isNaN(r2) ? `cpu.reg.${r2}` : r2};\n`;
                break;

            case 'CMP': // CMP AX, BX (Atualiza Flags)
                js += `
                    cpu.flags.z = (cpu.reg.${r1} === ${isNaN(r2) ? `cpu.reg.${r2}` : r2});
                    cpu.flags.s = (cpu.reg.${r1} < ${isNaN(r2) ? `cpu.reg.${r2}` : r2});
                `;
                break;

            case 'OUT': // OUT AX (Imprime o valor do registrador)
                js += `console.log("ASM_OUT [${r1}]:", cpu.reg.${r1});\n`;
                break;

            case 'INC': js += `cpu.reg.${r1}++;\n`; break;
            case 'DEC': js += `cpu.reg.${r1}--;\n`; break;
        }
    });

    return js;
}

module.exports = traduzir;

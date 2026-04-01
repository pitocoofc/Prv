/**
 * Tradutor Modular: EmojiScript -> JavaScript
 * 🚀 = console.log
 * 🔢 = let/var
 * ➕ = +
 * 🏁 = fim de instrução (;)
 */
function traduzir(codigo) {
    let js = codigo;

    // Mapeamento de Emojis para Comandos JS
    js = js.replace(/🚀\((.*)\)/g, 'console.log($1);')
           .replace(/🔢\s+(\w+)\s+=\s+(.*)/g, 'let $1 = $2;')
           .replace(/➕/g, '+')
           .replace(/➖/g, '-')
           .replace(/✖️/g, '*')
           .replace(/➗/g, '/')
           .replace(/🏁/g, ';');

    return js.trim();
}

module.exports = traduzir;

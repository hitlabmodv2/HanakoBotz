const bft = require('js-beautify')

module.exports = {
    command: "toesm",
    alias: [],
    category: ["tools"],
    settings: {
        owner: true,
    },
    description: "convert ke esm",
    loading: true,
    async run(m, {
        text,
        sock,
        Scraper,
        Func
    }) {
        let quoted = m.quoted ? m.quoted : m;
        if (!quoted) return m.reply(`Masukkan atau reply kode yang ingin diubah`);
        const es = await convertCJSToESM(quoted.body)
        const result = await bft(es)
        m.reply(result);
    },
};

function convertCJSToESM(code) {
    return code
        .replace(/const (\w+) = require\(['"](.+?)['"]\);?/g, 'import $1 from \'$2\';')
        .replace(/let (\w+) = require\(['"](.+?)['"]\);?/g, 'import $1 from \'$2\';')
        .replace(/var (\w+) = require\(['"](.+?)['"]\);?/g, 'import $1 from \'$2\';')
        .replace(/module\.exports\s*=\s*(.*?);?/g, 'export default $1;')
        .replace(/exports\.(\w+)\s*=\s*(.*?);?/g, 'export const $1 = $2;')
        .replace(/require\(['"](.+?)['"]\)/g, 'await import(\'$1\')'); // Menangani dynamic imports
}

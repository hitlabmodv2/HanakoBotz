const fetch = require('node-fetch')

let Yukio = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {
    if (!/sfile.mobi/.test(text)) throw '> mana link nya kak !'
    const result = await Scraper.sfile(text)
    if (!result && !result.length > 0 && !result === 0) {
        m.reply('ups dl eror + metadata nya😂')
    }

    let data = await fetch(result.dl);
    let fetcher = await data.buffer();
    const {
        key
    } = await sock.sendMessage(m.cht, {
        text: "Lagi Loading...."
    }, {
        quoted: m
    })

    await sock.sendMessage(m.cht, {
        text: `📁Download Sfile\n${Object.entries(result).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join("\n")}\n\nFile Akan Di Kirim...`,
        edit: key
    }, {
        quoted: m
    })
    await sock.sendFile(m.cht, Buffer.from(fetcher), result.name + `.${result.ext}`, `📁Download Sfile\n${Object.entries(result).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join("\n")}`, m)
}

module.exports = {
    command: "sfile",
    alias: [
        "sf",
        "sfdl",
        "sfiledl"
    ],
    category: [
        "downloader"
    ],
    settings: {
        limit: true
    },
    loading: true,
    run: Yukio
}

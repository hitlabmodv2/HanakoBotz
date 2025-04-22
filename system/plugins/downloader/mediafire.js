const fetch = require('node-fetch')

// Pengguna Esm
// import fetch from 'node-fetch';

let deku = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {
    if (!/www.mediafire.com/.test(text)) throw '⚠️ Mana Link MediaFire Nya !'
    //try awal eror 
    try {
        //Scraper
        const mf = await Scraper.mediafire(text)

        // Gagal get metadata
        if (!mf) return m.reply('maaf gagal di get eror mungkin 😂')

        // Get mime
        let data = await fetch(mf.link);
        let fetcher = await data.buffer();

        //loading
        const {
            key
        } = await sock.sendMessage(m.cht, {
            text: "Lagi Loading...."
        }, {
            quoted: m
        })

        // edit pesan
        await sock.sendMessage(m.cht, {
            text: `📁Download MediaFire\n${Object.entries(mf).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join("\n")}\n\nFile Akan Di Kirim...`,
            edit: key
        }, {
            quoted: m
        })

        // Kirim Pesan File Mf
        await sock.sendFile(m.cht, Buffer.from(fetcher), mf.filename, `📁Download MediaFire\n${Object.entries(mf).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join("\n")}`, m)

        // end error
    } catch (err) {
        m.reply('gomenazai error: ' + err)
        console.log('gomenazai error: ' + err)
    }
}

deku.command = "mediafire"
deku.alias = ["mf", "mfdl"]
deku.category = ["downloader"]
deku.settings = {
    limit: true
}
deku.loading = true

module.exports = deku

// penguna esm
// export default deku;

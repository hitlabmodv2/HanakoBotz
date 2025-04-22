const axios = require('axios')

// Penguna Esm
// import axios from 'axios';

let yukio = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {
    if (!text) throw '⚠️ Masukan Kata Kata Teks'

    // try mendeteksi error
    try {
        // Scrape
        const texttoimg = await Scraper.texttoimg({
            prompt: text
        })
        // Gagal Dapat Metadata
        if (!texttoimg.data) return m.reply('gagal dapat image, nya😂')

        // Kirim File Foto Nya
        await sock.sendMessage(m.cht, {
            image: texttoimg.data,
            caption: 'nih😄'
        }, {
            quoted: m
        })
    } catch (err) {
        m.reply('gomenazai error: ' + err)
        console.log('gomenazai error: ' + err)
    }
}

yukio.command = "texttoimg"
yukio.alias = ["tti"]
yukio.category = ["tools"]
yukio.settings = {
    limit: true
}
yukio.loading = true

module.exports = yukio

// Penguna Esm
// export default yukio

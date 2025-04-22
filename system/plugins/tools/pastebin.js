// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz
const axios = require('axios')

module.exports = {
    command: "pastebin",
    alias: [
        "pstb"
    ],
    category: [
        "tools"
    ],
    settings: {
        limit: true
    },
    loading: true,
    async run(m, {
        sock,
        client,
        conn,
        DekuGanz,
        Func,
        Scraper,
        text,
        config
    }) {
        if (!/pastebin.com/.test(text)) throw '⚠️Masukan Link Pastebin Nya'

        try {
            // Regex
            const regex = /https:\/\/pastebin\.com\/([a-zA-Z0-9]{8})/;
            const match = text.match(regex);
            if (!match.length) throw 'ups eror😂'

            // getData nya
            const getData = await axios.get('https://pastebin.com/raw/' + match[1])

            m.reply(getData.data)
        } catch (err) {
            m.reply('Gomene: ' + err)
        }
    }
}

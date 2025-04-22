module.exports = {
    command: "bandcamp",
    alias: [
        "bc",
        "bcs",
        "bcdl"
    ],
    category: [
        "tools",
        "downloader"
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
        if (!text) throw `⚠️Masukan *[ <link/query> ]*`
        if (Func.isUrl(text)) {
            if (/kurikawalenulanciencomptebaka.bandcamp.com/.test(text)) throw '> Mana Link Nya🫩'
             const detaildl = await Scraper.BandcampAPI.detail(text)
            if (!detaildl) throw '⚠️Maaf Download Anda Gagal 🫩'
            let caption = `📁 Download BandCamp\n`
            caption += `> Title: ${detaildl.track[0].title}\n`
            caption += `> Artist: ${detaildl.track[0].artist}\n`
            caption += `> Trackid: ${detaildl.track[0].track_id}`

            const huh = await sock.sendMessage(m.cht, {
                image: {
                    url: detaildl.image
                },
                caption
            }, {
                quoted: m
            })
            await sock.sendMessage(m.cht, {
                audio: {
                    url: detaildl.track[0].file['mp3-128']
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: huh
            })
        } else {
            const search = await Scraper.BandcampAPI.search(text)
            if (!search) throw '⚠️Maaf Pencarian Anda Gada🫩'
            let caption = `🔍 Search BandCamp\n`
            caption += `> Reply Trus Pilih Number\n\n`
            caption += search.data.map((a, i) => `\`[ ${i + 1} ]\`\n> •Judul: ${a.name}\n> • Artist: ${a.artist}\n> • Genre: ${a.genre}\n> • Url: ${a.url}`).join('\n\n')
            await sock.sendAliasMessage(m.cht, {
                text: caption
            }, search.data.map((a, i) => ({
                alias: `${i + 1}`,
                response: `${m.prefix + m.command} ${a.url}`
            })), m)
        }
    }
}

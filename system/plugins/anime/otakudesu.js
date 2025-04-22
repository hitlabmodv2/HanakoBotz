let rinokumura = {
    command: "otakudesu",
    alias: [
        "otaku",
        "otk"
    ],
    category: [
        "anime"
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
        const ongoing = await Scraper.otakudesu.ongoing()
        let cap = `⚠️ Anda Masukkan Link/Query !\n\n👤 Latest Anime\n\nPilih Nomor Reply Pesan\n${ongoing.map((a, i) => `[ ${i + 1} ]\n> • Title: ${a.title}\n> • Date: ${a.date}\n> • Link: ${a.link}`).join("\n\n")}`

        // Detail Anime
        if (text.includes('https://otakudesu.cloud/anime/')) {
            const {
                episodes: eps
            } = await Scraper.otakudesu.detail(text)
            if (!eps && !eps.length > 0 && !eps.length === 0) throw 'Maaf Metadata Gagal Di Fetcher😂'
            let cap = `🎥 Episode\n\nPilih Nomor Reply Pesan\n${eps.map((a, i) => `[ ${i + 1} ]\n> • Title: ${a.title}\n> • Link: ${a.link}\n> • Date: ${a.date}`).join("\n\n")}`

            client.sendAliasMessage(m.cht, {
                text: cap
            }, eps.map((a, i) => ({
                alias: `${i + 1}`,
                response: `${m.prefix + m.command} ${a.link}`
            })), m)
        } else if (text.includes('https://otakudesu.cloud/episode/')) {
            const {
                downloads: dl
            } = await Scraper.otakudesu.download(text)
            if (!dl && !dl.length > 0 && !dl.length === 0) throw 'Maaf Metadata Gagal Di Fetcher😂'

            let cap = `📁 Downloader Files\n\n${dl.map((a) => `[ ${a.quality} ]\n> • Link: ${a.link}`).join("\n\n")}`

            client.sendMessage(m.cht, {
                text: cap
            }, {
                quoted: m
            })
        } else if (text) {
            const otakusea = await Scraper.otakudesu.search(text)
            if (!otakusea && !otakusea.length > 0 && !otakusea.length === 0) throw 'Maaf Metadata Gagal Di Fetcher😂'

            let cap = `🔍Search Otakudesu\n\nPilih Nomor Reply Pesan\n${otakusea.map((a, i) => `[ ${i + 1} ]\n> • Title: ${a.title}\n> • Rating: ${a.rating}\n> • Link: ${a.link}\n> • Genre: ${a.genres}`).join("\n\n")}`

            client.sendAliasMessage(m.cht, {
                text: cap
            }, otakusea.map((a, i) => ({
                alias: `${i + 1}`,
                response: `${m.prefix + m.command} ${a.link}`
            })), m)
        } else {
            client.sendAliasMessage(m.cht, {
                text: cap
            }, ongoing.map((a, i) => ({
                alias: `${i + 1}`,
                response: `${m.prefix + m.command} ${a.link}`
            })), m)
        }
    }
}

module.exports = rinokumura

const yts = require('yt-search')

let rinokumura = {
    command: "play",
    alias: [
        "ply",
        "playvd",
        "playms"
    ],
    category: [
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
        if (!text) throw '⚠️ Mau Query Song Apa?'

        let search = await yts(text);
        if (!search.videos.length) return m.reply("❌ Video tidak ditemukan!");
        const video = search.videos[0];

        let metadata = `> • Title: ${video.title}
> • Id: ${video.videoId}
> • Ago: ${video.ago}
> • Durasi: ${video.timestamp}
> • Url: ${video.url}
`
        let infoMessage = `📁 Download YouTube
${metadata}

 ℹ️ Pilih Options
> • 1. video download 
> • 2. audio download`

        await client.sendAliasMessage(m.cht, {
            image: {
                url: video.thumbnail
            },
            caption: infoMessage
        }, [{
            alias: `1`,
            response: `${m.prefix}ytdl ${video.url} --video`
        }, {
            alias: `2`,
            response: `${m.prefix}ytdl ${video.url} --audio`
        }], await m.froll());
    }
}

module.exports = rinokumura

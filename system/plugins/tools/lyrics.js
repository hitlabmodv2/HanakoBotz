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
    if (!text) throw '⚠️ Cari Kan Nama Lagu Mau Cari Lirik'
    const lyrics = await Scraper.googleLyrics(text)
    if (!lyrics) return m.reply(`⚠️ Maaf Search Nya Gada😂`)
    let capt = `🔍 Search Lyrics\n`
    capt += `> • Lyrics:\n${Object.entries(lyrics.result)
        .map((a, i) => `${a}`)
        .join("\n")}\n`
    capt += Object.entries(lyrics.metadata)
        .map(([a, b]) => `> • *${a.capitalize()} :* ${b}`)
        .join("\n")

    m.reply(capt)
}

yukio.command = "lyrics"
yukio.alias = [
    "lirik",
    "lyricsgoggle"
]
yukio.category = [
    "tools"
]
yukio.settings = {
    limit: true
}
yukio.loading = true

module.exports = yukio

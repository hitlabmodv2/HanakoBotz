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

    if (!/x.com/.test(text)) throw '⚠️Mana Link Twitter Nya !';

    // Gagal get video/image
    const tw = await Scraper.twitterdl2(text);
    if (!tw && !tw.images.length > 0 && tw.videos.length > 0) return m.reply('Error Kabeh Gada Link Vt Nya😂');

    // image
    if (tw.type === "image") {
        const ftmap = tw.images.map(x => x.download);
        let medias = [];
        for (let i of ftmap) {
            medias.push({
                type: 'image',
                data: {
                    url: i
                }
            });
        }

        sock.sendAlbumMessage(m.cht, medias, {
            caption: '✅ Done Wak😄',
            quoted: m
        });
    } else

        // video
        if (tw.type === "video") {
            const x = tw.videos[0].download
            await sock.sendMessage(m.cht, {
                video: {
                    url: x
                },
                caption: '> ✅ Done Wok'
            }, {
                quoted: m
            })
        };
}

deku.command = "twitter"
deku.alias = [
    "tw",
    "twdl",
    "xdl",
    "x"
]
deku.category = [
    "downloader"
]
deku.settings = {
    limit: true
}
deku.loading = true

module.exports = deku

let rinokumura = {
    command: "spotify",
    alias: ["spdl"],
    category: ["downloader"],
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
        if (!text) return m.reply('> masukan link/query')
        if (Func.isUrl(text)) {
            if (!/open.spotify.com/.test(text)) throw '⚠️ Maaf Link Yg Anda Masukan Failed'
            try {
                await Scraper.spotifydlv3(text).then(async (a) => {
                    let captions = `📁 Download Spotify
> • Title: ${a.metadata.song_name}
> • Album: ${a.metadata.album_name}
> • Artist: ${a.metadata.artist}
> • Date: ${a.metadata.released}
> • Link: ${a.url}`
                    const image = await Func.fetchBuffer(a.metadata.img)
                    sock.sendMessage(m.cht, {
                        text: captions
                    }, {
                        quoted: await m.froll(config.owner[0], Func.Styles('Spotify Downloader'), sock.resize(image, 300, 300))
                    })
                    sock.sendMessage(m.cht, {
                        audio: {
                            url: a.url
                        },
                        mimetype: 'audio/mpeg',
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            externalAdReply: {
                                title: a.metadata.song_name,
                                body: a.metadata.artist + ' / ' + a.metadata.released,
                                mediaType: 1,
                                thumbnailUrl: a.metadata.img,
                                renderLargerThumbnail: false,
                                sourceUrl: a.url
                            }
                        }
                    }, {
                        quoted: await m.froll(config.owner[0], Func.Styles('Spotify Downloader'), sock.resize(image, 300, 300))
                    })
                })
            } catch (err) {
                try {
                    await Scraper.spotify.download(text).then(async (a) => {
                        let captions = `📁 Download Spotify
> • Title: ${a.metadata.album}
> • Artist: ${a.metadata.artist}
> • Date: ${a.metadata.releaseDate}
> • Link: ${a.download.file_url}`
                        const image = await Func.fetchBuffer(a.metadata.cover_url)
                        sock.sendMessage(m.cht, {
                            text: captions
                        }, {
                            quoted: await m.froll(config.owner[0], Func.Styles('Spotify Downloader'), sock.resize(image, 300, 300))
                        })
                        sock.sendMessage(m.cht, {
                            audio: {
                                url: a.download.file_url
                            },
                            mimetype: 'audio/mpeg',
                            contextInfo: {
                                mentionedJid: [m.sender],
                                isForwarded: !0,
                                forwardingScore: 127,
                                externalAdReply: {
                                    title: a.metadata.album,
                                    body: a.metadata.artist + ' / ' + a.metadata.releaseDate,
                                    mediaType: 1,
                                    thumbnailUrl: a.metadata.cover_url,
                                    renderLargerThumbnail: false,
                                    sourceUrl: a.download.file_url
                                }
                            }
                        }, {
                            quoted: await m.froll(config.owner[0], Func.Styles('Spotify Downloader'), sock.resize(image, 300, 300))
                        })
                    })
                } catch (err) {}
            }
        } else if (text) {
            Scraper.spotify.search(text).then(async (a) => {
                let no = 1
                let captions = `🔍 Search Spotify\n\n`
                for (let i of a) {
                    captions += `Pilih Reply Nomor
[ ${no++} ]
> • Title: ${i.title}
> • Artist: ${i.artist}
> • Id: ${i.id}
> • Link: ${i.url}\n\n`
                }
                await sock.sendAliasMessage(m.cht, {
                    text: captions
                }, a.map((a, i) => ({
                    alias: `${i + 1}`,
                    response: `${m.prefix + m.command} ${a.url}`
                })), await m.froll());
            })
        } else m.reply('gagal dl sama metadata nya😂')
    }
}

module.exports = rinokumura

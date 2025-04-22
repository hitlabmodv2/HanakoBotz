
//wew

const axios = require('axios')

let rinokumura = {
    command: "tiktokhd",
    alias: ["tthd", "ttdlhd"],
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
        if (!/vt.tiktok.com/.test(text) && !/vm.tiktok.com/.test(text) && !/tiktok.com/.test(text)) throw `> masukan link tiktok nya`
        const dl = await ttwm.dl(text)
        let input = m.isQuoted ? m.quoted.body : text;
        await Scraper.musicaldown(text).then(async (a) => {
            let caption = `📁 Downloader Tiktok\n`
            caption += `> • Title: ${dl.title || ''}
> • Views: ${dl.play_count || ''}
> • Download: ${dl.download_count || ''}
> • Create: ${dl.create_time || ''}
> • Comment: ${dl.comment_count || ''}
> • Nickname: ${dl.author.nickname || ''}
> • Unique: ${dl.author.unique_id || ''}
> • Slide: ${a.image ? 'true' : 'false'}
> • Hd Video: ${a.video_hd ? 'true' : 'false'}
`
            client.sendMessage(m.cht, {
                video: {
                    url: a.video_hd
                },
                caption: caption
            }, {
                quoted: m
            })
        })
    }
}

module.exports = rinokumura

const ttwm = {
    dl: async (url) => {
        try {
            const {
                data: result
            } = await axios.post('https://tikwm.com/api/?', {
                url: url
            }, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return result.data
        } catch (e) {
            console.log('msg: ' + e)
            return {
                msg: e
            }
        }
    }
}

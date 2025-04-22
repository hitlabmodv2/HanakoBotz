const axios = require('axios')

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
    if (!text) throw 'Ha-Halo Aku LuminAi Silahkan Tanyakan Pertanyaan Berikut'
    const Lumi = await LuminAi(text)
    if (!Lumi.Result.result) return m.reply('maaf gada metadata😅😂')
    m.reply(`${Lumi.Result.result}\n~ Api: ${Lumi.Api}`)
}

yukio.command = "luminai"
yukio.alias = [
    "lmai"
]
yukio.category = [
    "ai"
]
yukio.settings = {
    limit: true
}
yukio.loading = true

module.exports = yukio

async function LuminAi(teks) {
    try {
        let lumi;
        try {
            const Result = await axios.get('https://jazxcode.biz.id/ai/luminai?text=' + teks).then(a => a.data);
            lumi = {
                Api: 'jazxcode',
                Result
            };
        } catch {
            try {
                const Result = await axios.get('https://api-lenwy.vercel.app/luminai?text=' + teks).then(a => a.data);
                lumi = {
                    Api: 'Lenwy',
                    Result
                }
            } catch {}
        }
        return lumi
    } catch (err) {
        return {
            api: 'gada',
            result: err
        }
        console.error({
            Api: 'gada',
            result: err
        })
    }
}

// module.exports = LuminAi

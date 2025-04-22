// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// Plugin Cek Server Minecraft
// By: Leooxzy
// Bio cr: Krz

const axios = require('axios')

let rinokumura = {
    command: "cekservermc",
    alias: [
        "mc",
        "servermc",
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

        const isJava = m.args.includes("--java");
        const isBedrock = m.args.includes("--bedrock");
        const prompt = text.replace(/--\w+(\=\w+)?/g, "").trim();
        if (!prompt) return m.reply(`⚠️Masukan Ip Sama Type
🎟️Type
> • ${m.prefix + m.command} <ip server> --java
> • ${m.prefix + m.command} <ip server >:<port> --bedrock
`)

        if (!isJava && !isBedrock) return m.reply('mana type nya?')
        // java
        if (isJava) {
            const {
                data: java
            } = await axios.get("https://api.mcstatus.io/v2/status/java/" + prompt)
            if (!java) return m.reply('IP Yang Di Masukan Error😂')

            if (java.online) {
                let cap = `🟠 Status Server\n`
                cap += `> • Hostname: ${java.host}\n`
                cap += `> • IP: ${java.ip_address}\n`
                cap += `> • Port: ${java.port ? java.port : '0'}\n`
                cap += `> • Status: ${java.online ? '🟢' : '🔴'}\n`
                cap += `> • Players: ${java.players.online ? java.players.online : 'gada'}/${java.players.max ? java.players.max : 'gada'}\n`

                m.reply(cap)
            } else if (java.online) {
            m.reply('Gagal Mendapatkan Fatching IP Server😂')
          }
        }

        // bedrock
        else if (isBedrock) {
            const {
                data: bedrock
            } = await axios.get("https://api.mcstatus.io/v2/status/bedrock/" + prompt)
            if (!bedrock) return m.reply('IP Sama Port Yang Di Masukan Error😂')

            if (bedrock.online) {
                let cap = `🟠 Status Server\n`
                cap += `> • Hostname: ${bedrock.host}\n`
                cap += `> • IP: ${bedrock.ip_address}\n`
                cap += `> • Port: ${bedrock.port ? bedrock.port : '0'}\n`
                cap += `> • Status: ${bedrock.online ? '🟢' : '🔴'}\n`
                cap += `> • Players: ${bedrock.players.online ? bedrock.players.online : 'gada'}/${bedrock.players.max ? bedrock.players.max : 'gada'}\n`

                m.reply(cap)
            } else {
            m.reply('Gagal Mendapatkan Fatching IP Server😂')
          }
        }
    }
}

module.exports = rinokumura

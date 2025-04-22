let rinokumura = {
    command: "mcpedl",
    alias: [
        "mcdl"
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
        const info = m.args[1] == "--info"
        const srch = await Scraper.mcpedl.search({
            query: text
        })
        if (!srch) {
           return m.reply('gagal search😂')
        }
        if (!info) {
            sock.sendAliasMessage(m.cht, {
                text: `🔍Search Mcpedl\n\n${srch.data.map((a, i) => `[ ${i +1} ]\n> • Title: ${a.title}\n> • Slug: ${a.slug}\n> • Date: ${a.sort_date}` ).join("\n\n")}`
            }, srch.data.map((a, i) => ({
                alias: `${i + 1}`,
                response: `${m.prefix + m.command} ${a.slug} --info`
            })), m)
        }

        if (info) {            
            const { data } = await Scraper.mcpedl.info(m.args[0])
            if (!srch) {
                 return m.reply('gagal search😂')
            }
            m.reply(`ℹ️Info Mcpedl\n> • Title: ${data.title}\n> • Slug: ${data.slug}\n> • Date: ${data.update_date}\n> • Download: ${'https://mcpedl.com' + data.downloads[0].file}`)
        }
    }
}

module.exports = rinokumura

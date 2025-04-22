const Groq = require('groq-sdk')
const config = require(process.cwd() + '/settings.js')

let Yukio = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text
}) => {
    let h = await DenkiChat(text)
    if (!h) return m.reply('maaf error kata kata mu😂')
    const {
        key
    } = await sock.sendMessage(m.cht, {
        text: "loading ai"
    }, {
        quoted: m
    })
    await sock.sendMessage(m.cht, {
        text: h,
        edit: key
    }, {
        quoted: m
    })
}

module.exports = {
    command: "denki",
    alias: [
        "kaminari",
        "denkikaminari"
    ],
    category: [
        "ai"
    ],
    settings: {
        limit: true
    },
    loading: true,
    run: Yukio
}

const client = new Groq({
    apiKey: config.groq.api
});

async function DenkiChat(prompt) {
    chatCompletion = await client.chat.completions.create({
        messages: [{
                role: "system",
                content: "kamu ai denki kaminari, dari anime my hero academia, kamu bisa bahasa Indonesia, dan campuran bahasa jepang kek anime gitu, bergaulan, dan bisa emoticon"
            },
            {
                role: "assistant",
                content: "baiklah"
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: 'llama-3.3-70b-versatile'
    });
    let hasil = chatCompletion.choices[0].message.content
    return hasil
}

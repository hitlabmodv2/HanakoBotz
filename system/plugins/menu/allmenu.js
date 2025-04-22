const moment = require("moment-timezone");
const axios = require('axios');
const fs = require("node:fs");
const path = require("node:path");
const process = require('process')
const {
    exec,
    spawn,
    execSync
} = require('child_process');
const child_process = require('child_process')
const os = require('os')
const speed = require('performance-now')
const osu = require('node-os-utils')
const pkg = require(process.cwd() + "/package.json");

let deku = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config,
    plugins
}) => {

    const more = String.fromCharCode(8206);
    const readmore = more.repeat(4001);

    let platform = os.platform()
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let date = d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
    })
    const hanakoai = await Scraper.aiMenu(`Hanako Kamu Menyapa ${m.pushName}-san/kun dan sesuai jam ini ya kek gini halo ${m.pushName}-san/kun gitu`, `Kamu Adalah Ai Hanako-Kun Dari Anime Jibaku Shounen Hanako Kun Kamu Bisa Bahasa Indonesia + Bahasa Jepang Kek Anime Gitu + Bergaulan + Emoticon + Emoji`)
    let runtime = speed()
    let totalreg = Object.keys(db.list().user).length

    let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
    let casePattern = /case\s+"([^"]+)"/g;
    let matches = data.match(casePattern);
    if (!matches) return m.reply("Tidak ada case yang ditemukan.");
    matches = matches.map(match => match.replace(/case\s+"([^"]+)"/, "$1"));

    let menu = {};
    plugins.forEach(item => {
        if (item.category && item.command) {
            item.category.forEach(cat => {
                if (!menu[cat]) {
                    menu[cat] = {
                        command: []
                    };
                }
                menu[cat].command.push({
                    name: item.command,
                    alias: item.alias
                });
            });
        }
    });

    let cmd = 0,
        alias = 0;
    let pp = await sock.profilePictureUrl(m.sender, 'image').catch(e => 'https://files.catbox.moe/8getyg.jpg');

    Object.values(menu).forEach(category => {
        cmd += category.command.length;
        category.command.forEach(command => alias += command.alias.length);
    });

    let caption = Func.Styles(`${hanakoai}${readmore}

╔═══════『 👤 USER INFO 』═══════⊱
┃ ⚡ Name    : ${m.pushName}
┃ 📱 Number  : @${m.sender.split('@')[0]}
┃ 💎 Limit   : ${db.list().user[m.sender].limit}
╚═════════════════════════⊱

╔═══════『 🤖 BOT INFO 』═══════⊱
┃ ⚡ Runtime : ${runtime}
┃ 📊 Type    : Case x Plugin
┃ 👥 Users   : ${totalreg}
┃ 🔰 Mode    : ${db.list().settings.self ? 'Self' : 'Public'}
┃ 📱 Version : ${pkg.version}
┃ 🔧 Prefix  : ${m.prefix}
┃ 📅 Date    : ${date}
╚═════════════════════════⊱

⏤͟͟͞͞╳── *[ Menu Case ]* ── .々─ᯤ
${matches.map((a, i) => `│    =〆 ${m.prefix + a}`).join("\n")}
\n⏤͟͟͞͞╳────────── .✦`);

    Object.entries(menu).forEach(([tag, commands]) => {
        caption += `\n\n${Func.Styles(`╔═══════『 ${getCategoryEmoji(tag)} ${tag.toUpperCase()} 』═══════⊱`)}`;
        commands.command.forEach((command, index) => {
            caption += `\n│    =〆 ${Func.Styles(`${m.prefix + command.name}`)}`;
        });
        caption += `\n╚═════════════════════════⊱`;
    });

    await sock.sendMessage(m.cht, {
        video: {
            url: "https://files.catbox.moe/f1l5ij.mp4"
        },
        caption: caption,
        gifPlayback: true,
        contextInfo: {
            mentions: [m.sender],
            isForwarded: !0,
            forwardingScore: 127,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.saluran,
                newsletterName: `${config.name} | ` + date,
                serverMessageId: -1
            },
            externalAdReply: {
                title: `々 ${config.ownername2} | ${config.name}`,
                body: `${config.ownername2} | ` + date,
                mediaType: 1,
                thumbnail: fs.readFileSync('./image/DekuThumb.jpg'),
                renderLargerThumbnail: false,
                sourceUrl: "https://chat.whatsapp.com/KOHWg6v5GCc9pxpVIj0GtB",
            }
        }
    }, { quoted: await m.froll() })

}

deku.command = "allmenu"
deku.alias = ["menuall"]
deku.category = ["menu"]
deku.settings = {}
deku.description = "Menampilkan Allmenu"
deku.loading = true

const getCategoryEmoji = (category) => {
    switch (category.toLowerCase()) {
        case "group": return "👥";
        case "owner": return "👑";
        case "sticker": return "🪈";
        case "downloader": return "⬇️";
        case "game": return "🎮";
        case "kerang": return "🐚";
        case "quotes": return "💬";
        case "info": return "ℹ️";
        case "tools": return "🛠️";
        case "fun": return "😂";
        case "anime": return "⛩️";
        case "nsfw": return "🔞";
        case "text": return "✍️";
        case "advanced": return "⚙️";
        case "image": return "🖼️";
        case "audio": return "🎵";
        case "video": return "🎥";
        case "menu": return "📚";
        default: return "❓"; // Default emoji if category is not found
    }
};

module.exports = deku
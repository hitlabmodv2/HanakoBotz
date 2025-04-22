const moment = require("moment-timezone");
const axios = require('axios');
const fs = require('node:fs')
const path = require("node:path");
const process = require('process');
const {
    exec,
    spawn,
    execSync
} = require('child_process');
const child_process = require('child_process');
const os = require('os');
const speed = require('performance-now');
const osu = require('node-os-utils');
const pkg = require(process.cwd() + "/package.json")

let deku = async (m, {
    sock,
    Func,
    Scraper,
    plugins,
    Uploader,
    store,
    text,
    config
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
    matches = matches.map((match) => match.replace(/case\s+"([^"]+)"/, "$1"));
    let menu = {};
    plugins.forEach((item) => {
        if (item.category && item.command && item.alias) {
            item.category.forEach((cat) => {
                if (!menu[cat]) {
                    menu[cat] = {
                        command: [],
                    };
                }
                menu[cat].command.push({
                    name: item.command,
                    alias: item.alias,
                    description: item.description,
                    settings: item.settings,
                });
            });
        }
    });
    let cmd = 0;
    let alias = 0;
    let pp = await sock
        .profilePictureUrl(m.sender, "image")
        .catch((e) => "https://files.catbox.moe/8getyg.jpg");
    Object.values(menu).forEach((category) => {
        cmd += category.command.length;
        category.command.forEach((command) => {
            alias += command.alias.length;
        });
    });

    if (Object.keys(menu).find((a) => a === text.toLowerCase())) {
        let list = menu[Object.keys(menu).find((a) => a === text.toLowerCase())];
        let caption = Func.Styles(`${hanakoai}${readmore}

╔══════『 USER INFO 』══════⊱
┃ ❒ 👤 Name: ${m.pushName}
┃ ❒ 📱 Number: @${m.sender.split('@')[0]}
┃ ❒ 💎 Limit: ${db.list().user[m.sender].limit}
╚═════════════════⊱

╔══════『 BOT INFO 』══════⊱
┃ ❒ ⏰ Runtime: ${runtime}
┃ ❒ 🤖 Type: Case x Plugin
┃ ❒ 👥 Users: ${totalreg}
┃ ❒ 🔰 Mode: ${db.list().settings.self ? 'Self' : 'Public'}
┃ ❒ 📊 Version: ${pkg.version}
┃ ❒ ⚡ Prefix: ${m.prefix}
┃ ❒ 📅 Date: ${date}
╚═════════════════⊱

╔══════『 ${text.toUpperCase()} MENU 』══════⊱
${list.command
  .map(
    (a, i) =>
      `┃ ❒ ${m.prefix + a.name} ${a.settings?.premium ? "🌟" : a.settings?.limit ? "💫" : ""}`,
  )
  .join("\n")}
╚═════════════════⊱
`);


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
                    sourceUrl: "https://chat.whatsapp.com/KOHWg6v6GCc9pxpVIj0GtB",
                }
            }
        }, {
            quoted: await m.froll()
        })
    } else if (text === "case") {
        let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
        let casePattern = /case\s+"([^"]+)"/g;
        let matches = data.match(casePattern);
        if (!matches) throw "Tidak ada case yang ditemukan."
        matches = matches.map(match => match.replace(/case\s+"([^"]+)"/, "$1"));

        let caption = Func.Styles(`${hanakoai}${readmore}

╔══════『 USER INFO 』══════⊱
┃ ❒ 👤 Name: ${m.pushName}
┃ ❒ 📱 Number: @${m.sender.split('@')[0]}
┃ ❒ 💎 Limit: ${db.list().user[m.sender].limit}
╚═════════════════⊱

╔══════『 BOT INFO 』══════⊱
┃ ❒ 👥 Users: ${totalreg}
┃ ❒ 🔰 Mode: ${db.list().settings.self ? 'Self' : 'Public'}
┃ ❒ 📊 Version: ${pkg.version}
┃ ❒ ⚡ Prefix: ${m.prefix}
┃ ❒ 📅 Date: ${date}
╚═════════════════⊱

╔══════『 CASE MENU 』══════⊱
${matches.map((a, i) => `┃ ❒ ${m.prefix + a}`).join("\n")}
╚═════════════════⊱

Kalau Error Bisa Hubungi Ke .owner gass`);

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
        }, {
            quoted: await m.froll()
        })
    } else if (text === "list") {
        let list = Object.keys(menu);
        const xmenu_oh = `${hanakoai}${readmore}

╔══════『 USER INFO 』══════⊱
┃ ❒ 👤 Name: ${m.pushName}
┃ ❒ 📱 Number: @${m.sender.split('@')[0]}
┃ ❒ 💎 Limit: ${db.list().user[m.sender].limit}
╚═════════════════⊱

╔══════『 BOT INFO 』══════⊱
┃ ❒ 👥 Users: ${totalreg}
┃ ❒ 🔰 Mode: ${db.list().settings.self ? 'Self' : 'Public'}
┃ ❒ 📊 Version: ${pkg.version}
┃ ❒ ⚡ Prefix: ${m.prefix}
┃ ❒ 📅 Date: ${date}
╚═════════════════⊱

╔══════『 MENU LIST 』══════⊱
┃ ❒ ${m.prefix}allmenu
┃ ❒ ${m.prefix}menu list
┃ ❒ ${m.prefix}menu case
${list.map((a) => `┃ ❒ ${m.prefix + m.command} ${a}`).join("\n")}
╚═════════════════⊱

Kalau Error Bisa Hubungi Ke .owner gass`


        let sections = [{
                title: '『👾』Information Center Bot『👾』',
                rows: [
                    {
                        title: '🙏 Thanks To Contributors',
                        description: `Menampilkan daftar kontributor yang telah membantu mengembangkan bot ini`,
                        id: `${m.prefix}ping`
                    },
                    {
                        title: '👑 Developer Profile',
                        description: `Menampilkan informasi lengkap tentang developer bot`,
                        id: `${m.prefix}owner`
                    },
                    {
                        title: '📚 Complete Menu Guide',
                        description: `Menampilkan seluruh fitur bot secara lengkap dan terperinci`,
                        id: `${m.prefix}allmenu`
                    },
                    {
                        title: '💭 Group Bot',
                        description: `Bergabung dengan grup official bot untuk update dan informasi terbaru`,
                        id: `${m.prefix}gcbot`
                    },
                ]
            },
            {
                title: '『🤖』Artificial Intelligence『🤖』',
                rows: [{
                        title: '💥 AI Bakugo',
                        description: `Chat dengan AI Bakugo yang eksplosif dari My Hero Academia`,
                        id: `${m.prefix}bakugo halo`
                    },
                    {
                        title: '💪 AI Deku',
                        description: `Ngobrol dengan AI Deku sang pahlawan masa depan`,
                        id: `${m.prefix}deku halo`
                    },
                    {
                        title: '⚡ AI Denki',
                        description: `Interaksi dengan AI Denki yang energetik dan menghibur`,
                        id: `${m.prefix}denki halo`
                    },
                    {
                        title: '❄️ AI Todoroki',
                        description: `Diskusi dengan AI Todoroki yang cool dan bijaksana`,
                        id: `${m.prefix}todoroki halo`
                    },
                ]
            },
            {
                title: '『⭐』Menu Spesial『⭐』',
                rows: [{
                    title: `📑 ${m.command} all`,
                    description: `Menampilkan semua fitur bot dalam satu tampilan lengkap`,
                    id: `${m.prefix + 'allmenu'}`
                }, {
                    title: `📋 ${m.command} list`,
                    description: `Menampilkan daftar menu dalam format yang rapi dan terstruktur`,
                    id: `${m.prefix + m.command} list`
                }, {
                    title: `🔍 ${m.command} case`,
                    description: `Menampilkan fitur-fitur khusus dan case commands`,
                    id: `${m.prefix + m.command} case`
                }],
            }, {
                title: '『📌』Panduan Pengguna『📌』',
                rows: list.map((a) => ({
                    title: `${m.command} ${a}`,
                    description: `Menampilkan pesan menu ${a}`,
                    id: `${m.prefix + m.command} ${a}`
                }))
            }
        ]

        let listMessage = {
            title: 'Click Here⎙',
            sections
        };
        await sock.sendMessage(m.cht, {
            location: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                isLive: true,
                jpegThumbnail: await sock.resize(fs.readFileSync('./image/Hanako-kun.jpg'), 300, 170)
            },
            caption: "",
            footer: Func.Styles(config.name),
            title: Func.Styles(xmenu_oh),
            subtitle: "",
            contextInfo: {
                mentions: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: config.name,
                    serverMessageId: -1
                }
            },
            interactiveButtons: [{
                name: 'single_select',
                buttonParamsJson: JSON.stringify(listMessage)
            }, {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: Func.Styles("Link Channel👤"),
                    url: config.wagc,
                    merchant_url: config.wagc
                })
            }]
        }, {
            quoted: await m.froll()
        })

    } else {
        let caption = `╔═══════『 WELCOME 』═══════⊱
┃ Hai ${m.pushName}👋
┃
┃ Aku adalah Hanako-Kun, dari anime 
┃ Jibaku Shounen Hanako-kun, saya akan
┃ membantu kamu dengan berbagai fitur
┃ yang kamu butuhkan.
╚════════════════════⊱

╔═══『 AVAILABLE MENU 』═══⊱
┃ 📋 **Menu**: Menampilkan Menu Utama
┃ 📝 **List**: Menampilkan Menu List
┃ 📱 **All**: Semua Fitur Bot WhatsApp
┃ 🎬 **Anime**: Info anime & karakter
┃ ⬇️ **Downloader**: DL anime & musik
┃ 🛠️ **Tools**: Konversi & kalkulator
┃ 🎮 **Main**: Game RPG & teks
┃ 🔍 **Search**: Cari berbagai info
┃ 📁 **Case**: Fitur Case.js & Anti
┃ 💌 **Menfess**: Berbagi cerita
┃ 🎲 **Game**: Game teks seru
┃ ⚔️ **RPG**: Game RPG adventure
┃ ❓ **Help**: Tutorial penggunaan Bot
╚════════════════════⊱

Pilih salah satu menu yang kamu inginkan,
aku akan membantu kamu! ✨`

        await sock.sendMessage(m.cht, {
            image: fs.readFileSync('./image/Hanako-kun.jpg'),
            caption: Func.Styles(caption), // Use this if you are using an image or video
            footer: `© ${config.name}`,
            buttons: [{
                    buttonId: '.menu list',
                    buttonText: {
                        displayText: '📋 List Menu'
                    }
                },
                {
                    buttonId: '.help',
                    buttonText: {
                        displayText: '❓ Help'
                    }
                }
            ]
        }, {
            quoted: await m.froll()
        })
        await m.reply({
            audio: {
                url: "https://files.catbox.moe/1n8ki1.mp3"
            },
            mimetype: 'audio/mpeg',
            ptt: true
        })
    }
}

deku.command = "menu";
deku.alias = ["leogg", "dekugg", "dekugz"];
deku.category = ["main"];
deku.settings = {};
deku.description = "Memunculkan menu";
deku.loading = true;

module.exports = deku;
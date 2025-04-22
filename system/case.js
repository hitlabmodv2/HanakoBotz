/**==================================
 - Script Case x Plugin By: Deku
 - Base Esce: nekobot - Axel-Network
==================================**/

const util = require("util");
const {
    exec
} = require("child_process");
const fs = require("node:fs");
const axios = require("axios");
const Func = require("../lib/function");
const {
    writeExif
} = require("../lib/sticker");
const pkg = require("../lib/case");
const Case = new pkg("./system/case.js");



module.exports = async (m,
    sock,
    client,
    conn,
    DekuGanz,
    config,
    text,
    Func,
    Scraper,
    Uploader,
    store,
    isAdmin,
    botAdmin,
    isPrems,
    isBanned,
) => {
    const quoted = m.isQuoted ? m.quoted : m;
    const args = quoted.args

    try {
        switch (m.command) {
            case "onlygc":
            case "onlygroup": {
                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }
                
                if (!m.isOwner) return m.reply('⚠️ Khusus Owner !')
                if (!text) return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                if (text.includes('1')) {
                    db.list().settings.onlygrub = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().settings.onlygrub = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️Pilih Options\n> • 1.Aktifkan ${m.command}\n> • 1.Nonaktifkan ${m.command}`
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m)
                }
            }
            break
            case "rvo":
            case "readviewonce": {
                const baileys = require('baileys')
                if (!m.quoted) throw `Reply ke view once message`
                let msg = m.quoted.message
                let type = Object.keys(msg)[0]
                let media = await baileys.downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
                let buffer = Buffer.from([])
                for await (const chunk of media) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                if (/video/.test(type)) {
                    return sock.sendFile(m.cht, buffer, 'media.mp4', msg[type].caption || '', m)
                } else if (/image/.test(type)) {
                    return sock.sendFile(m.cht, buffer, 'media.jpg', msg[type].caption || '', m)
                } else {
                    m.reply('gagal rvo file😂')
                }
            }
            break;
            case "wm":
            case "swm": {
                try {
                    if (!m.quoted) {
                        return m.reply(`Kirim/kutip stiker atau media lalu ketik ${m.prefix + m.command} San|Abc`);
                    }

                    let text = m.text.split('|');
                    let packname = text[0]?.trim() || config.sticker.packname;
                    let author = text[1]?.trim() || config.sticker.author;

                    await sock.sendMessage(m.cht, {
                        react: {
                            text: "🔎",
                            key: m.key
                        }
                    });

                    if (/image|video|webp/.test(quoted.msg?.mimetype)) {
                        let media = await quoted.download();

                        if (/video/.test(quoted.msg?.mimetype) && quoted.msg?.seconds > 25) {
                            return m.reply('Maksimal durasi video adalah 25 detik!');
                        }

                        let sticker = await writeExif({
                            mimetype: quoted.msg.mimetype,
                            data: media
                        }, {
                            packName: packname,
                            packPublish: author
                        });

                        if (sticker) {
                            await sock.sendMessage(m.cht, {
                                sticker
                            }, {
                                quoted: m
                            });
                        } else {
                            m.reply('Gagal membuat stiker dengan watermark.');
                        }
                    } else {
                        m.reply(`Kirim/kutip stiker, foto, atau video lalu ketik ${m.prefix + m.command} San|Abc`);
                    }
                } catch (error) {
                    m.reply(`Terjadi kesalahan: ${error.message}`);
                }
            }
            break;
            case "antilink": {
                if (!m.isGroup) return m.reply('maaf khusus group')
                if (!m.isOwner && !m.isAdmin) return m.reply('maaf command ini bisa nya ke admin and owner')

                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }

                if (!text)
                    return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);

                if (text.includes('1')) {
                    db.list().group[m.cht].anti.link = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().group[m.cht].anti.link = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                }
            }
            break;
            case "antilinkgc": {
                if (!m.isGroup) return m.reply('maaf khusus group')
                if (!m.isOwner && !m.isAdmin) return m.reply('maaf command ini bisa nya ke admin and owner')

                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }

                if (!text)
                    return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);

                if (text.includes('1')) {
                    db.list().group[m.cht].anti.linkgc = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().group[m.cht].anti.linkgc = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                }
            }
            break;
            case "antilinkch": {
                if (!m.isGroup) return m.reply('maaf khusus group')
                if (!m.isOwner && !m.isAdmin) return m.reply('maaf command ini bisa nya ke admin and owner')

                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }

                if (!text)
                    return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);

                if (text.includes('1')) {
                    db.list().group[m.cht].anti.linkch = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().group[m.cht].anti.linkch = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                }
            }
            break;
            case "antilinknumber": {
                if (!m.isGroup) return m.reply('maaf khusus group')
                if (!m.isOwner && !m.isAdmin) return m.reply('maaf command ini bisa nya ke admin and owner')

                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }

                if (!text)
                    return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);

                if (text.includes('1')) {
                    db.list().group[m.cht].anti.linknumber = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().group[m.cht].anti.linknumber = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                }
            }
            break;
            case "antitoxic": {
                if (!m.isGroup) return m.reply('maaf khusus group')
                if (!m.isOwner && !m.isAdmin) return m.reply('maaf command ini bisa nya ke admin and owner')

                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }

                if (!text)
                    return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);

                if (text.includes('1')) {
                    db.list().group[m.cht].anti.toxic = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().group[m.cht].anti.toxic = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                }
            }
            break;
            case "antitagsw": {
                if (!m.isGroup) return m.reply('maaf khusus group')
                if (!m.isOwner && !m.isAdmin) return m.reply('maaf command ini bisa nya ke admin and owner')

                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }

                if (!text)
                    return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);

                if (text.includes('1')) {
                    db.list().group[m.cht].anti.gctag = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().group[m.cht].anti.gctag = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                }
            }
            break;
            case "antinsfw": {
                if (!m.isGroup) return m.reply('maaf khusus group')
                if (!m.isOwner && !m.isAdmin) return m.reply('maaf command ini bisa nya ke admin and owner')

                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }

                if (!text)
                    return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);

                if (text.includes('1')) {
                    db.list().group[m.cht].anti.nsfw = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().group[m.cht].anti.nsfw = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                }
            }
            break;
            case "antibot": {
                if (!m.isGroup) return m.reply('maaf khusus group')
                if (!m.isOwner && !m.isAdmin) return m.reply('maaf command ini bisa nya ke admin and owner')

                let pp;
                try {
                    pp = await sock.profilePictureUrl(m.sender, 'image')
                } catch (e) {
                    pp = "https://file.btch.rf.gd/file/dlhruelxlqwdjeq28ilr.jpg"
                    try {
                        pp = "https://files.catbox.moe/px1m46.jpg"
                    } catch (e) {}
                }

                if (!text)
                    return sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);

                if (text.includes('1')) {
                    db.list().group[m.cht].anti.bot = true
                    m.reply(`Oke '${m.command}' Udah Di Aktifkan`)
                } else if (text.includes('2')) {
                    db.list().group[m.cht].anti.bot = false
                    m.reply(`Oke '${m.command}' Udah Di Nonaktifkan`)
                } else {
                    sock.sendAliasMessage(m.cht, {
                        text: `ℹ️ Select Option Number
> • 1. Mengaktifkan ${m.command}
> • 2. Mematikan ${m.command}`,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                serverMessageId: -1
                            },
                            externalAdReply: {
                                title: Func.Styles(`Hai ${m.pushName} Apakabar Syg🥰`),
                                body: Func.Styles(`${m.pushName}`),
                                mediaType: 1,
                                thumbnailUrl: pp,
                                sourceUrl: config.link.tt,
                            }
                        }
                    }, [{
                        alias: '1',
                        response: m.prefix + m.command + ' 1'
                    }, {
                        alias: '2',
                        response: m.prefix + m.command + ' 2'
                    }], m);
                }
            }
            break;
            case "ssearch": {
                const axios = require("axios");
                const cheerio = require("cheerio");

                class Sticker {
                    constructor(stickerPackName, url = null) {
                        this.sticker = stickerPackName;
                        this.BASE_URL = "https://getstickerpack.com/stickers?query=" + this.sticker;
                        this.url = url;
                    }

                    async search() {
                        try {
                            const {
                                data: html
                            } = await axios.get(this.BASE_URL);
                            const $ = cheerio.load(html);
                            const stickerPacks = [];

                            $(".sticker-pack-cols").each((i, el) => {
                                const packUrl = $(el).find("a").attr("href");
                                const trayImage = $(el).find("img").attr("src");
                                const username = $(el).find(".username").text();
                                const title = $(el).find(".title").text();

                                stickerPacks.push({
                                    packUrl,
                                    trayImage,
                                    username,
                                    title
                                });
                            });

                            return stickerPacks;
                        } catch (error) {
                            console.error("Error fetching stickers:", error);
                            return [];
                        }
                    }
                    async download() {
                        try {
                            const {
                                data: hl
                            } = await axios.get(this.url);
                            const $ = cheerio.load(hl);
                            const stickers = [];

                            $(".sticker-image").each((i, el) => {
                                const stickerImage = $(el).attr("data-src-large");
                                stickers.push(stickerImage);
                            });

                            return stickers;
                        } catch (error) {
                            console.error("Error downloading stickers:", error);
                        }
                    }
                }
                try {
                    if (m.text) {
                        const stickerName = m.text.trim();
                        const data = new Sticker(stickerName);
                        const results = await data.search();

                        if (results && results.length > 0) {
                            let message = "Stiker ditemukan, pilih pack yang ingin diunduh:\n\n";
                            results.forEach((result, index) => {
                                message += `${index + 1}. *${result.title}* oleh ${result.username}\n`;
                                message += `Preview: ${result.trayImage}\n`;
                                message += `Pack Url: ${result.packUrl}\n\n`
                            });

                            m.reply(message);
                        } else {
                            m.reply("Tidak ditemukan stiker dengan kata kunci tersebut.");
                        }
                    } else {
                        m.reply("Masukkan kata kunci untuk mencari stiker.");
                    }
                } catch (error) {
                    m.reply(`Terjadi kesalahan: ${error.message}`);
                }
            }
            break;
            case "jadwalsholat": {
                const axios = require('axios');
                const cheerio = require('cheerio');
                if (!text) return m.reply("> 📍 Masukkan nama kota yang kamu tuju!");
                const kota = text?.toLowerCase() || 'jakarta';

                try {
                    const {
                        data
                    } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`);
                    const $ = cheerio.load(data);

                    const jadwal = $('tr.currDate td').map((i, el) => $(el).text()).get();

                    if (jadwal.length === 7) {
                        const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;

                        const zan = `
╭──[ *📅 Jadwal Sholat* ]──✧
᎒⊸ *🌆 Kota*: ${kota.charAt(0).toUpperCase() + kota.slice(1)}
᎒⊸ *📅 Tanggal*: ${tanggal}

╭──[ *🕰️ Waktu Sholat* ]──✧
᎒⊸ *Subuh:* ${subuh}
᎒⊸ *Duha:* ${duha}
᎒⊸ *Dzuhur:* ${dzuhur}
᎒⊸ *Ashar:* ${ashar}
᎒⊸ *Maghrib:* ${maghrib}
᎒⊸ *Isya:* ${isya}
╰────────────•`;

                        await m.reply(zan);
                    } else {
                        await m.reply('❌ Jadwal sholat tidak ditemukan. Pastikan nama kota sesuai.');
                    }
                } catch (error) {
                    await m.reply('❌ Terjadi kesalahan saat mengambil data!');
                }
            }
            break;
            case "cases": {
                if (!m.isOwner) return m.reply(config.messages.owner);

                let cap = "*– 乂 *Fitur Case* –*\n";
                cap += "> 📝 *`--add`* : Menambahkan fitur case baru\n";
                cap += "> 🔄 *`--get`* : Mengambil fitur case\n";
                cap += "> ❌ *`--delete`* : Menghapus fitur case\n";
                cap += "\n*– 乂 *List Case yang Tersedia* –*\n";
                cap += Case.list().map((a, i) => `> ${i + 1}. *${a}*`).join("\n");

                if (!text) return m.reply(cap);

                if (text.includes("--add")) {
                    if (!m.quoted) return m.reply("> ⚠️ Reply fitur case yang ingin disimpan!");
                    let status = Case.add(m.quoted.body);
                    m.reply(status ? "> ✅ Berhasil menambahkan case baru!" : "> ❌ Gagal menambahkan case baru.");
                } else if (text.includes("--delete")) {
                    let input = text.replace("--delete", "").trim();
                    if (!input) return m.reply("> ⚠️ Masukkan nama case yang ingin dihapus!");
                    let status = Case.delete(input);
                    m.reply(status ? `> ✅ Berhasil menghapus case *${input}*!` : `> ❌ Case *${input}* tidak ditemukan!`);
                } else if (text.includes("--get")) {
                    let input = text.replace("--get", "").trim();
                    if (!input) return m.reply("> ⚠️ Masukkan nama case yang ingin diambil!");
                    if (!Case.list().includes(input)) return m.reply("> ❌ Case tidak ditemukan!");
                    let status = Case.get(input);
                    m.reply(status ? status : `> ❌ Case *${input}* tidak ditemukan!`);
                }
            }
            break;
            case "zzz": {
                let list = await Scraper.zzz.list();
                if (!text) return m.reply("> *🔍 Masukkan nama karakter dari game ZZZ*");

                let chara = list.find((a) => a.name.toLowerCase() === text.toLowerCase());
                if (!chara) return m.reply(`> *😞 Karakter tidak ditemukan!*

*– 乂 Berikut ${list.length} karakter dari game ZZZ:*

${list.map((a) => Object.entries(a).map(([a, b]) => `> *🔸 ${a.capitalize()}* : ${b}`).join('\n')).join("\n\n")}`);

                let data = await Scraper.zzz.chara(text);
                let cap = "*– 乂 **Zenless Zone Zero - Detail Karakter***\n"
                cap += Object.entries(data.info).map(([a, b]) => `> *🔹 ${a.capitalize()}* : ${b}`).join("\n");
                cap += "\n\n*– **Statistik Karakter** :*\n"
                cap += data.stats.map((a) => `> *🔸 ${a.name.capitalize()}* : ${a.value}`).join("\n");
                cap += "\n\n*– **Info Tim Karakter** :*\n"
                cap += data.team.map((a) => `> *🔹 Nama*: ${a.name}\n> *🔸 Peran*: ${a.role}`).join("\n\n");

                cap += "\n\n*– **Kemampuan Karakter** :*\n"
                cap += data.skills.map((a) => `> *🔸 Nama Kemampuan*: ${a.name}\n> ${a.description}`).join("\n\n");

                m.reply({
                    text: cap,
                    contextInfo: {
                        externalAdReply: {
                            title: `– **Zenless Zone Zero Wiki**: ${data.info.name}`,
                            body: `- **Elemen**: ${data.info.element}`,
                            mediaType: 1,
                            thumbnailUrl: data.info.image
                        }
                    }
                });
            }
            break;

            case "sticker":
            case "s": {
                if (/image|video|webp/.test(quoted.msg.mimetype)) {
                    let media = await quoted.download();
                    if (quoted.msg?.seconds > 10)
                        throw "> *⚠️ Video lebih dari 10 detik tidak dapat dijadikan sticker*.";

                    let exif;
                    if (text) {
                        let [packname, author] = text.split(/[,|\-+&]/);
                        exif = {
                            packName: packname ? packname : "",
                            packPublish: author ? author : "",
                        };
                    } else {
                        exif = {
                            packName: config.sticker.packname,
                            packPublish: config.sticker.author,
                        };
                    }

                    let sticker = await writeExif({
                        mimetype: quoted.msg.mimetype,
                        data: media
                    }, exif);

                    await m.reply({
                        sticker
                    });
                } else if (m.mentions.length !== 0) {
                    for (let id of m.mentions) {
                        await delay(1500);
                        let url = await sock.profilePictureUrl(id, "image");
                        let media = await axios
                            .get(url, {
                                responseType: "arraybuffer",
                            })
                            .then((a) => a.data);
                        let sticker = await writeExif(media, {
                            packName: config.sticker.packname,
                            packPublish: config.sticker.author,
                        });
                        await m.reply({
                            sticker
                        });
                    }
                } else if (
                    /(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(
                        text,
                    )
                ) {
                    for (let url of Func.isUrl(text)) {
                        await delay(1500);
                    }
                } else {
                    m.reply("> *📸 Balas dengan foto atau video untuk dijadikan sticker*.");
                }
            }
            break;

            case "cases": {
                if (!m.isOwner) return m.reply(config.messages.owner);

                let cap = "*– 乂 **Cara Penggunaan Fitur Case***\n";
                cap += "> *➕ `--add`* untuk menambah fitur case baru\n";
                cap += "> *🔄 `--get`* untuk mengambil fitur case yang ada\n";
                cap += "> *❌ `--delete`* untuk menghapus fitur case\n";
                cap += "\n*– 乂 **Daftar Case yang Tersedia** :*\n";
                cap += Case.list().map((a, i) => `> *${i + 1}.* ${a}`).join("\n");

                if (!text) return m.reply(cap);

                if (text.includes("--add")) {
                    if (!m.quoted) return m.reply("> *⚠️ Balas dengan fitur case yang ingin disimpan*.");
                    let status = Case.add(m.quoted.body);
                    m.reply(status ? "> *✅ Berhasil menambahkan case baru!*" : "> *❌ Gagal menambahkan case baru*.");
                } else if (text.includes("--delete")) {
                    let input = text.replace("--delete", "").trim();
                    if (!input) return m.reply("> *⚠️ Masukkan nama case yang ingin dihapus*!");
                    let status = Case.delete(input);
                    m.reply(status ? `> *✅ Berhasil menghapus case: ${input}!*` : `> *❌ Case ${input} tidak ditemukan. Periksa daftar case yang tersedia*.`);
                } else if (text.includes("--get")) {
                    let input = text.replace("--get", "").trim();
                    if (!input) return m.reply("> *⚠️ Masukkan nama case yang ingin diambil*!");
                    if (!Case.list().includes(input)) return m.reply("> *❌ Case tidak ditemukan!*");
                    let status = Case.get(input);
                    m.reply(status ? status : `> *❌ Case ${input} tidak ditemukan. Periksa daftar case yang tersedia*.`);
                }
            }
            break;
        }
    } catch (error) {
        if (error.name) {
            for (let owner of config.owner) {
                let jid = await sock.onWhatsApp(owner + "@s.whatsapp.net");
                if (!jid[0].exists) continue;
                let caption = "*– 乂 *Error Terdeteksi* 📉*\n"
                caption += `> *-* Nama command : ${m.command}\n`
                caption += `> *-* Lokasi File : Case`
                caption += `\n\n${Func.jsonFormat(error)}`

                sock.sendMessage(owner + "@s.whatsapp.net", {
                    text: caption
                })
            }
            m.reply("*– 乂 *Error Terdeteksi* 📉*\n !*\n> Command gagal dijalankan karena terjadi error\n> Laporan telah terkirim kepada owner kami dan akan segera di perbaiki !");
        } else {
            m.reply(Func.jsonFormat(error));
        }
    } finally {
        if (db.list().settings.online) {
            await sock.readMessages([m.key]);
        }
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("- Terjadi perubahan pada files case.js");
    delete require.cache[file];
});
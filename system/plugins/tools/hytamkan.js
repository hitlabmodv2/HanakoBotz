
/** *Plugin Hytamkan Waifu*
   * @Author: Deku
   * @Api: https://api.hiuraa.my.id/
   * @Npm: @vioo/apis, path, file-type, fs
   * @Ch: https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W
**/

const axios = require('axios');
const fs = require('fs');
const vio = require('@vioo/apis')
const path = require('path');
const {
    fromBuffer
} = require("file-type");

let rin = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {
    const quoted = m.quoted ? m.quoted : m;
    if (!quoted.msg.mimetype) {
        let panduan = `╭━━━『 Hytamkan Waifu 』━━━⬣
┃
┃ ⚠️ *Cara Penggunaan:*
┃ 1. Kirim gambar dengan caption .hitamkan
┃ 2. Atau reply gambar dengan .hitamkan
┃
┃ 📝 *Note:* 
┃ • Pastikan gambar yang dikirim jelas
┃ • Tunggu proses hingga selesai
┃ • Command ini menggunakan 2 limit
┃
╰━━━━━━━━━━━━━━━⬣`
        return sock.sendMessage(m.cht, {
            text: panduan,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: true,
                forwardingScore: 999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: `${config.name} By: ${config.ownername}`,
                    serverMessageId: -1
                }
            }
        }, { quoted: m });
    }
    if (/image|jpeg|png/.test(quoted.msg.mimetype)) {
        try {
            await sock.sendMessage(m.cht, { react: { text: "⏳", key: m.key }}); // Loading reaction
            await sock.sendMessage(m.cht, { text: "⌛ Sedang memproses gambar..." }, { quoted: m });
            const media = await quoted.download();
            const {
                ext,
                mime
            } = (await fromBuffer(media)) || {};
            const tmpDir = path.join(process.cwd(), 'tmp');
            // Create tmp directory if it doesn't exist
            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir, { recursive: true });
            }
            const file = path.join(tmpDir, `${Date.now()}-tmpfiles.${ext}`);
            await fs.writeFileSync(file, media);
            const tmpfile = await vio.uploader.tempfiles(file);
            const api = await axios.post(`https://api.hiuraa.my.id/ai/gemini-canvas?text=Make+this+skin+black&imageUrl=${tmpfile}`);
            const {
                result: result
            } = api.data;
            const hytamkan = Buffer.from(result.image.base64, 'base64');
            await sock.sendMessage(m.cht, {
                image: hytamkan,
                caption: '✅ Penghytaman Nya Berhasil!'
            }, {
                quoted: await m.froll()
            });
            m.react("✅"); // Success reaction
        } catch (e) {
            m.reply(`❌ Error: ${e}`);
            m.react("❌"); // Error reaction
        };
    };
};

rin.command = "hitamkan";
rin.alias = ["hytamkan", "hytamkanwaifu"];
rin.category = ["tools"];
rin.settings = {
    limit: 2 // Set limit usage to 2
};
rin.loading = true;

module.exports = rin;


const axios = require('axios');

module.exports = {
    command: "tohijab",
    alias: ["hijabify"],
    category: ["tools"],
    description: "Convert photo to use hijab style",
    settings: {
        limit: true
    },
    async run(m, { sock, text }) {
        if (!m.quoted && !m.quoted?.message?.imageMessage && !text) {
            return m.reply(`╭─「 *To Hijab* 」
│
│ Convert photo to use hijab style
│
├ • *Usage:* 
│ • Reply image with caption .tohijab
│ • .tohijab <image_url>
│
├ *Example:*
│ • .tohijab https://example.com/photo.jpg
╰────`);
        }

        try {
            const reactionMessage = {
                react: {
                    text: "⏳",
                    key: m.key
                }
            };
            await sock.sendMessage(m.chat, reactionMessage);

            let imageUrl;
            if (m.quoted && m.quoted.message?.imageMessage) {
                const buffer = await m.quoted.download();
                // Upload image first using available uploader
                const uploaded = await require('../../lib/uploader').telegraph(buffer);
                imageUrl = uploaded;
            } else {
                imageUrl = text;
            }

            const { key } = await sock.sendMessage(m.chat, { 
                text: "*⏳ Processing image...*\n└ Please wait a moment",
                contextInfo: {
                    externalAdReply: {
                        title: "To Hijab",
                        body: "Powered by Nekorinn API",
                        thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/7945/7945193.png",
                        sourceUrl: "https://api.nekorinn.my.id",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });

            // Validate image URL
            if (!imageUrl.match(/\.(jpg|jpeg|png)$/i)) {
                throw new Error('Invalid image format. Please use JPG/JPEG/PNG images');
            }

            // Validasi URL gambar
            try {
                const validURL = new URL(imageUrl);
            } catch (e) {
                throw new Error('URL gambar tidak valid!');
            }

            // Cek apakah URL bisa diakses
            try {
                const checkImage = await axios.head(imageUrl);
                if (!checkImage.headers['content-type']?.includes('image')) {
                    throw new Error('URL yang diberikan bukan gambar!');
                }
            } catch (e) {
                throw new Error('Gambar tidak bisa diakses! Pastikan URL gambar bisa dibuka.');
            }

            const response = await axios.get(`https://api.nekorinn.my.id/tools/to-hijab?imageUrl=${encodeURIComponent(imageUrl)}`, {
                responseType: 'arraybuffer',
                timeout: 30000, // Timeout 30 detik
                validateStatus: function (status) {
                    return status >= 200 && status < 300;
                }
            });

            await sock.sendMessage(m.chat, { 
                image: Buffer.from(response.data),
                caption: "✨ Here's your photo with hijab style"
            }, { quoted: m });

            await sock.sendMessage(m.chat, { delete: key });
        } catch (error) {
            console.error(error);
            m.reply("❌ Gagal memproses gambar. Pastikan gambar atau URL yang kamu berikan valid.\n\nCara penggunaan:\n1. Kirim/balas gambar dengan caption .tohijab\n2. Atau ketik .tohijab <url_gambar>\n\nContoh: .tohijab https://example.com/foto.jpg");
        }
    }
};

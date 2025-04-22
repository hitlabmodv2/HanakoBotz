
const axios = require('axios');

let rinokumura = {
    command: "sologoai",
    category: ["tools", "ai"],
    alias: ["logoai", "ailogo"],
    settings: {
        limit: true
    },
    description: "Membuat logo AI dengan SoloGo AI",
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
        if (!text) {
            return m.reply(`乂 *SOLOGO AI*

Buat logo untuk brand kamu menggunakan AI!
Silakan berikan informasi berikut:

◦ *Format:* .sologoai judul|slogan|industri
◦ *Contoh:* .sologoai Cosmic Tech|Inovasi untuk Masa Depan|Teknologi

Bot akan menghasilkan beberapa variasi logo untuk brand kamu.`)
        }

        let [title, slogan, industry] = text.split("|")
        if (!title || !slogan || !industry) return m.reply('⚠️ Mohon berikan semua informasi yang diperlukan: judul|slogan|industri')

        try {
            let response = await axios.get(`https://api.nekorinn.my.id/maker/sologo-ai?title=${encodeURIComponent(title)}&slogan=${encodeURIComponent(slogan)}&industry=${encodeURIComponent(industry)}`);
            
            if (!response.data.result || !response.data.result.logos) {
                return m.reply('❌ Gagal menghasilkan logo');
            }

            let logos = response.data.result.logos;
            
            // Kirim preview logo pertama
            let previewText = `乂 *HASIL SOLOGO AI*

◦ *Judul:* ${title}
◦ *Slogan:* ${slogan}
◦ *Industri:* ${industry}

Menampilkan 5 variasi logo terbaik untuk brand anda.
Mohon tunggu...`

            await sock.sendMessage(m.cht, {
                image: { url: logos[0].thumb },
                caption: previewText
            });

            // Kirim maksimal 5 variasi logo
            let sentCount = 0;
            for (let logo of logos) {
                if (sentCount >= 5) break;
                let style = logo.style[0]; // Ambil style pertama saja
                await sock.sendMessage(m.cht, {
                    image: { url: style.thumb },
                    caption: `*Gaya Logo:* ${style.title}\n*Keterangan:* ${style.desc}`
                });
                sentCount++;
            }

        } catch (error) {
            console.error(error);
            m.reply('❌ Terjadi kesalahan saat menghasilkan logo');
        }
    }
}

module.exports = rinokumura

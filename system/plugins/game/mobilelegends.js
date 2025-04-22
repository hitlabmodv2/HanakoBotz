
const axios = require('axios');

module.exports = {
    command: ["mlinfo"],
    alias: ["mlinfo"],
    category: ["info"],
    description: "Menampilkan informasi turnamen Mobile Legends",
    loading: true,
    async run(m, { sock, Func }) {
        try {
            const response = await axios.get('https://api.nekorinn.my.id/info/infotourney');
            if (!response.data || !response.data.result || response.data.result.length === 0) {
                return m.reply('❌ Tidak ada informasi turnamen yang tersedia saat ini.');
            }

            let tournaments = response.data.result;
            let caption = `╭─「 *MOBILE LEGENDS TOURNAMENT* 」\n`;

            tournaments.forEach((tournament, index) => {
                if (index < 5) {
                    caption += `│\n`;
                    caption += `├ *${tournament.title}*\n`;
                    caption += `│ ◦ Tanggal: ${tournament.datePublished}\n`;
                    if (tournament.description) caption += `│ ◦ Deskripsi: ${tournament.description}\n`;
                    if (tournament.info) caption += `│ ◦ Info: ${tournament.info}\n`;
                    if (tournament.link) caption += `│ ◦ Link: ${tournament.link}\n`;
                    caption += `│\n`;
                    if (index < 4) caption += `├───────────────\n`;
                }
            });

            caption += `╰────────────────────`;

            await sock.sendMessage(m.chat, {
                image: { url: tournaments[0].imageUrl },
                caption: caption,
                footer: global.footer,
                headerType: 4
            });

        } catch (e) {
            console.error(e);
            m.reply('❌ Terjadi kesalahan saat mengambil data turnamen. Silakan coba lagi nanti.');
        }
    }
};

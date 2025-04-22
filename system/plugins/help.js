
let deku = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    config
}) => {

    let text = `╭━━━『 📚 Tutorial Bot 』━━━⬣
┃
┃ 1️⃣ *Cara Membuat Stiker*
┃ ╭────────────────
┃ │• 🖼️ Reply/Kirim gambar dengan
┃ │  caption '.sticker'
┃ │• ⏱️ Video max 10 detik
┃ │• 🏷️ Custom WM: '.s nama|nama2'
┃ ╰────────────────
┃
┃ 2️⃣ *Cara Mengakses Menu*
┃ ╭────────────────
┃ │• 📋 Menu List: '.menu list'
┃ │• 📱 Semua Menu: '.allmenu'
┃ │• 📁 Kategori: anime/tools/
┃ │  downloader/search/case/
┃ │  menfess/game/rpg
┃ ╰────────────────
┃
┃ 3️⃣ *Cara Download Media*
┃ ╭────────────────
┃ │• 🎵 Download TikTok:
┃ │  '.tt [link]'
┃ │• 🎧 Putar Musik:
┃ │  '.play [judul]'
┃ │• 📺 Download YouTube:
┃ │  '.ytdl [link]'
┃ ╰────────────────
┃
╰━━━━━━━━━━━━━━━⬣`;

    await sock.sendMessage(m.cht, {
        image: { url: './image/Hanako-kun.jpg' },
        caption: Func.Styles(text),
        footer: `© ${config.name}`,
        buttons: [{
            buttonId: '.menu',
            buttonText: {
                displayText: '🏠 Kembali ke Menu'
            },
            type: 1
        }, {
            buttonId: '.allmenu',
            buttonText: {
                displayText: '📋 Semua Menu'
            },
            type: 1
        }]
    }, { quoted: m });
};

deku.command = "help";
deku.alias = ["tutorial"];
deku.category = ["main"];
deku.loading = true;

module.exports = deku;

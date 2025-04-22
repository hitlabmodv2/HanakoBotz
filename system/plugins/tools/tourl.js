let Yukio = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Uploader,
    Func,
    Scraper,
    text,
    config
}) => {
    switch (m.command) {
        case "tourl":
        case "touploader": {
            let target = m.quoted ? m.quoted : m;
            if (target.msg.mimetype) {
                if (!target) throw "⚠️ *Oops!* Harap kirim atau balas media (gambar/video) yang ingin diubah menjadi tautan.";

                let buffer = await target.download();
                let caturl = await Uploader.catbox(buffer);
                let nauval = await Scraper.nauvalCdn(buffer)

                let caption = `✨ *Media to URL Uploader* ✨\n\n`
                caption += `> 📂 *Ukuran media:* ${Func.formatSize(buffer.length)}\n`;
                caption += `> 🔗 *Tautan hasil*\n`;
                caption += `> 🔗 *Tautan 1:* ${caturl}\n`;
                caption += `> 🔗 *Tautan 2:* ${nauval.fileUrl}\n\n`
                caption += `💡 *Tips:* Gunakan fitur ini untuk berbagi media dengan lebih mudah tanpa perlu mengunggah ulang.`;

                m.reply(`${caption}`);
            } else {
                if (!target) throw "⚠️ *Oops!* Bukan Media Gambar Foto/Video";
            }
        }
        break
    }
}

module.exports = {
    command: "tourl",
    alias: [
        "touploader"
    ],
    category: [
        "tools"
    ],
    settings: {
        limit: true
    },
    loading: true,
    run: Yukio
}

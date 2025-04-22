
class Command {
    constructor() {
        this.command = "remini"
        this.alias = [
            "hdr", "hd"
        ]
        this.category = [
            "tools"
        ]
        this.settings = {
            limit: true,
            loading: true
        }
        this.description = "menjernihkan Foto"
    }
    run = async (m, {
        sock,
        client,
        conn,
        DekuGanz,
        Func,
        Uploader,
        Scraper,
        text,
        config
    }) => {
        try {
            let quoted = m.quoted ? m.quoted : m;
            let mime = (quoted.msg || quoted)?.mimetype || '';

            if (!quoted || !mime || !mime.includes('image')) {
                await sock.sendMessage(m.cht, {
                    text: '> Reply/Kirim photo yang mau di jernihkan!\n\n_Note: Pastikan kamu membalas/mengirim foto yang ingin dijernihkan._'
                }, { quoted: m });
                return;
            }

            // Send loading message after confirming image exists
            const loadingMsg = await m.reply('⏳ Sedang memproses gambar...');

            if (!quoted || !mime || !mime.includes('image')) {
                await sock.sendMessage(m.cht, {
                    text: '> Reply/Kirim photo yang mau di jernihkan!\n\n_Note: Pastikan kamu membalas/mengirim foto yang ingin dijernihkan._'
                }, { quoted: m });
                return;
            }

            const media = await quoted.download()
            const IMAGE = await Uploader.tmpfiles(media);
            const SETTINGS = {
                face_enhance: {
                    model: "remini"
                },
                background_enhance: {
                    model: "rhino-tensorrt"
                },
                bokeh: {
                    aperture_radius: "0",
                    highlights: "0.20",
                    vivid: "0.75",
                    group_picture: "true",
                    rescale_kernel_for_small_images: "true",
                    apply_front_bokeh: "false"
                },
                jpeg_quality: 90
            }
            const result = await Scraper.reminiweb(IMAGE, SETTINGS);
            if (!result) throw 'Gagal memproses gambar';

            const Ukuran = await Func.getSize(result.no_wm)
            const date = new Date().toLocaleString("id-ID", {timeZone: "Asia/Jakarta"});
            const [tanggal, waktu] = date.split(" ");

            await sock.sendMessage(m.cht, {
                image: {
                    url: result.no_wm
                },
                caption: Func.Styles(`╭─⌬ *ʀᴇᴍɪɴɪ ᴘʜᴏᴛᴏ* ⌬
├ 📅 *ᴛᴀɴɢɢᴀʟ:* ${tanggal}
├ ⏰ *ᴡᴀᴋᴛᴜ:* ${waktu} WIB
└ 📁 *sɪᴢᴇ:* ${Ukuran}`)
            }, {
                quoted: m
            });

        } catch (e) {
            console.error('Remini Error:', e);
            m.reply('Maaf terjadi kesalahan: ' + e.message);
        }
    }
}

module.exports = new Command();

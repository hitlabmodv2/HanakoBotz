const {
    execSync
} = require("child_process");
const fs = require("fs");
const path = require("path");
const {
    writeExif
} = require(process.cwd() + "/lib/sticker");
module.exports = {
    command: "brat",
    alias: [
        "bratgenerator",
        "bratsticker"
    ],
    category: [
        "tools"
    ],
    settings: {
        limit: true
    },
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
        let input = m.isQuoted ? m.quoted.body : text;
        if (!input) return m.reply(`⚠️ Masukan Reply/Query\n\nbrat Video\n${m.prefix + m.command} query/reply --animated\n\nBrat Biasa\n${m.prefix + m.command} query/reply`);
        m.reply(config.messages.wait);

        if (m.text.includes("--animated")) {
            let txt = input.replace("--animated", "").trim().split(" ");
            let array = [];
            let tmpDirBase = path.resolve(`./tmp/brat_${Date.now()}`);

            fs.mkdirSync(tmpDirBase, {
                recursive: true
            })
            for (let i = 0; i < txt.length; i++) {
                let word = txt.slice(0, i + 1).join(" ");
                let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(word)}`, {
                    responseType: 'arraybuffer'
                })).data;
                let tmpDir = path.resolve(`${tmpDirBase}/brat_${i}.mp4`);
                fs.writeFileSync(tmpDir, media);
                array.push(tmpDir);
            }

            let fileTxt = path.resolve(`${tmpDirBase}/cmd.txt`);
            let content = "";
            for (let i = 0; i < array.length; i++) {
                content += `file '${array[i]}'\n`;
                content += `duration 0.5\n`;
            }
            content += `file '${array[array.length - 1]}'\n`;
            content += `duration 3\n`;
            fs.writeFileSync(fileTxt, content);

            let output = path.resolve(`${tmpDirBase}/output.mp4`);
            execSync(`ffmpeg -y -f concat -safe 0 -i ${fileTxt} -vf "fps=30" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 ${output}`);
            let sticker = await writeExif({
                mimetype: "video",
                data: fs.readFileSync(output)
            }, {
                packName: config.sticker.packname,
                packPublish: config.sticker.author
            });
            fs.rmSync(tmpDirBase, {
                recursive: true,
                force: true
            });
            await m.reply({
                sticker
            });
        } else {
            let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(input)}`, {
                responseType: 'arraybuffer'
            })).data;
            let sticker = await writeExif({
                mimetype: "image",
                data: media
            }, {
                packName: config.sticker.packname,
                packPublish: config.sticker.author
            });
            await m.reply({
                sticker
            });
        }
    }
}

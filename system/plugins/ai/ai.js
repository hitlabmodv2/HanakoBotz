
const axios = require('axios');

module.exports = {
    command: "tts",
    alias: ["texttospeech"],
    category: ["ai"],
    description: "Convert text to speech using OpenAI TTS",
    async run(m, { sock, text }) {
        if (!text) {
            return m.reply(`╭─「 *Text To Speech* 」
│
│ Mengubah teks menjadi suara menggunakan OpenAI
│
├ • *Cara Pakai:* .tts <suara> <teks>
│
├ *Suara Tersedia:*
│ • alloy
│ • ash
│ • ballad
│ • coral
│ • echo
│ • fable
│ • onyx
│ • nova
│ • sage
│ • shimmer
│ • verse
│
├ *Contoh:*
│ • .tts alloy Halo Dunia
│ • .tts nova Selamat Pagi
│ • .tts echo Apa Kabar?
╰────`);
        }

        // Handle text input more effectively
        let voice = "alloy";
        let message = text;
        
        const voices = ["alloy", "ash", "ballad", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer", "verse"];
        const firstWord = text.split(" ")[0].toLowerCase();
        
        // Check if first word is a valid voice
        if (voices.includes(firstWord)) {
            voice = firstWord;
            message = text.substring(firstWord.length).trim();
        }

        // If message is empty, use full text
        if (!message) {
            message = text;
        }

        // Check text length and split if needed
        if (message.length > 200) {
            return m.reply("⚠️ Teks terlalu panjang! Maksimal 200 karakter.");
        }

        try {
            const reactionMessage = {
                react: {
                    text: "⏳",
                    key: m.key
                }
            };
            await sock.sendMessage(m.chat, reactionMessage);

            const { key } = await sock.sendMessage(m.chat, { 
                text: "*⏳ Generating audio...*\n└ Please wait a moment",
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: "Text To Speech",
                        body: "Powered by OpenAI",
                        thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/8588/8588497.png",
                        sourceUrl: "https://wa.me/6289688206739",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });
            
            const response = await axios.get(`https://api.nekorinn.my.id/tools/openai-tts?text=${encodeURIComponent(message)}&voice=${voice}`, {
                responseType: 'arraybuffer'
            });

            await sock.sendMessage(m.chat, { 
                audio: Buffer.from(response.data),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: m });

            await sock.sendMessage(m.chat, { delete: key });
        } catch (error) {
            console.error(error);
            m.reply("Failed to generate audio. Please try again later.");
        }
    }
};

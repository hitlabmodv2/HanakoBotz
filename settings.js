const fs = require('node:fs');

const config = {
    owner: ["6289688206739"],
    name: "ZEEBOT MD",
    ownername: 'WILY', 
    ownername2: 'KUN',
    prefix: [".", "?", "!", "/", "#"], //Tambahin sendiri prefix nya kalo kurang
    wagc: [ "https://chat.whatsapp.com/KOHWg6v5GCc9pxpVIj0GtB", "https://chat.whatsapp.com/H9UeMjqecE94rKo4NnVAP8" ],
    saluran: '120363312297133690@newsletter', 
    jidgroupnotif: '120363312297133690@newsletter', 
    saluran2: '120363312297133690@newsletter', 
    jidgroup: '120363312297133690@newsletter', 
    wach: 'https://whatsapp.com/channel/0029VaiyhS37IUYSuDJoJj1L', 
    sessions: "sessions",
    groq: {
     api: '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'
    },
    link: {
     tt: "https://wa.me/6289688206739"
    },
    sticker: {
      packname: "〆 ʙᴏᴛᴢ",
      author: "ʙʏ: Wilykun 〆"
    },
   messages: {
      wait: "*( Loading )* Tunggu Sebentar...",
      owner: "*( Denied )* Kamu bukan owner ku !",
      premium: "*( Denied )* Fitur ini khusus user premium",
      group: "*( Denied )* Fitur ini khusus group",
      botAdmin: "*( Denied )* Lu siapa bukan Admin group",
      grootbotbup: "*( Denied )* Jadiin Yuta-Botz admin dulu baru bisa akses",
   },
   database: "hanako-db",
   tz: "Asia/Jakarta"
}

module.exports = config

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
  delete require.cache[file];
});

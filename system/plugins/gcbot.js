
const moment = require('moment-timezone');

module.exports = {
  command: "gcbot",
  alias: ["gchanako", "grupbot"],
  category: ["main", "info"],
  description: "Get bot's official group link",
  async run(m) {
    // Set timezone to Asia/Jakarta
    moment.tz.setDefault('Asia/Jakarta');
    
    // Get current date and time
    const date = moment().format('DD/MMM/YYYY');
    const time = moment().format('hh:mm A');
    const timeOfDay = (() => {
      const hour = moment().hour();
      if (hour >= 5 && hour < 12) return "Pagi";
      if (hour >= 12 && hour < 15) return "Siang";
      if (hour >= 15 && hour < 18) return "Sore";
      return "Malam";
    })();

    // Add reaction to user's message
    await m.react('💭');

    // Send formatted message
    m.reply(`┌──『 *GROUP BOT OFFICIAL* 』──❖
│
│ ⌬ *Tanggal:* ${date}
│ ⌬ *Waktu:* ${time} (${timeOfDay})
│ ⌬ *Link Grup:* 
│ https://chat.whatsapp.com/KOHWg6v5GCc9pxpVIj0GtB
│
└──────────────────❖`);
  }
}

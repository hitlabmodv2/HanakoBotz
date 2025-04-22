// © HanakoBotzz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

const util = require('util');
const osu = require('node-os-utils');
const { sizeFormatter } = require('human-readable');
const os = require('os');
const speed = require('performance-now');
const NotDetect = "Not Detected";

let yukio = async (m, { sock, client, conn, DekuGanz, Func, Scraper, text, config }) => {
    await sock.sendMessage(m.chat, { react: { text: "⚡", key: m.key } });

    const used = process.memoryUsage();
    const formatp = sizeFormatter({
        std: 'JEDEC',
        decimalPlaces: 2,
        keepTrailingZeroes: false,
        render: (literal, symbol) => `${literal} ${symbol}B`,
    });

    let timestamp = speed();
    let latensi = speed() - timestamp;
    const cpus = await os.cpus();
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
        last.total += cpu.total
        last.speed += cpu.speed / length
        last.times.user += cpu.times.user
        last.times.nice += cpu.times.nice
        last.times.sys += cpu.times.sys
        last.times.idle += cpu.times.idle
        last.times.irq += cpu.times.irq
        return last
    });

    let dy9 = new Date(new Date + 3600000)
    let locale = 'id'
    let weeks9 = dy9.toLocaleDateString(locale, { weekday: 'long' });
    let dates9 = dy9.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let times9 = dy9.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    let netsIn, netsOut
    await osu.netstat.inOut().then(info => {
        netsIn = (info.total.inputMb + ' MB'),
        netsOut = (info.total.outputMb + ' MB')
    }).catch(() => {
        netsIn = NotDetect,
        netsOut = NotDetect
    });

    let driveTotal, driveUsed, drivePer
    await osu.drive.info().then(info => {
        driveTotal = (info.totalGb + ' GB'),
        driveUsed = info.usedGb,
        drivePer = (info.usedPercentage + '%')
    }).catch(() => {
        driveTotal = NotDetect,
        driveUsed = NotDetect,
        drivePer = NotDetect
    });

    function runtime(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " Hari, " : " Hari, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " Jam, " : " Jam, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " Menit, " : " Menit, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " Detik" : " Detik") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    };

    let cap = `╭━━━━『 📊 Informasi Ping 』━━━━⊱\n`;
    cap += `┃\n`;
    cap += `┃ 📈 Server Status\n`;
    cap += `┃ ⚡ Response Speed : [ ${latensi.toFixed(4)} ]\n`;
    cap += `┃ ⏰ Runtime : [ ${runtime(process.uptime())} ]\n`;
    cap += `┃\n`;
    cap += `┃ 💻 Server Information\n`;
    cap += `┃ 🧠 RAM : [ ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())} ]\n`;
    cap += `┃ 🖥️ Server : [ ${os.hostname()} ]\n`;
    cap += `┃ 💿 CPU Model : [ ${osu.cpu.model()} ]\n`;
    cap += `┃ 🔄 CPU Core : [ ${osu.cpu.count()} Core ]\n`;
    cap += `┃ ⚡ CPU Speed : [ ${cpu.speed} MHZ ]\n`;
    cap += `┃ 🌐 Platform : [ ${os.platform()} ]\n`;
    cap += `┃ 🏗️ Architecture : [ ${os.arch()} ]\n`;
    cap += `┃ 💫 OS : [ ${osu.os.platform()} ]\n`;
    cap += `┃ ⏲️ Server Time : [ ${times9} ]\n`;
    cap += `┃\n`;
    cap += `┃ 🎐 Additional Info\n`;
    cap += `┃ 📅 Day : [ ${weeks9} ]\n`;
    cap += `┃ 📆 Date : [ ${dates9} ]\n`;
    cap += `┃ 💾 Drive Total : [ ${driveTotal} GB ]\n`;
    cap += `┃ 💿 Drive Used : [ ${driveUsed} GB ]\n`;
    cap += `┃ 📊 Drive Usage : [ ${drivePer} ]\n`;
    cap += `┃\n`;
    cap += `┃ 🧩 NodeJS Memory Usage\n`;
    cap += Object.keys(used).map((key, _, arr) => `┃ ${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')} : [ ${formatp(used[key])} ]`).join('\n');
    cap += `\n┃\n`;
    cap += `┃ 🔴 CPU Information\n`;
    cap += `┃ 💽 Model : [ ${cpus[0].model.trim()} ]\n`;
    cap += `┃ ⚡ Speed : [ ${cpu.speed} MHZ ]\n`;
    cap += Object.entries(cpus[0].times).map(([a, b]) => `┃ ${a} : [ ${b} ]`).join('\n');
    cap += `\n╰━━━━━━━━━━━━━━━━━━━━━━⊱`;
    await m.reply(cap);
};

yukio.command = "ping";
yukio.alias = ["run"];
yukio.category = ["main"];

module.exports = yukio;
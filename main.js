/*
 📙Main Js Dari: Index MchaX
 👨‍💻Remake: Deku
*/
const fs = require('node:fs');

(async () => {
  const {
    default: makeWASocket,
    useMultiFileAuthState,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers,
    proto,
    makeInMemoryStore,
    DisconnectReason,
    delay,
    generateWAMessage,
    getAggregateVotesInPollMessage,
    areJidsSameUser,
  } = require("baileys");
  const pino = require("pino");
  const { Boom } = require("@hapi/boom");
  const chalk = require("chalk");
  const readline = require("node:readline");
  const simple = require("./lib/simple.js");
  const fs = require("node:fs");
  const fetch = require("node-fetch");
  const path = require("path");
  const axios = require("axios");
  const pkg = require("./package.json");
  const NodeCache = require("node-cache");
  const moment = require("moment-timezone");
  const canvafy = require("canvafy");
  const Func = require("./lib/function.js");
  const Uploader = require("./lib/uploader.js");
  const Queque = require("./lib/queque");
  const messageQueue = new Queque();
  const Database = require("./lib/database.js");
  const append = require("./lib/append");
  const serialize = require("./lib/serialize.js");
  const config = require("./settings.js");

  const appenTextMessage = async (m, sock, text, chatUpdate) => {
    let messages = await generateWAMessage(
      m.key.remoteJid,
      {
        text: text,
      },
      {
        quoted: m.quoted,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, sock.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    return sock.ev.emit("messages.upsert", msg);
  };

  const question = (text) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(text, resolve);
    });
  };
  global.db = new Database(config.database + ".json");
  await db.init();

  global.pg = new (await require(process.cwd() + "/lib/plugins"))(
    process.cwd() + "/system/plugins",
  );
  await pg.watch();

  global.scraper = new (await require(process.cwd() + "/scrapers"))(
    process.cwd() + "/scrapers/src",
  );
  await scraper.watch();

  setInterval(async () => {
    await db.save();
    await pg.load();
    await scraper.load();
  }, 2000);

  global.axios = axios;
  global.fs = fs;
  global.cheerio = require("cheerio");
  global.block_message = new Set();
  global.lastCall = new Map();
  global.groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false});
  global.pickRandom = function pickRandom(list) {
     return list[Math.floor(Math.random() * list.length)];
  };

  const store = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store",
    }),
  });
  const logger = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
  }).child({ class: "HanakoBotz" });
  logger.level = "fatal";

    console.log(chalk.blue.bold(`⣿⣿⡿⠉⢋ ⢀⡏⡀⠠⠐  ⠂⢸⢸⣿⡀  ⢰⡀ ⠂ ⠂⠈ ⢈   ⠆⡄ 
⢠⠠⠆⠈⡄ ⣾⠇⡇⠆⡓⠁  ⣿⢸⣿⣷⡀  ⣿⣆⠐⠂⠈ ⢁  ⡀ ⢰⣷⡤
⡇⠈⢇⠁⠁⢰⣿ ⡇⢀⠠⠈⠒⢤⣿⠸⣿⣿⣿⣄ ⠸⣿⣆⢯ ⠄⠐  ⢰⢸⢸⣿⣿
⡇⡆⠟ ⡆⣼⡿ ⣷⠸⡆⠆ ⢸⣿⡆⡏⠻⢿⣿⣦⡘⠬⣿⡼⣇⢀⣆⣤ ⢸⣸⡼⢿⣿
⡇⡇ ⣧⣇⣿⡇⣸⣿⡆⣿⡄⡀⠘⣿⣧⢠⣴⣾⣿⣿⠟⠓⢫⠿⢹⣼⣿⡖ ⢸⣿⣶⣆⣿
⡇⡇ ⣿⣿⣿⣧⣿⣿⣯⡜⣿⣄⡀⢿⡿⣿⠋⠁⣿⣿⣷ ⠘  ⠇⣿⣿ ⣿⣿⡆⣼⣿
⣧⣷ ⣿⣟⠙⠉⣿⣿⡍⠛⢿⡘⢿⣜⣧   ⠋ ⠁     ⠘⢹⣷⣿⡟⣴⣿⣿
⣿⣿⡄⣿⣿⠂ ⠛⠙⠃  ⡇ ⠉⠻            ⢸⣏⣤⣾⣿⣿⣿
⣿⣿⣷⣸⣿      ⠰                ⢠⡏⠉⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣄     ⢠⡀               ⡼  ⣿⢿⣟⠛
⣻⣿⣿⣿⣿⣿⡄    ⠈⠓              ⣰⠃  ⢿⣶⣷⣾
⣿⣿⣯⣿⣿⣿⣿⣆     ⢀⡠⠄⠒⠒ ⠐     ⢀⣼⡏   ⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀   ⠐⠒⠛⠉⠁    ⣠⣴⣿⣿⠁   ⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⡀      ⢀⣠⣾⣿⢿⣿⠇    ⣸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣤⣤⣴⣶⣿⣿⠟⠁⣼⡏ ⢀⣠⣶⣿⣿⣿⣿⣿
⣿⣿⡟⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃ ⢰⡿⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟  ⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏ ⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
Welcome to Script HanakoBotz / Dxyz - Lxzy`))
    console.log(chalk.blue.bold(`By: Dxyz - Lxyz`))

    console.log(chalk.yellow.bold("📁 Inisialisasi modul..."));
    console.log(chalk.cyan.bold("- API Baileys Telah Dimuat"));
    console.log(chalk.cyan.bold("- Sistem File Siap Digunakan"));
    console.log(chalk.cyan.bold("- Database Telah Diinisialisasi"));

    console.log(chalk.blue.bold("\n🤖 Info Bot:"));
    console.log(chalk.white.bold("  | GitHub: ") + chalk.cyan.bold("https://github.com/LeooxzyDekuu"));
    console.log(chalk.white.bold("  | Developer: ") + chalk.green.bold("Leooxzy/Deku"));
    console.log(chalk.white.bold("  | Base Script: ") + chalk.green.bold("AxellNetwork"));
    console.log(chalk.white.bold("  | Status Server: ") + chalk.green.bold("Online"));
    console.log(chalk.white.bold("  | Versi: ") + chalk.magenta.bold(pkg.version));
    console.log(chalk.white.bold("  | Versi Node.js: ") + chalk.magenta.bold(process.version));

    console.log(chalk.blue.bold("\n🔁 Memuat plugin dan scraper dan case..."))

  async function system() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessions);
    const sock = simple(
      {
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        cachedGroupMetadata: async (jid) => groupCache.get(jid),
        version: [2, 3000, 1019441105],
        browser: Browsers.ubuntu("Edge"),
        getMessage: async (key) => {
          const jid = jidNormalizedUser(key.remoteJid);
          const msg = await store.loadMessage(jid, key.id);
          return msg?.message || "";
        },
        shouldSyncHistoryMessage: (msg) => {
          console.log(`\x1b[32mMemuat chat [${msg.progress}%]\x1b[39m`);
          return !!msg.syncType;
        },
      },
      store,
    );
    global.hanako = sock;
    store.bind(sock.ev);
    if (!sock.authState.creds.registered) {
      console.log(
        chalk.white.bold(
          "- Silakan masukkan nomor WhatsApp Anda, misalnya 628xxxx",
        ),
      );
      const phoneNumber = await question(chalk.green.bold(`– Nomor Anda: `));
      const code = await sock.requestPairingCode(phoneNumber, "LEOODEKU");
      setTimeout(() => {
        console.log(chalk.white.bold("- Kode Pairing Anda: " + code));
      }, 3000);
    }

    //=====[ Pembaruan Koneksi ]======
        // Monitor bot health
    setInterval(() => {
        try {
            const used = process.memoryUsage()
            const cpuUsage = process.cpuUsage()
            console.log(`\n=== Bot Health Monitor ===`)
            console.log(`Memory Usage:`)
            for (let key in used) {
                console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
            }
            console.log(`CPU Usage: ${Math.round((cpuUsage.user + cpuUsage.system) / 1000000)} ms`)
            console.log(`Uptime: ${Math.floor(process.uptime() / 3600)} hours`)
            console.log(`========================\n`)
        } catch (err) {
            console.error('Monitor error:', err)
        }
    }, 1800000) // Check every 30 minutes

    sock.ev.on("connection.update", async (update) => {
            const {
                connection,
                lastDisconnect
            } = update;
            if (connection === "close") {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
                    process.exit(0)
                } else if (reason === DisconnectReason.badSession) {
                    console.log(
                        chalk.red.bold("File sesi buruk, Harap hapus sesi dan scan ulang"),
                    );
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log(
                        chalk.yellow.bold("Koneksi ditutup, sedang mencoba untuk terhubung kembali..."),
                    );
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log(
                        chalk.yellow.bold("Koneksi hilang, mencoba untuk terhubung kembali..."),
                    );
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionReplaced) {

                    console.log(
                        chalk.green.bold("Koneksi diganti, sesi lain telah dibuka. Harap tutup sesi yang sedang berjalan."),
                    );
                    sock.logout();
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(
                        chalk.green.bold("Perangkat logout, harap scan ulang."),
                    );
                    sock.logout();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log(chalk.green.bold("Restart diperlukan, sedang memulai ulang..."));
                    system();
                } else if (reason === DisconnectReason.timedOut) {
                    console.log(
                        chalk.green.bold("Koneksi waktu habis, sedang mencoba untuk terhubung kembali..."),
                    );
                    process.exit(0)
                }
            } else if (connection === "connecting") {
                console.log(chalk.blue.bold("Menghubungkan ke WhatsApp..."));
            } else if (connection === "open") {
                console.log(chalk.green.bold("Bot berhasil terhubung."));
            }
        });

    //=====[ Setelah Pembaruan Koneksi ]========//
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("contacts.update", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = {
            ...(store.contacts?.[id] || {}),
            ...(contact || {}),
          };
      }
    });

    sock.ev.on("contacts.upsert", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = { ...(contact || {}), isContact: true };
      }
    });

    sock.ev.on("groups.update", async (updates) => {
      for (const update of updates) {
        const id = update.id;
        const metadata = await sock.groupMetadata[id];
        groupCache.set(id, metadata);
        if (store.groupMetadata[id]) {
          store.groupMetadata[id] = {
            ...(store.groupMetadata[id] || {}),
            ...(update || {}),
          };
        }
      }
    });

        sock.ev.on("group-participants.update", async (groupUpdate) => {
            try {
                let {
                    id,
                    participants,
                    action
                } = groupUpdate;
                let groupMetadata = await sock.groupMetadata(id);
                let totalMembers = groupMetadata.participants.length;
                const metadata = await sock.groupMetadata[id];

                for (let participant of participants) {
                    if (action === "add") {
                        // Get user avatar
                        let ppuser;
                        try {
                            ppuser = await sock.profilePictureUrl(participant, 'image')
                        } catch {
                            ppuser = 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg'
                        }

                        // Welcome message with custom canvas
                        sock.sendMessage(id, {
                            image: {
                                url: `https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(ppuser)}&background=https://i.ibb.co/4YBNyvP/images-76.jpg&description=${encodeURIComponent(`Welcome ${config.name}-Kun! Selamat bergabung di grup kami~`)}`
                            },
                            caption: `╔═══《 *WELCOME* 》═══⊱
║ *Yokoso!* 🌸 @${participant.split("@")[0]}
╟── *Group Info:*
║ ⌬ *Nama:* ${groupMetadata.subject}
║ ⌬ *Member:* ${groupMetadata.participants.length}
║ ⌬ *Admin:* ${groupMetadata.participants.filter(p => p.admin).length}
║ ⌬ *Owner:* @${groupMetadata.owner.split("@")[0]}
╟── *Time Info:*
║ ⌬ *Tanggal:* ${moment().tz('Asia/Jakarta').format('DD/MMM/YYYY')}
║ ⌬ *Waktu:* ${moment().tz('Asia/Jakarta').format('hh:mm')} ${moment().tz('Asia/Jakarta').format('a')}
║ ⌬ *Periode:* ${moment().tz('Asia/Jakarta').hour() < 4 ? "🌌 Dini Hari" : moment().tz('Asia/Jakarta').hour() < 11 ? "🌅 Pagi" : moment().tz('Asia/Jakarta').hour() < 15 ? "☀️ Siang" : moment().tz('Asia/Jakarta').hour() < 19 ? "🌅 Sore" : "🌙 Malam"}
╚════《 *WELCOME* 》════⊱

📚 Jangan lupa baca rules ya~
🎮 Ketik .menu untuk melihat fitur bot`,
                            footer: `${config.name} • ${config.ownername}`,
                            buttons: [{
                                buttonId: ".menu list",
                                buttonText: {
                                    displayText: '📋 List Menu'
                                }
                            },
                            {
                                buttonId: ".help",
                                buttonText: {
                                    displayText: '❓ Help'
                                }
                            }],
                            viewOnce: true,
                            headerType: 6,
                            contextInfo: {
                                mentionedJid: [participant],
                                isForwarded: !0,
                                forwardingScore: 127,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: config.saluran,
                                    newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                    serverMessageId: -1
                                },
                            }
                        });
                    } else if (action === "remove") {
                        // Get user avatar
                        let ppuser;
                        try {
                            ppuser = await sock.profilePictureUrl(participant, 'image')
                        } catch {
                            ppuser = 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg'
                        }

                        // Goodbye message with custom canvas
                        sock.sendMessage(id, {
                            image: {
                                url: `https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(ppuser)}&background=https://i.ibb.co/4YBNyvP/images-76.jpg&description=${encodeURIComponent(`Sayonara ${config.name}-Kun! Semoga bertemu lagi~`)}`
                            },
                            caption: `╔═══《 *GOODBYE* 》═══⊱
║ *Sayonara* 👋 @${participant.split("@")[0]}
╟── *Group Info:*
║ ⌬ *Nama:* ${groupMetadata.subject}
║ ⌬ *Member:* ${groupMetadata.participants.length}
║ ⌬ *Admin:* ${groupMetadata.participants.filter(p => p.admin).length}
║ ⌬ *Owner:* @${groupMetadata.owner.split("@")[0]}
╟── *Time Info:*
║ ⌬ *Tanggal:* ${moment().tz('Asia/Jakarta').format('DD/MMM/YYYY')}
║ ⌬ *Waktu:* ${moment().tz('Asia/Jakarta').format('hh:mm')} ${moment().tz('Asia/Jakarta').format('a')}
║ ⌬ *Periode:* ${moment().tz('Asia/Jakarta').hour() < 4 ? "🌌 Dini Hari" : moment().tz('Asia/Jakarta').hour() < 11 ? "🌅 Pagi" : moment().tz('Asia/Jakarta').hour() < 15 ? "☀️ Siang" : moment().tz('Asia/Jakarta').hour() < 19 ? "🌅 Sore" : "🌙 Malam"}
╚════《 *GOODBYE* 》════⊱

Semoga kita bisa bertemu lagi di lain waktu~`,
                            footer: `${config.name} • ${config.ownername}`,
                            buttons: [{
                                buttonId: ".menu list",
                                buttonText: {
                                    displayText: '📋 List Menu'
                                }
                            },
                            {
                                buttonId: ".help",
                                buttonText: {
                                    displayText: '❓ Help'
                                }
                            }],
                            viewOnce: true,
                            headerType: 6,
                            contextInfo: {
                                mentionedJid: [participant],
                                isForwarded: !0,
                                forwardingScore: 127,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: config.saluran,
                                    newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                    serverMessageId: -1
                                },
                            }
                        });
                    }
                }
              groupCache.set(id, metadata);
            } catch (err) {
                console.log(err);
            }
        });

    sock.ev.on('presence.update', (m) => {
       if (!m) return
       const { id, presences } = m;
       if (id.endsWith('g.us')) {
          for (let jid in presences) {
             if (!presences[jid] || jid == sock.decodeJid(sock.user.id)) continue
             if ((presences[jid].lastKnownPresence === 'composing' || presences[jid].lastKnownPresence === 'recording') && global.db && db.list().user && db.list().user[jid] && db.list().user[jid].afk.afkTime > -1) {
                sock.sendMessage(id, { text: `Sistem mendeteksi aktivitas dari @${jid.replace(/@.+/, '')} setelah offline selama: ${Func.texted('bold', Func.toTime(new Date - db.list().user[jid].afk.afkTime))}\n\n➠ ${Func.texted('bold', 'Reason:')} ${db.list().user[jid].afk.afkReason ? db.list().user[jid].afk.afkReason : '-'}`, mentions: [jid] }, { quoted: db.list().user[jid].afk.afkObj });
                db.list().user[jid].afk.afkTime = -1
                db.list().user[jid].afk.afkReason = ''
                db.list().user[jid].afk.afkObj = {}
             }
          }
       } else { }
    });

    async function getMessage(key) {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg;
      }
      return {
        conversation: "NekoBot",
      };
    }

    sock.ev.on("call", async (calls) => {
      if (!db.list().settings.anticall) return;
      for (const call of calls) {
        if (!call.id || !call.from) continue;

        let lastTime = lastCall.get(call.from);
        let now = Date.now();

        if (!lastTime || now - lastTime > 5000) {
          lastCall.set(call.from, now);
          await sock.rejectCall(call.id, call.from);
          await sock.sendMessage(call.from, {
            text: "> 🚫 *Mohon maaf*... Kami tidak bisa menerima telepon dari Anda, anti call aktif!",
            mentions: [call.from],
          });
        }
      }
    })

    sock.ev.on("messages.upsert", async (cht) => {
        if (cht.messages.length === 0) return;  
        const chatUpdate = cht.messages[0];
        if (!chatUpdate.message) return;    
        const userId = chatUpdate.key.id;
        global.m = await serialize(chatUpdate, sock, store)
        if (m.isBot) {
            if (block_message.has(userId)) return;
            block_message.add(userId);
            setTimeout(() => block_message.delete(userId), 5 * 60 * 1000);
        }
        require("./lib/logger.js")(m);
        await require("./system/handler.js")(m, sock, store);
    });

    // Watch for file changes
const pluginsDir = './system/plugins';
fs.watch(pluginsDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.js')) {
        const filePath = path.join(pluginsDir, filename);
        if (require.cache[require.resolve(filePath)]) {
            delete require.cache[require.resolve(filePath)];
            console.log(chalk.green.bold(`🔄 Plugin ${filename} telah diperbarui!`));
        }
    }
});

// Watch main.js
let mainFile = require.resolve(__filename);
fs.watch(mainFile, (eventType, filename) => {
    if (eventType === "change") {
        delete require.cache[mainFile];
        console.log(chalk.green.bold('🔄 Main file updated, reloading...'));
        process.send('reset');
    }
});

sock.ev.on("messages.update", async (chatUpdate) => {
      for (const { key, update } of chatUpdate) {
        if (update.pollUpdates && key.fromMe) {
          const pollCreation = await getMessage(key);
          if (pollCreation) {
            let pollUpdate = await getAggregateVotesInPollMessage({
              message: pollCreation?.message,
              pollUpdates: update.pollUpdates,
            });
            let toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]
              ?.name;
            console.log(toCmd);
            await appenTextMessage(m, sock, toCmd, pollCreation);
            await sock.sendMessage(m.cht, { delete: key });
          } else return false;
          return;
        }
      }
    });
    return sock;
  }
  system();
})();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
   delete require.cache[file];
});
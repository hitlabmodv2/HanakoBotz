async function events(m, { config }) {
    const Func = require(process.cwd() + '/lib/function')
    if (m.body.match('halo') || m.body.match('Halo') || m.body.match('hai') || m.body.match('Hai') || m.body.match('halow') || m.body.match('Halow')) {
        m.reply({
            text: 'halooow :3',
            contextInfo: {
                isForwarded: true,
                forwardingScore: 99999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    serverMessageId: -1,
                    newsletterName: `${Func.Styles(`Sc: ${config.name} By: ${config.ownername}`)}`
                }
            }
        })
    }
}

module.exports = {
    events
}

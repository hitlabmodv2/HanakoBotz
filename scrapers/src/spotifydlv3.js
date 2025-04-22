// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz

const axios = require('axios')

async function isUrl(url) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let result = url.match(urlRegex);
    return result;
}

async function spotifydl(url) {
    if (isUrl(url)) {
        if (!/https:\/\/open\.spotify\.com\/track\//.test(url)) return 'Error Salah Link Lu Bg'
        try {
            const match = url.match(/\/track\/([a-zA-Z0-9]+)/);

            let regex;
            if (match) {
                regex = match[1];
            } else {
                throw new Error("URL tidak valid atau bukan link Spotify track.");
            }

            const {
                data
            } = await axios.get(`https://spotisongdownloader.vercel.app/${regex}`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            return data;
        } catch (err) {
            console.log('Maaf Error: ' + err);
            return err;
        }
    }
}

module.exports = spotifydl

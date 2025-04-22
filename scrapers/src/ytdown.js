/**
 * Created By Lang
 * Yt Down Scraper With Quality
 * package: axios
 * 
 * @function ytdl(url)
 */

const axios = require('axios')

const headers = {
    "content-type": "application/json",
    "origin": "https://www.grabtheclip.com",
    "referer": "https://www.grabtheclip.com/",
    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
}

async function ytdl(url, type = "mp4", height = 360) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    
    await delay(2000)
    let reqInfo = await axios.post('https://api.grabtheclip.com/submit-info', {
        url
    }, {
        headers
    })

    let info = await axios.get(`https://api.grabtheclip.com/get-info/${reqInfo.data.task_id}`, {
        headers
    })

    while (info.data.status == "Pending") {
        info = await axios.get(`https://api.grabtheclip.com/get-info/${reqInfo.data.task_id}`, {
            headers
        })
    }
    if (type === "mp4") {
        let reqDown = await axios.post('https://api.grabtheclip.com/submit-download', {
            height,
            media_type: "video",
            url
        }, {
            headers
        })

        let down = await axios.get(`https://api.grabtheclip.com/get-download/${reqDown.data.task_id}`, {
            headers
        })

        while (down.data.status == "Pending") {
            await delay(2000)
            down = await axios.get(`https://api.grabtheclip.com/get-download/${reqDown.data.task_id}`, {
                headers
            })
        }

        return {
            status: 200,
            type: type,
            metadata: info.data.result,
            result: down.data.result.url
        }
    } else if (type === "mp3") {
        let reqDown = await axios.post('https://api.grabtheclip.com/submit-download', {
            height: 0,
            media_type: "audio",
            url
        }, {
            headers
        })

        let down = await axios.get(`https://api.grabtheclip.com/get-download/${reqDown.data.task_id}`, {
            headers
        })

        while (down.data.status == "Pending") {
            await delay(2000)
            down = await axios.get(`https://api.grabtheclip.com/get-download/${reqDown.data.task_id}`, {
                headers
            })
        }

        return {
            status: 200,
            type: type,
            metadata: info.data.result,
            result: down.data.result.url
        }
    }
}

module.exports = ytdl;

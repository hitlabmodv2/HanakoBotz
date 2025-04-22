/*
⬇️ *Mediafire Download (Fixed)*
👤 by Rynn
> *Info*: Get file info and download link
> *Code*: 
*/

const { fetch } = require("undici");
const cheerio = require("cheerio");
const { lookup } = require("mime-types");

async function MediaFire(url, retries = 5, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const allOriginsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await fetch(allOriginsUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.178 Safari/537.36"
                }
            });

            if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

            const data = await response.text();
            const $ = cheerio.load(data);

            const filename = $(".dl-btn-label").attr("title");
            const ext = filename.split(".").pop();
            const mimetype = lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();
            const size = $(".input.popsok").text().trim().match(/\(([^)]+)\)/)[1];
            const downloadUrl = ($("#downloadButton").attr("href") || "").trim();
            const alternativeUrl = ($("#download_link > a.retry").attr("href") || "").trim();

            return {
                filename,
                size,
                mimetype,
                link: downloadUrl || alternativeUrl,
                alternativeUrl: alternativeUrl,
            };
        } catch (error) {
            console.error(`Attempt ${attempt} failed: ${error.message}`);

            if (attempt < retries) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw new Error("Failed to fetch data after multiple attempts");
            }
        }
    }
}

module.exports = MediaFire;

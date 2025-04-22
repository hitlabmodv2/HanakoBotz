const axios = require('axios');
const cheerio = require('cheerio');

// IF USED ESM
// import axios from 'axios';
// import * as cheerio from 'cheerio';

/**
 * Class untuk menangani operasi pencarian dan pengambilan detail Bandcamp
 * By NDBOTZ : https://whatsapp.com/channel/0029VaAMjXT4yltWm1NBJV3J
 */

class BandcampAPI {
  /**
   * Mencari konten di Bandcamp menggunakan API pencarian
   * 
   * @async
   * @param {string} query - Istilah pencarian yang akan dicari
   * @returns {Promise<Object>} Objek yang berisi hasil pencarian
   * @property {boolean} status - Menunjukkan apakah pencarian berhasil
   * @property {Array} [data] - Array hasil pencarian (if status is true)
   */
  search = async function(query) {
    try {
      let response = await axios.post("https://goudmsc.bandcamp.com/api/bcsearch_public_api/1/autocomplete_elastic", {
        "search_text": query,
        "search_filter": "",
        "full_page": false,
        "fan_id": null
      });
 
      const res = response.data.auto.results.map(it => ({
        name: it.name,
        artist: it.band_name,
        location: it.location || 'Unknown',
        genre: it.genre_name || 'Unknown',
        tag: it.tag_names,
        url: it.item_url_path,
        img: it.img
      }));

      return { status: true, data: res };
    } catch(e) {
      return { status: false, msg: `Terjadi eror, dengan pesan: ${e.message}` };
    }
  }

  /**
   * Mendapatkan informasi tentang URL Bandcamp dan mendapatkan track
   * 
   * @async
   * @param {string} url - URL Bandcamp untuk mengambil detail
   * @returns {Promise<Object>} Informasi terperinci tentang konten Bandcamp
   * @property {boolean} status - Menunjukkan apakah pengambilan detail berhasil
   * @property {string} [image] - URL gambar konten
   * @property {string} [keyword] - Kata kunci yang terkait dengan konten
   * @property {Object} [info] - Informasi lagu atau album saat ini
   * @property {Array} [track] - Daftar track
   * @property {string} [mess] - Pesan kesalahan jika statusnya false
   */
 detail = async function(url) {
    try {
      let a = await axios.get(url);
      let $ = cheerio.load(a.data);

      let ind = JSON.parse($('script[crossorigin="anonymous"][data-tralbum]').attr('data-tralbum'));
      let inp = JSON.parse($('script[type="application/ld+json"]').text());

      let akhir = {
        status: true,
        image: inp.image,
        keyword: inp.keywords,
        info: ind.current,
        track: ind.trackinfo
      };
      return akhir;
    } catch(e) {
      return { status: false, msg: `Tidak dapat menemukan data` };
    }
  }
}

module.exports = new BandcampAPI();

// IF USED ESM
/*
const bandcampAPI = new BandcampAPI();
export { bandcampAPI };
*/

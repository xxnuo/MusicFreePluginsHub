"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
async function search(query, page, type) {
    if (type !== 'lyric') {
        return;
    }
    const result = (await axios_1.default.get('https://zh.followlyrics.com/search', {
        params: {
            name: query,
            type: 'song'
        }
    })).data;
    const $ = (0, cheerio_1.load)(result);
    const results = $('.table.table-striped > tbody');
    const items = results.children('tr');
    const data = items.map((index, el) => {
        const tds = $(el).children();
        const title = $(tds.get(0)).text().trim();
        const artist = $(tds.get(1)).text().trim();
        const album = $(tds.get(2)).text().trim();
        const id = $(tds.get(3)).children('a').attr('href');
        return {
            title,
            artist,
            album,
            id
        };
    }).toArray();
    return {
        isEnd: true,
        data
    };
}
async function getLyric(musicItem) {
    const res = (await axios_1.default.get(musicItem.id)).data;
    const $ = (0, cheerio_1.load)(res);
    const rawLrc = $('div#lyrics').text().replace(/\n/g, '');
    return {
        rawLrc: rawLrc,
    };
}
module.exports = {
    platform: "歌词网",
    version: "0.0.0",
    srcUrl: 'https://musicfreepluginshub.2020818.xyz/b73a9bcf4c2e7a67a3992ac5a32f85f0.js',
    cacheControl: "no-store",
    supportedSearchType: ['lyric'],
    search,
    getLyric
};

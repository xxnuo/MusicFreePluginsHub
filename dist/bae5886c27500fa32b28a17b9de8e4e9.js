"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
async function search(query, page, type) {
    if (type !== 'lyric') {
        return;
    }
    const result = (await axios_1.default.get('https://so.lrcgc.com/', {
        params: {
            q: query,
        }
    })).data;
    const $ = (0, cheerio_1.load)(result);
    const results = $('.resultWrap').children();
    const data = [];
    if (results.first().prop('tagName') === 'DL') {
        const title = results.first().find('dt > a');
        const desc = results.first().find('dd > small');
        const descText = desc.text().replace(/[\s|\n]/g, '').split(/[歌手：|专辑:]/).filter(it => it.trim() !== '');
        data.push({
            title: title.text(),
            id: title.attr('href'),
            artist: descText === null || descText === void 0 ? void 0 : descText[0],
            album: descText === null || descText === void 0 ? void 0 : descText[1]
        });
    }
    return {
        isEnd: true,
        data
    };
}
async function getLyric(musicItem) {
    const res = (await axios_1.default.get(musicItem.id)).data;
    const $ = (0, cheerio_1.load)(res);
    const rawLrc = $('p#J_lyric').text().replace(/\n/g, '');
    return {
        rawLrc: rawLrc,
    };
}
module.exports = {
    platform: "歌词千寻",
    version: "0.0.0",
    srcUrl: 'https://musicfreepluginshub.2020818.xyz/bae5886c27500fa32b28a17b9de8e4e9.js',
    cacheControl: "no-store",
    supportedSearchType: ['lyric'],
    search,
    getLyric
};

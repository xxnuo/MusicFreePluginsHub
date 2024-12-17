"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
async function parseMusicItemFromUrl(shareUrl) {
    const html = (await axios_1.default.get(shareUrl)).data;
    const $ = (0, cheerio_1.load)(html);
    const script = $("script:contains('window.__DATA__')").text();
    const jsonStr = script.match(/window\.__DATA__ \=(.+);\s*$/);
    if (jsonStr) {
        const result = JSON.parse(jsonStr[1]);
        const musicItem = {
            id: result.detail.ksong_mid,
            shareid: result.shareid,
            lrc: result.lyric,
            artwork: result.detail.cover,
            title: result.detail.song_name,
            artist: `${result.detail.nick} (原唱: ${result.detail.singer_name})`,
            album: result.detail.content,
            url: result.detail.playurl,
            detail: result.detail,
        };
        return musicItem;
    }
}
module.exports = {
    platform: "全民K歌",
    version: "0.1.0",
    order: 12,
    srcUrl: "http://adad23u.appinstall.life/dist/qmkg/index.js",
    cacheControl: "no-store",
    async getMediaSource(musicItem) {
        if (musicItem.shareid) {
            const newItem = await parseMusicItemFromUrl(`https://kg.qq.com/node/play?s=${musicItem.shareid}`);
            return {
                url: newItem.url,
            };
        }
        return {
            url: musicItem.url,
        };
    },
    async importMusicItem(shareUrl) {
        return parseMusicItemFromUrl(shareUrl);
    },
    hints: {
        importMusicItem: [
            '全民K歌APP: 分享-复制链接，直接粘贴即可',
        ]
    },
};

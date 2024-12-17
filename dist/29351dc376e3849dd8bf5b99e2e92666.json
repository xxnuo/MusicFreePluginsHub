"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const pageNum = 20;
function formatMusicItem(item) {
    var _a, _b, _c, _d;
    return {
        id: item.id,
        title: item.title,
        artist: (item === null || item === void 0 ? void 0 : item.allArtistNames) ||
            ((_b = (_a = item.artists) === null || _a === void 0 ? void 0 : _a.map) === null || _b === void 0 ? void 0 : _b.call(_a, (s) => s.name).join(", ")) ||
            ((_c = item.user) === null || _c === void 0 ? void 0 : _c.niceName),
        artwork: item === null || item === void 0 ? void 0 : item.headImg,
        urls: (_d = item === null || item === void 0 ? void 0 : item.fullClip) === null || _d === void 0 ? void 0 : _d.urls,
    };
}
function formatArtistItem(item) {
    return {
        id: item.id,
        name: item.name,
        avatar: item.headImg,
    };
}
let lastQuery;
let lastMusicId;
async function searchMusic(query, page) {
    if (query !== lastQuery || page === 1) {
        lastMusicId = 0;
    }
    lastQuery = query;
    let data = JSON.stringify({
        searchType: "MV",
        key: query,
        sinceId: lastMusicId,
        size: pageNum,
        requestTagRows: [
            {
                key: "sortType",
                chosenTags: ["HOTTEST"],
            },
            {
                key: "source",
                chosenTags: ["-1"],
            },
            {
                key: "duration",
                chosenTags: ["-1"],
            },
        ],
    });
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://search-api.yinyuetai.com/search/get_search_result.json",
        headers: {
            referrer: "https://www.yinyuetai.com/",
            accept: "application/json",
            "content-type": "application/json",
            wua: "YYT/1.0.0 (WEB;web;11;zh-CN;kADiV2jNJFy2ryvuyB5Ne)",
        },
        data: data,
    };
    const response = (await axios_1.default.request(config)).data.data;
    lastMusicId = response[response.length - 1].id;
    return {
        isEnd: pageNum > response.length,
        data: response.map(formatMusicItem),
    };
}
async function search(query, page, type) {
    if (type === "music") {
        return await searchMusic(query, page);
    }
}
async function getMediaSource(musicItem, quality) {
    let url;
    if (quality === "standard") {
        url = musicItem.urls.find((it) => it.streamType === 5).url;
    }
    else if (quality === "high") {
        url = musicItem.urls.find((it) => it.streamType === 1).url;
    }
    return {
        url,
    };
}
module.exports = {
    platform: "音悦台",
    author: '猫头猫',
    version: "0.0.1",
    supportedSearchType: ["music"],
    srcUrl: "https://gitee.com/maotoumao/MusicFreePlugins/raw/v0.1/dist/yinyuetai/index.js",
    cacheControl: "no-cache",
    search,
    getMediaSource,
};

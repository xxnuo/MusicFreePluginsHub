"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61",
    host: "studio-api.suno.ai"
};
async function getTopLists() {
    return [
        {
            title: "趋势榜",
            data: [
                {
                    id: "1190bf92-10dc-4ce5-968a-7a377f37f984",
                    title: "趋势榜 - 最近一天",
                },
                {
                    id: "08a079b2-a63b-4f9c-9f29-de3c1864ddef",
                    title: "趋势榜 - 最近一周",
                },
                {
                    id: "845539aa-2a39-4cf5-b4ae-16d3fe159a77",
                    title: "趋势榜 - 最近一月",
                },
                {
                    id: "6943c7ee-cbc5-4f72-bc4e-f3371a8be9d5",
                    title: "趋势榜 - 全部时间",
                },
            ],
        },
        {
            title: "最新榜",
            data: [
                {
                    id: "cc14084a-2622-4c4b-8258-1f6b4b4f54b3",
                    title: "最新榜",
                },
            ],
        },
        {
            title: "其他类别",
            data: [
                {
                    id: "1ac7823f-8faf-474f-b14c-e4f7c7bb373f",
                    title: "动物开会",
                },
                {
                    id: '6713d315-3541-460d-8788-162cce241336',
                    title: 'Lo-Fi'
                }
            ],
        },
    ];
}
async function getTopListDetail(topListItem) {
    const result = (await axios_1.default.get(`https://studio-api.suno.ai/api/playlist/${topListItem.id}/?page=0`, {
        headers
    })).data;
    return {
        isEnd: true,
        musicList: result.playlist_clips.map(it => {
            var _a, _b;
            const clip = it.clip;
            return {
                id: clip.id,
                url: clip.audio_url,
                artwork: clip.image_large_url || clip.image_url,
                duration: (_a = clip.metadata) === null || _a === void 0 ? void 0 : _a.duration,
                title: clip.title,
                artist: clip.display_name,
                userId: clip.user_id,
                rawLrc: (_b = clip.metadata) === null || _b === void 0 ? void 0 : _b.prompt
            };
        })
    };
}
async function getLyric(musicItem) {
    return {
        rawLrc: musicItem.rawLrc
    };
}
module.exports = {
    platform: "suno",
    version: "0.0.0",
    srcUrl: "https://gitee.com/maotoumao/MusicFreePlugins/raw/v0.1/dist/suno/index.js",
    cacheControl: "no-cache",
    getTopLists,
    getTopListDetail,
    getLyric
};
getTopListDetail({
    id: "1ac7823f-8faf-474f-b14c-e4f7c7bb373f",
    title: "最新榜",
}).then(e => console.log(e.musicList[0]));

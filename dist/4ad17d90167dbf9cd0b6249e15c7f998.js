"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61",
};
function formatMusicItem(it) {
    return {
        id: it.id,
        artist: it.artist,
        title: it.title,
        createdAt: it.created_at,
        artwork: it.image_path,
        url: it.song_path,
        duration: it.duration,
        mv: it.video_path,
        rawLrc: it.lyrics,
    };
}
async function searchMusic(query, page) {
    const pageSize = 30;
    const data = `{"searchQuery":{"sort":"plays","searchTerm":"${query}"},"pageParam":${page - 1},"pageSize":${pageSize},"trendingId":"93de406e-bdc1-40a6-befd-90637a362158"}`;
    const config = {
        method: "post",
        url: "https://www.udio.com/api/songs/search",
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.0.0",
            host: "www.udio.com",
        },
        data: data,
    };
    const result = (await (0, axios_1.default)(config)).data.data;
    return {
        isEnd: result.length < pageSize,
        data: result.map(formatMusicItem),
    };
}
async function search(query, page, type) {
    if (type === "music") {
        return await searchMusic(query, page);
    }
}
async function getMediaSource(musicItem, quality) {
    if (quality !== "standard") {
        return;
    }
    return musicItem.url;
}
async function getTopLists() {
    return [
        {
            title: "趋势榜",
            data: [
                {
                    id: "today",
                    maxAgeInHours: 24,
                    type: "search",
                    title: "趋势榜 - 最近一天",
                },
                {
                    id: "1week",
                    maxAgeInHours: 168,
                    type: "search",
                    title: "趋势榜 - 最近一周",
                },
                {
                    id: "1month",
                    maxAgeInHours: 720,
                    type: "search",
                    title: "趋势榜 - 最近一月",
                },
                {
                    id: "alltime",
                    type: "search",
                    title: "趋势榜 - 全部时间",
                },
            ],
        },
        {
            title: "流派榜单",
            data: [
                {
                    id: "89f0089f-1bfe-4713-8070-5830a6161afb",
                    type: "playlist",
                    title: "爵士",
                },
                {
                    id: "935deb12-dc32-4005-a1fe-3c00c284ca52",
                    type: "playlist",
                    title: "乡村",
                },
                {
                    id: "6028ad08-68cb-406d-aa35-a4917b6467d6",
                    type: "playlist",
                    title: "流行",
                },
                {
                    id: "d033aa6e-655e-45d0-8138-dc9a0dc6b3a6",
                    type: "playlist",
                    title: "摇滚",
                },
            ],
        },
    ];
}
async function getTopListDetail(topListItem) {
    if (topListItem.type === "playlist") {
        const res = (await axios_1.default.get(`https://www.udio.com/api/playlists?id=${topListItem.id}`, {
            headers,
        })).data;
        const songList = res.playlists[0].song_list.join(",");
        const songs = (await axios_1.default.get(`https://www.udio.com/api/songs?songIds=${songList}`, {
            headers,
        })).data.songs;
        return {
            isEnd: true,
            musicList: songs.map(formatMusicItem),
        };
    }
    else if (topListItem.type === "search") {
        const pageSize = 30;
        const data = `{"searchQuery":{"sort":"plays","searchTerm":""${topListItem.maxAgeInHours
            ? `,"maxAgeInHours": ${topListItem.maxAgeInHours}`
            : ""}},"pageParam":0,"pageSize":${pageSize}}`;
        const config = {
            method: "post",
            url: "https://www.udio.com/api/songs/search",
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.0.0",
                host: "www.udio.com",
            },
            data: data,
        };
        const songs = (await (0, axios_1.default)(config)).data.data;
        return {
            isEnd: true,
            musicList: songs.map(formatMusicItem),
        };
    }
}
async function getLyric(musicItem) {
    return {
        rawLrc: musicItem.rawLrc
    };
}
module.exports = {
    platform: "udio",
    author: "猫头猫",
    version: "0.0.0",
    supportedSearchType: ["music"],
    srcUrl: "https://gitee.com/maotoumao/MusicFreePlugins/raw/v0.1/dist/udio/index.js",
    cacheControl: "no-cache",
    search,
    getMediaSource,
    getTopListDetail,
    getTopLists,
    getLyric
};

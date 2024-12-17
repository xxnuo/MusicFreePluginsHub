"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dayjs = require("dayjs");
const CryptoJs = require("crypto-js");
const pageSize = 20;
const secret = "0b50b02fd0d73a9c4c8c3a781c30845f";
function getSignedParams(e) {
    if ("[object Object]" !== Object.prototype.toString.call(e))
        throw new Error("The parameter of query must be a Object.");
    var t = Math.floor(Date.now() / 1e3);
    Object.assign(e, {
        timestamp: t,
    });
    var n = Object.keys(e);
    n.sort();
    for (var r = "", i = 0; i < n.length; i++) {
        var s = n[i];
        r += (0 == i ? "" : "&") + s + "=" + e[s];
    }
    return {
        ...e,
        sign: CryptoJs.MD5((r += secret)).toString(),
        timestamp: t,
    };
}
const searchHeaders = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    referer: "https://music.91q.com/",
    from: "web",
    accept: "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "zh-CN,zh;q=0.9",
};
function formatMusicItem(_) {
    return {
        id: _.id || _.assetId,
        artwork: _.pic,
        title: _.title,
        artist: (_.artist || []).map((ar) => ar.name).join("、"),
        artistItems: (_.artist || []).map(formatArtistItem),
        album: _.albumTitle,
        lrc: _.lyric,
    };
}
function formatAlbumItem(_) {
    return {
        id: _.albumAssetCode,
        artist: (_.artist || []).map((ar) => ar.name).join("、"),
        title: _.title,
        artwork: _.pic,
        description: "",
        date: dayjs(_.releaseDate).format("YYYY-MM-DD"),
    };
}
function formatArtistItem(_) {
    return {
        name: _.name,
        id: _.artistCode,
        avatar: _.pic,
        worksNum: _.trackTotal,
        description: _.introduce,
    };
}
function musicCanPlayFilter(_) {
    return !_.isVip;
}
async function searchBase(query, page, type) {
    const res = await axios_1.default.get("https://music.91q.com/v1/search", {
        headers: searchHeaders,
        params: getSignedParams({
            appid: "16073360",
            type,
            word: query,
            pageNo: page,
            pageSize,
        }),
    });
    return res.data;
}
async function searchMusic(query, page) {
    const res = await searchBase(query, page, 1);
    return {
        isEnd: res.data.total <= page * pageSize,
        data: res.data.typeTrack.filter(musicCanPlayFilter).map(formatMusicItem),
    };
}
async function searchAlbum(query, page) {
    const res = await searchBase(query, page, 3);
    return {
        isEnd: res.data.total <= page * pageSize,
        data: res.data.typeAlbum.map(formatAlbumItem),
    };
}
async function searchArtist(query, page) {
    const res = await searchBase(query, page, 2);
    return {
        isEnd: res.data.total <= page * pageSize,
        data: res.data.typeArtist.map(formatArtistItem),
    };
}
async function getArtistMusicWorks(artistItem, page) {
    const headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
        referer: `https://music.91q.com/search?word=${encodeURIComponent(artistItem.name)}`,
        from: "web",
        accept: "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
    };
    const res = (await axios_1.default.get("https://music.91q.com/v1/artist/song", {
        headers,
        params: getSignedParams({
            appid: "16073360",
            artistCode: artistItem.id,
            pageNo: page,
            pageSize,
        }),
    })).data;
    return {
        isEnd: res.data.total <= page * pageSize,
        data: res.data.result.filter(musicCanPlayFilter).map(formatMusicItem),
    };
}
async function getArtistAlbumWorks(artistItem, page) {
    const headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
        referer: `https://music.91q.com/search?word=${encodeURIComponent(artistItem.name)}`,
        from: "web",
        accept: "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
    };
    const res = (await axios_1.default.get("https://music.91q.com/v1/artist/album", {
        headers,
        params: getSignedParams({
            appid: "16073360",
            artistCode: artistItem.id,
            pageNo: page,
            pageSize,
        }),
    })).data;
    return {
        isEnd: res.data.total <= page * pageSize,
        data: res.data.result.map(formatAlbumItem),
    };
}
async function getArtistWorks(artistItem, page, type) {
    if (type === "music") {
        return getArtistMusicWorks(artistItem, page);
    }
    else if (type === "album") {
        return getArtistAlbumWorks(artistItem, page);
    }
}
async function getLyric(musicItem) {
    return {
        lrc: musicItem.lrc,
    };
}
async function getAlbumInfo(albumItem) {
    if (albumItem.musicList) {
        return albumItem;
    }
    else {
        const headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
            referer: `https://music.91q.com/search?word=${encodeURIComponent(albumItem.name)}`,
            from: "web",
            accept: "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
        };
        const res = await axios_1.default.get("https://music.91q.com/v1/album/info", {
            headers,
            params: getSignedParams({
                appid: "16073360",
                albumAssetCode: albumItem.id,
            }),
        });
        const musicList = (res.data.data.trackList || [])
            .filter(musicCanPlayFilter)
            .map((_) => ({
            ...formatMusicItem(_),
            artwork: albumItem.artwork,
            album: albumItem.name,
        }));
        return {
            musicList,
        };
    }
}
async function getTopLists() {
    const rawHtml = (await axios_1.default.get('https://music.91q.com/toplist', {
        headers: {
            referer: 'https://m.baidu.com/',
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        }
    })).data;
    const funcString = rawHtml.match(/<script>\s*window\.__NUXT__\s*=\s*(.+?)<\/script>/)?.[1];
    const result = Function(`return ${funcString};`)();
    return [{
            title: '排行榜',
            data: result.data[0].pageData.map(_ => ({
                title: _.title,
                id: _.bdid,
                coverImg: _.pic
            }))
        }];
}
async function getTopListDetail(topListItem) {
    const headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
        referer: `https://music.91q.com/toplist`,
        from: "web",
        accept: "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
    };
    const res = await axios_1.default.get("https://music.91q.com/v1/bd/list", {
        headers,
        params: getSignedParams({
            bdid: topListItem.id,
            appid: "16073360"
        }),
    });
    return {
        ...topListItem,
        musicList: res.data.data.result.filter(musicCanPlayFilter).map(formatMusicItem)
    };
}
module.exports = {
    platform: "千千音乐",
    version: "0.1.1",
    order: 13,
    srcUrl: "http://adad23u.appinstall.life/dist/qianqian/index.js",
    cacheControl: "no-cache",
    async search(query, page, type) {
        if (type === "music") {
            return await searchMusic(query, page);
        }
        if (type === "album") {
            return await searchAlbum(query, page);
        }
        if (type === "artist") {
            return await searchArtist(query, page);
        }
    },
    async getMediaSource(musicItem, quality) {
        if (quality !== 'standard') {
            return;
        }
        const headers = {
            "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
            referer: `https://music.91q.com/artist/${(musicItem.artistItems[0] || {}).id}`,
            from: "webapp_music",
            accept: "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9",
        };
        const res = (await axios_1.default.get("https://music.91q.com/v1/song/tracklink", {
            headers,
            params: getSignedParams({
                appid: "16073360",
                TSID: musicItem.id,
            }),
        })).data;
        return {
            url: res.data.path,
        };
    },
    getAlbumInfo,
    getLyric,
    getArtistWorks,
    getTopLists,
    getTopListDetail
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const CryptoJs = require("crypto-js");
const qs = require("qs");
const bigInt = require("big-integer");
const dayjs = require("dayjs");
const cheerio = require("cheerio");
function a() {
    var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
    for (d = 0; 16 > d; d += 1)
        (e = Math.random() * b.length), (e = Math.floor(e)), (c += b.charAt(e));
    return c;
}
function b(a, b) {
    var c = CryptoJs.enc.Utf8.parse(b), d = CryptoJs.enc.Utf8.parse("0102030405060708"), e = CryptoJs.enc.Utf8.parse(a), f = CryptoJs.AES.encrypt(e, c, {
        iv: d,
        mode: CryptoJs.mode.CBC,
    });
    return f.toString();
}
function c(text) {
    text = text.split("").reverse().join("");
    const d = "010001";
    const e = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7";
    const hexText = text
        .split("")
        .map((_) => _.charCodeAt(0).toString(16))
        .join("");
    const res = bigInt(hexText, 16)
        .modPow(bigInt(d, 16), bigInt(e, 16))
        .toString(16);
    return Array(256 - res.length)
        .fill("0")
        .join("")
        .concat(res);
}
function getParamsAndEnc(text) {
    const first = b(text, "0CoJUm6Qyw8W8jud");
    const rand = a();
    const params = b(first, rand);
    const encSecKey = c(rand);
    return {
        params,
        encSecKey,
    };
}
function formatMusicItem(_) {
    const album = _.al || _.album;
    return {
        id: _.id,
        artwork: album.picUrl,
        title: _.name,
        artist: (_.ar || _.artists)[0].name,
        album: album.name,
        url: `https://music.163.com/song/media/outer/url?id=${_.id}.mp3`,
        qualities: {
            low: {
                size: (_.l || {}).size,
            },
            standard: {
                size: (_.m || {}).size,
            },
            high: {
                size: (_.h || {}).size,
            },
            super: {
                size: (_.sq || {}).size,
            },
        },
    };
}
function formatAlbumItem(_) {
    return {
        id: _.id,
        artist: _.artist.name,
        title: _.name,
        artwork: _.picUrl,
        description: "",
        date: dayjs.unix(_.publishTime / 1000).format("YYYY-MM-DD"),
    };
}
function musicCanPlayFilter(_) {
    return (_.fee === 0 || _.fee === 8) && _.privilege.st >= 0;
}
const pageSize = 30;
async function searchBase(query, page, type) {
    const data = {
        s: query,
        limit: pageSize,
        type: type,
        offset: (page - 1) * pageSize,
        csrf_token: "",
    };
    const pae = getParamsAndEnc(JSON.stringify(data));
    const paeData = qs.stringify(pae);
    const headers = {
        authority: "music.163.com",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
        origin: "https://music.163.com",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        referer: "https://music.163.com/search/",
        "accept-language": "zh-CN,zh;q=0.9",
    };
    const res = (await (0, axios_1.default)({
        method: "post",
        url: "https://music.163.com/weapi/cloudsearch/get/web?csrf_token=",
        headers,
        data: paeData,
    })).data;
    return res;
}
async function searchMusic(query, page) {
    const res = await searchBase(query, page, 1);
    const songs = res.result.songs
        .filter(musicCanPlayFilter)
        .map(formatMusicItem);
    return {
        isEnd: res.result.songCount <= page * pageSize,
        data: songs,
    };
}
async function searchAlbum(query, page) {
    const res = await searchBase(query, page, 10);
    const albums = res.result.albums.map(formatAlbumItem);
    return {
        isEnd: res.result.albumCount <= page * pageSize,
        data: albums,
    };
}
async function searchArtist(query, page) {
    const res = await searchBase(query, page, 100);
    const artists = res.result.artists.map((_) => ({
        name: _.name,
        id: _.id,
        avatar: _.img1v1Url,
        worksNum: _.albumSize,
    }));
    return {
        isEnd: res.result.artistCount <= page * pageSize,
        data: artists,
    };
}
async function searchMusicSheet(query, page) {
    const res = await searchBase(query, page, 1000);
    const playlists = res.result.playlists.map((_) => ({
        title: _.name,
        id: _.id,
        coverImg: _.coverImgUrl,
        artist: _.creator?.nickname,
        playCount: _.playCount,
        worksNum: _.trackCount
    }));
    return {
        isEnd: res.result.playlistCount <= page * pageSize,
        data: playlists,
    };
}
searchMusicSheet("孤勇者", 1);
async function getArtistWorks(artistItem, page, type) {
    const data = {
        csrf_token: "",
    };
    const pae = getParamsAndEnc(JSON.stringify(data));
    const paeData = qs.stringify(pae);
    const headers = {
        authority: "music.163.com",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
        origin: "https://music.163.com",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        referer: "https://music.163.com/search/",
        "accept-language": "zh-CN,zh;q=0.9",
    };
    if (type === "music") {
        const res = (await (0, axios_1.default)({
            method: "post",
            url: `https://music.163.com/weapi/v1/artist/${artistItem.id}?csrf_token=`,
            headers,
            data: paeData,
        })).data;
        return {
            isEnd: true,
            data: res.hotSongs.filter(musicCanPlayFilter).map(formatMusicItem),
        };
    }
    else if (type === "album") {
        const res = (await (0, axios_1.default)({
            method: "post",
            url: `https://music.163.com/weapi/artist/albums/${artistItem.id}?csrf_token=`,
            headers,
            data: paeData,
        })).data;
        return {
            isEnd: true,
            data: res.hotAlbums.map(formatAlbumItem),
        };
    }
}
async function getTopListDetail(topListItem) {
    const musicList = await getSheetMusicById(topListItem.id);
    return {
        ...topListItem,
        musicList,
    };
}
async function getLyric(musicItem) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const data = { id: musicItem.id, lv: -1, tv: -1, csrf_token: "" };
    const pae = getParamsAndEnc(JSON.stringify(data));
    const paeData = qs.stringify(pae);
    const result = (await (0, axios_1.default)({
        method: "post",
        url: `https://interface.music.163.com/weapi/song/lyric?csrf_token=`,
        headers,
        data: paeData,
    })).data;
    return {
        rawLrc: result.lrc.lyric,
    };
}
async function getAlbumInfo(albumItem) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const data = {
        resourceType: 3,
        resourceId: albumItem.id,
        limit: 15,
        csrf_token: "",
    };
    const pae = getParamsAndEnc(JSON.stringify(data));
    const paeData = qs.stringify(pae);
    const res = (await (0, axios_1.default)({
        method: "post",
        url: `https://interface.music.163.com/weapi/v1/album/${albumItem.id}?csrf_token=`,
        headers,
        data: paeData,
    })).data;
    return {
        albumItem: { description: res.album.description },
        musicList: (res.songs || [])
            .filter(musicCanPlayFilter)
            .map(formatMusicItem),
    };
}
async function getValidMusicItems(trackIds) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    try {
        const data = {
            csrf_token: "",
            ids: `[${trackIds.join(",")}]`,
            level: "standard",
            encodeType: "flac",
        };
        const pae = getParamsAndEnc(JSON.stringify(data));
        const urlencoded = qs.stringify(pae);
        const res = (await (0, axios_1.default)({
            method: "post",
            url: `https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=`,
            headers,
            data: urlencoded,
        })).data;
        const validTrackIds = res.data.filter((_) => _.url).map((_) => _.id);
        const songDetails = (await axios_1.default.get(`https://music.163.com/api/song/detail/?id=${validTrackIds[0]}&ids=[${validTrackIds.join(",")}]`, { headers })).data;
        const validMusicItems = songDetails.songs
            .filter((_) => _.fee === 0 || _.fee === 8)
            .map(formatMusicItem);
        return validMusicItems;
    }
    catch (e) {
        return [];
    }
}
async function getSheetMusicById(id) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
    };
    const sheetDetail = (await axios_1.default.get(`https://music.163.com/api/v3/playlist/detail?id=${id}&n=5000`, {
        headers,
    })).data;
    const trackIds = sheetDetail.playlist.trackIds.map((_) => _.id);
    let result = [];
    let idx = 0;
    while (idx * 200 < trackIds.length) {
        const res = await getValidMusicItems(trackIds.slice(idx * 200, (idx + 1) * 200));
        result = result.concat(res);
        ++idx;
    }
    return result;
}
async function importMusicSheet(urlLike) {
    const matchResult = urlLike.match(/(?:https:\/\/y\.music\.163.com\/m\/playlist\?id=([0-9]+))|(?:https?:\/\/music\.163\.com\/playlist\/([0-9]+)\/.*)|(?:https?:\/\/music.163.com\/#\/playlist\?id=(\d+))|(?:^\s*(\d+)\s*$)/);
    const id = matchResult[1] || matchResult[2] || matchResult[3] || matchResult[4];
    return getSheetMusicById(id);
}
async function getTopLists() {
    const res = await axios_1.default.get("https://music.163.com/discover/toplist", {
        headers: {
            referer: "https://music.163.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54",
        },
    });
    const $ = cheerio.load(res.data);
    const children = $(".n-minelst").children();
    const groups = [];
    let currentGroup = {};
    for (let c of children) {
        if (c.tagName == "h2") {
            if (currentGroup.title) {
                groups.push(currentGroup);
            }
            currentGroup = {};
            currentGroup.title = $(c).text();
            currentGroup.data = [];
        }
        else if (c.tagName === "ul") {
            let sections = $(c).children();
            currentGroup.data = sections
                .map((index, element) => {
                const ele = $(element);
                const id = ele.attr("data-res-id");
                const coverImg = ele.find("img").attr("src");
                const title = ele.find("p.name").text();
                const description = ele.find("p.s-fc4").text();
                return {
                    id,
                    coverImg,
                    title,
                    description,
                };
            })
                .toArray();
        }
    }
    if (currentGroup.title) {
        groups.push(currentGroup);
    }
    return groups;
}
const qualityLevels = {
    low: '',
    standard: 'standard',
    high: 'exhigh',
    super: 'lossless'
};
async function getMediaSource(musicItem, quality) {
    if (quality !== 'standard') {
        return;
    }
    return {
        url: `https://music.163.com/song/media/outer/url?id=${musicItem.id}.mp3`,
    };
}
const headers = {
    authority: "music.163.com",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
    "content-type": "application/x-www-form-urlencoded",
    accept: "*/*",
    origin: "https://music.163.com",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://music.163.com/",
    "accept-language": "zh-CN,zh;q=0.9",
};
async function getRecommendSheetTags() {
    const data = {
        csrf_token: "",
    };
    const pae = getParamsAndEnc(JSON.stringify(data));
    const paeData = qs.stringify(pae);
    const res = (await (0, axios_1.default)({
        method: "post",
        url: "https://music.163.com/weapi/playlist/catalogue",
        headers,
        data: paeData,
    })).data;
    const cats = res.categories;
    const map = {};
    const catData = Object.entries(cats).map(_ => {
        const tagData = ({
            title: _[1],
            data: []
        });
        map[_[0]] = tagData;
        return tagData;
    });
    const pinned = [];
    res.sub.forEach(tag => {
        const _tag = {
            id: tag.name,
            title: tag.name,
        };
        if (tag.hot) {
            pinned.push(_tag);
        }
        map[tag.category].data.push(_tag);
    });
    return {
        pinned,
        data: catData
    };
}
async function getRecommendSheetsByTag(tag, page) {
    const pageSize = 20;
    const data = {
        cat: tag.id || '全部',
        order: 'hot',
        limit: pageSize,
        offset: (page - 1) * pageSize,
        total: true,
        csrf_token: "",
    };
    const pae = getParamsAndEnc(JSON.stringify(data));
    const paeData = qs.stringify(pae);
    const res = (await (0, axios_1.default)({
        method: "post",
        url: "https://music.163.com/weapi/playlist/list",
        headers,
        data: paeData,
    })).data;
    const playLists = res.playlists.map(_ => ({
        id: _.id,
        artist: _.creator.nickname,
        title: _.name,
        artwork: _.coverImgUrl,
        playCount: _.playCount,
        createUserId: _.userId,
        createTime: _.createTime,
        description: _.description
    }));
    return {
        isEnd: !(res.more === true),
        data: playLists
    };
}
async function getMusicSheetInfo(sheet, page) {
    let trackIds = sheet._trackIds;
    if (!trackIds) {
        const id = sheet.id;
        const headers = {
            Referer: "https://y.music.163.com/",
            Origin: "https://y.music.163.com/",
            authority: "music.163.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        };
        const sheetDetail = (await axios_1.default.get(`https://music.163.com/api/v3/playlist/detail?id=${id}&n=5000`, {
            headers,
        })).data;
        trackIds = sheetDetail.playlist.trackIds.map((_) => _.id);
    }
    const pageSize = 40;
    const currentPageIds = trackIds.slice((page - 1) * pageSize, page * pageSize);
    const res = await getValidMusicItems(currentPageIds);
    let extra = {};
    if (page <= 1) {
        extra = {
            _trackIds: trackIds,
        };
    }
    return {
        isEnd: trackIds.length <= page * pageSize,
        musicList: res,
        ...extra
    };
}
module.exports = {
    platform: "网易云",
    version: "0.1.2",
    appVersion: '>0.1.0-alpha.0',
    srcUrl: "http://adad23u.appinstall.life/dist/netease/index.js",
    order: 14,
    cacheControl: "no-store",
    hints: {
        importMusicSheet: [
            '网易云移动端：APP点击分享，然后复制链接',
            '网易云H5/PC端：复制URL，或者直接输入歌单ID即可',
            '默认歌单无法导入，先新建一个空白歌单复制过去再导入新歌单即可',
            '导入过程中会过滤掉所有VIP/试听/收费音乐，导入时间和歌单大小有关，请耐心等待'
        ]
    },
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
        if (type === "sheet") {
            return await searchMusicSheet(query, page);
        }
    },
    getMediaSource,
    getAlbumInfo,
    getLyric,
    getArtistWorks,
    importMusicSheet,
    getTopLists,
    getTopListDetail,
    getRecommendSheetTags,
    getMusicSheetInfo,
    getRecommendSheetsByTag
};

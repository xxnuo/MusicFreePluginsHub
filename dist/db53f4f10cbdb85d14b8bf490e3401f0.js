var $8Nr7K$axios = require("axios");
var $8Nr7K$cryptojs = require("crypto-js");
var $8Nr7K$qs = require("qs");
var $8Nr7K$biginteger = require("big-integer");
var $8Nr7K$dayjs = require("dayjs");
var $8Nr7K$cheerio = require("cheerio");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $69c13ef3ab1c1f3e$export$2e2bcd8739ae039);






function $69c13ef3ab1c1f3e$var$create_key() {
    var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
    for(d = 0; 16 > d; d += 1)e = Math.random() * b.length, e = Math.floor(e), c += b.charAt(e);
    return c;
}
function $69c13ef3ab1c1f3e$var$AES(a, b) {
    var c = (0, ($parcel$interopDefault($8Nr7K$cryptojs))).enc.Utf8.parse(b), d = (0, ($parcel$interopDefault($8Nr7K$cryptojs))).enc.Utf8.parse("0102030405060708"), e = (0, ($parcel$interopDefault($8Nr7K$cryptojs))).enc.Utf8.parse(a), f = (0, ($parcel$interopDefault($8Nr7K$cryptojs))).AES.encrypt(e, c, {
        iv: d,
        mode: (0, ($parcel$interopDefault($8Nr7K$cryptojs))).mode.CBC
    });
    return f.toString();
}
function $69c13ef3ab1c1f3e$var$Rsa(text) {
    text = text.split("").reverse().join("");
    const d = "010001";
    const e = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7";
    const hexText = text.split("").map((_)=>_.charCodeAt(0).toString(16)).join("");
    const res = (0, ($parcel$interopDefault($8Nr7K$biginteger)))(hexText, 16).modPow((0, ($parcel$interopDefault($8Nr7K$biginteger)))(d, 16), (0, ($parcel$interopDefault($8Nr7K$biginteger)))(e, 16)).toString(16);
    return Array(256 - res.length).fill("0").join("").concat(res);
}
function $69c13ef3ab1c1f3e$var$getParamsAndEnc(text) {
    const first = $69c13ef3ab1c1f3e$var$AES(text, "0CoJUm6Qyw8W8jud");
    const rand = $69c13ef3ab1c1f3e$var$create_key();
    const params = $69c13ef3ab1c1f3e$var$AES(first, rand);
    const encSecKey = $69c13ef3ab1c1f3e$var$Rsa(rand);
    return {
        params: params,
        encSecKey: encSecKey
    };
}
function $69c13ef3ab1c1f3e$var$formatMusicItem(_) {
    var _a, _b, _c, _d;
    const album = _.al || _.album;
    return {
        id: _.id,
        artwork: album === null || album === void 0 ? void 0 : album.picUrl,
        title: _.name,
        artist: (_.ar || _.artists)[0].name,
        album: album === null || album === void 0 ? void 0 : album.name,
        url: `https://share.duanx.cn/url/wy/${_.id}/128k`,
        qualities: {
            low: {
                size: (_a = _.l || {}) === null || _a === void 0 ? void 0 : _a.size
            },
            standard: {
                size: (_b = _.m || {}) === null || _b === void 0 ? void 0 : _b.size
            },
            high: {
                size: (_c = _.h || {}) === null || _c === void 0 ? void 0 : _c.size
            },
            super: {
                size: (_d = _.sq || {}) === null || _d === void 0 ? void 0 : _d.size
            }
        },
        copyrightId: _ === null || _ === void 0 ? void 0 : _.copyrightId
    };
}
function $69c13ef3ab1c1f3e$var$formatAlbumItem(_) {
    return {
        id: _.id,
        artist: _.artist.name,
        title: _.name,
        artwork: _.picUrl,
        description: "",
        date: (0, ($parcel$interopDefault($8Nr7K$dayjs))).unix(_.publishTime / 1000).format("YYYY-MM-DD")
    };
}
const $69c13ef3ab1c1f3e$var$pageSize = 30;
async function $69c13ef3ab1c1f3e$var$searchBase(query, page, type) {
    const data = {
        s: query,
        limit: $69c13ef3ab1c1f3e$var$pageSize,
        type: type,
        offset: (page - 1) * $69c13ef3ab1c1f3e$var$pageSize,
        csrf_token: ""
    };
    const pae = $69c13ef3ab1c1f3e$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = (0, ($parcel$interopDefault($8Nr7K$qs))).stringify(pae);
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
        "accept-language": "zh-CN,zh;q=0.9"
    };
    const res = (await (0, ($parcel$interopDefault($8Nr7K$axios)))({
        method: "post",
        url: "https://music.163.com/weapi/search/get",
        headers: headers,
        data: paeData
    })).data;
    return res;
}
async function $69c13ef3ab1c1f3e$var$searchMusic(query, page) {
    const res = await $69c13ef3ab1c1f3e$var$searchBase(query, page, 1);
    const songs = res.result.songs.map($69c13ef3ab1c1f3e$var$formatMusicItem);
    return {
        isEnd: res.result.songCount <= page * $69c13ef3ab1c1f3e$var$pageSize,
        data: songs
    };
}
async function $69c13ef3ab1c1f3e$var$searchAlbum(query, page) {
    const res = await $69c13ef3ab1c1f3e$var$searchBase(query, page, 10);
    const albums = res.result.albums.map($69c13ef3ab1c1f3e$var$formatAlbumItem);
    return {
        isEnd: res.result.albumCount <= page * $69c13ef3ab1c1f3e$var$pageSize,
        data: albums
    };
}
async function $69c13ef3ab1c1f3e$var$searchArtist(query, page) {
    const res = await $69c13ef3ab1c1f3e$var$searchBase(query, page, 100);
    const artists = res.result.artists.map((_)=>({
            name: _.name,
            id: _.id,
            avatar: _.img1v1Url,
            worksNum: _.albumSize
        }));
    return {
        isEnd: res.result.artistCount <= page * $69c13ef3ab1c1f3e$var$pageSize,
        data: artists
    };
}
async function $69c13ef3ab1c1f3e$var$searchMusicSheet(query, page) {
    const res = await $69c13ef3ab1c1f3e$var$searchBase(query, page, 1000);
    const playlists = res.result.playlists.map((_)=>{
        var _a;
        return {
            title: _.name,
            id: _.id,
            coverImg: _.coverImgUrl,
            artist: (_a = _.creator) === null || _a === void 0 ? void 0 : _a.nickname,
            playCount: _.playCount,
            worksNum: _.trackCount
        };
    });
    return {
        isEnd: res.result.playlistCount <= page * $69c13ef3ab1c1f3e$var$pageSize,
        data: playlists
    };
}
async function $69c13ef3ab1c1f3e$var$searchLyric(query, page) {
    var _a, _b;
    const res = await $69c13ef3ab1c1f3e$var$searchBase(query, page, 1006);
    const lyrics = (_b = (_a = res.result.songs) === null || _a === void 0 ? void 0 : _a.map((it)=>{
        var _a, _b, _c, _d;
        return {
            title: it.name,
            artist: (_a = it.ar) === null || _a === void 0 ? void 0 : _a.map((_)=>_.name).join(", "),
            id: it.id,
            artwork: (_b = it.al) === null || _b === void 0 ? void 0 : _b.picUrl,
            album: (_c = it.al) === null || _c === void 0 ? void 0 : _c.name,
            rawLrcTxt: (_d = it.lyrics) === null || _d === void 0 ? void 0 : _d.join("\n")
        };
    })) !== null && _b !== void 0 ? _b : [];
    return {
        isEnd: res.result.songCount <= page * $69c13ef3ab1c1f3e$var$pageSize,
        data: lyrics
    };
}
async function $69c13ef3ab1c1f3e$var$getArtistWorks(artistItem, page, type) {
    const data = {
        csrf_token: ""
    };
    const pae = $69c13ef3ab1c1f3e$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = (0, ($parcel$interopDefault($8Nr7K$qs))).stringify(pae);
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
        "accept-language": "zh-CN,zh;q=0.9"
    };
    if (type === "music") {
        const res = (await (0, ($parcel$interopDefault($8Nr7K$axios)))({
            method: "post",
            url: `https://music.163.com/weapi/v1/artist/${artistItem.id}?csrf_token=`,
            headers: headers,
            data: paeData
        })).data;
        return {
            isEnd: true,
            data: res.hotSongs.map($69c13ef3ab1c1f3e$var$formatMusicItem)
        };
    } else if (type === "album") {
        const res = (await (0, ($parcel$interopDefault($8Nr7K$axios)))({
            method: "post",
            url: `https://music.163.com/weapi/artist/albums/${artistItem.id}?csrf_token=`,
            headers: headers,
            data: paeData
        })).data;
        return {
            isEnd: true,
            data: res.hotAlbums.map($69c13ef3ab1c1f3e$var$formatAlbumItem)
        };
    }
}
async function $69c13ef3ab1c1f3e$var$getTopListDetail(topListItem) {
    const musicList = await $69c13ef3ab1c1f3e$var$getSheetMusicById(topListItem.id);
    return Object.assign(Object.assign({}, topListItem), {
        musicList: musicList
    });
}
async function $69c13ef3ab1c1f3e$var$getLyric(musicItem) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    };
    const data = {
        id: musicItem.id,
        lv: -1,
        tv: -1,
        csrf_token: ""
    };
    const pae = $69c13ef3ab1c1f3e$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = (0, ($parcel$interopDefault($8Nr7K$qs))).stringify(pae);
    const result = (await (0, ($parcel$interopDefault($8Nr7K$axios)))({
        method: "post",
        url: `https://interface.music.163.com/weapi/song/lyric?csrf_token=`,
        headers: headers,
        data: paeData
    })).data;
    return {
        rawLrc: result.lrc.lyric
    };
}
async function $69c13ef3ab1c1f3e$var$getMusicInfo(musicItem) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    };
    const data = {
        id: musicItem.id,
        ids: `[${musicItem.id}]`
    };
    const result = (await (0, ($parcel$interopDefault($8Nr7K$axios))).get("http://music.163.com/api/song/detail", {
        headers: headers,
        params: data
    })).data;
    return {
        artwork: result.songs[0].album.picUrl
    };
}
async function $69c13ef3ab1c1f3e$var$getAlbumInfo(albumItem) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    };
    const data = {
        resourceType: 3,
        resourceId: albumItem.id,
        limit: 15,
        csrf_token: ""
    };
    const pae = $69c13ef3ab1c1f3e$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = (0, ($parcel$interopDefault($8Nr7K$qs))).stringify(pae);
    const res = (await (0, ($parcel$interopDefault($8Nr7K$axios)))({
        method: "post",
        url: `https://interface.music.163.com/weapi/v1/album/${albumItem.id}?csrf_token=`,
        headers: headers,
        data: paeData
    })).data;
    return {
        albumItem: {
            description: res.album.description
        },
        musicList: (res.songs || []).map($69c13ef3ab1c1f3e$var$formatMusicItem)
    };
}
async function $69c13ef3ab1c1f3e$var$getValidMusicItems(trackIds) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
    };
    try {
        // 获取歌曲详情数据
        const res = (await (0, ($parcel$interopDefault($8Nr7K$axios))).get(`https://music.163.com/api/song/detail/?ids=[${trackIds.join(",")}]`, {
            headers: headers
        })).data;
        // 直接格式化歌曲项，不检查 URL
        const validMusicItems = res.songs.map($69c13ef3ab1c1f3e$var$formatMusicItem);
        return validMusicItems;
    } catch (e) {
        console.error(e);
        return [];
    }
}
async function $69c13ef3ab1c1f3e$var$getSheetMusicById(id) {
    const headers = {
        Referer: "https://y.music.163.com/",
        Origin: "https://y.music.163.com/",
        authority: "music.163.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36"
    };
    const sheetDetail = (await (0, ($parcel$interopDefault($8Nr7K$axios))).get(`https://music.163.com/api/v3/playlist/detail?id=${id}&n=5000`, {
        headers: headers
    })).data;
    const trackIds = sheetDetail.playlist.trackIds.map((_)=>_.id);
    let result = [];
    let idx = 0;
    while(idx * 200 < trackIds.length){
        const res = await $69c13ef3ab1c1f3e$var$getValidMusicItems(trackIds.slice(idx * 200, (idx + 1) * 200));
        result = result.concat(res);
        ++idx;
    }
    return result;
}
async function $69c13ef3ab1c1f3e$var$importMusicSheet(urlLike) {
    const matchResult = urlLike.match(/(?:https:\/\/y\.music\.163.com\/m\/playlist\?id=([0-9]+))|(?:https?:\/\/music\.163\.com\/playlist\/([0-9]+)\/.*)|(?:https?:\/\/music.163.com(?:\/#)?\/playlist\?id=(\d+))|(?:^\s*(\d+)\s*$)/);
    const id = matchResult[1] || matchResult[2] || matchResult[3] || matchResult[4];
    return $69c13ef3ab1c1f3e$var$getSheetMusicById(id);
}
async function $69c13ef3ab1c1f3e$var$getTopLists() {
    const res = await (0, ($parcel$interopDefault($8Nr7K$axios))).get("https://music.163.com/discover/toplist", {
        headers: {
            referer: "https://music.163.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54"
        }
    });
    const $ = $8Nr7K$cheerio.load(res.data);
    const children = $(".n-minelst").children();
    const groups = [];
    let currentGroup = {
        title: undefined,
        data: []
    };
    for (let c of children){
        if (c.tagName == "h2") {
            if (currentGroup.title) groups.push(currentGroup);
            currentGroup = {
                title: undefined,
                data: []
            };
            currentGroup.title = $(c).text();
            currentGroup.data = [];
        } else if (c.tagName === "ul") {
            let sections = $(c).children();
            currentGroup.data = sections.map((index, element)=>{
                const ele = $(element);
                const id = ele.attr("data-res-id");
                const coverImg = ele.find("img").attr("src").replace(/(\.jpg\?).*/, ".jpg?param=800y800");
                const title = ele.find("p.name").text();
                const description = ele.find("p.s-fc4").text();
                return {
                    id: id,
                    coverImg: coverImg,
                    title: title,
                    description: description
                };
            }).toArray();
        }
    }
    if (currentGroup.title) groups.push(currentGroup);
    return groups;
}
const $69c13ef3ab1c1f3e$var$qualityLevels = {
    low: "128k",
    standard: "320k",
    high: "flac",
    super: "flac24bit"
};
async function $69c13ef3ab1c1f3e$var$getMediaSource(musicItem, quality) {
    let url = "";
    const res = (await (0, ($parcel$interopDefault($8Nr7K$axios))).get(`https://lxmusicapi.onrender.com/url/wy/${musicItem.id}/${$69c13ef3ab1c1f3e$var$qualityLevels[quality]}`, {
        headers: {
            "X-Request-Key": "share-v2"
        }
    })).data;
    if (!res.url || res.msg != "success") {
        const res2 = (await (0, ($parcel$interopDefault($8Nr7K$axios))).get(`https://lxmusicapi.onrender.com/url/wy/${musicItem.id}/${$69c13ef3ab1c1f3e$var$qualityLevels[quality]}`, {
            headers: {
                "X-Request-Key": "share-v2"
            }
        })).data;
        if (!res2.url || res2.msg != "success") ;
        else url = res2.url;
    } else url = res.url;
    return {
        url: url
    };
}
const $69c13ef3ab1c1f3e$var$headers = {
    authority: "music.163.com",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
    "content-type": "application/x-www-form-urlencoded",
    accept: "*/*",
    origin: "https://music.163.com",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://music.163.com/",
    "accept-language": "zh-CN,zh;q=0.9"
};
async function $69c13ef3ab1c1f3e$var$getRecommendSheetTags() {
    const data = {
        csrf_token: ""
    };
    const pae = $69c13ef3ab1c1f3e$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = (0, ($parcel$interopDefault($8Nr7K$qs))).stringify(pae);
    const res = (await (0, ($parcel$interopDefault($8Nr7K$axios)))({
        method: "post",
        url: "https://music.163.com/weapi/playlist/catalogue",
        headers: $69c13ef3ab1c1f3e$var$headers,
        data: paeData
    })).data;
    const cats = res.categories;
    const map = {};
    const catData = Object.entries(cats).map((_)=>{
        const tagData = {
            title: _[1],
            data: []
        };
        map[_[0]] = tagData;
        return tagData;
    });
    let pinned = [];
    res.sub.forEach((tag)=>{
        const _tag = {
            id: tag.name,
            title: tag.name
        };
        if (tag.hot) pinned.push(_tag);
        map[tag.category].data.push(_tag);
    });
    return {
        pinned: pinned,
        data: catData
    };
}
async function $69c13ef3ab1c1f3e$var$getRecommendSheetsByTag(tag, page) {
    const pageSize = 20;
    const data = {
        cat: tag.id || "全部",
        order: "hot",
        limit: pageSize,
        offset: (page - 1) * pageSize,
        total: true,
        csrf_token: ""
    };
    const pae = $69c13ef3ab1c1f3e$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = (0, ($parcel$interopDefault($8Nr7K$qs))).stringify(pae);
    const res = (await (0, ($parcel$interopDefault($8Nr7K$axios)))({
        method: "post",
        url: "https://music.163.com/weapi/playlist/list",
        headers: $69c13ef3ab1c1f3e$var$headers,
        data: paeData
    })).data;
    const playLists = res.playlists.map((_)=>({
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
async function $69c13ef3ab1c1f3e$var$getMusicSheetInfo(sheet, page) {
    let trackIds = sheet._trackIds;
    if (!trackIds) {
        const id = sheet.id;
        const headers = {
            Referer: "https://y.music.163.com/",
            Origin: "https://y.music.163.com/",
            authority: "music.163.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36"
        };
        const sheetDetail = (await (0, ($parcel$interopDefault($8Nr7K$axios))).get(`https://music.163.com/api/v3/playlist/detail?id=${id}&n=5000`, {
            headers: headers
        })).data;
        trackIds = sheetDetail.playlist.trackIds.map((_)=>_.id);
    }
    const pageSize = 40;
    const currentPageIds = trackIds.slice((page - 1) * pageSize, page * pageSize);
    const res = await $69c13ef3ab1c1f3e$var$getValidMusicItems(currentPageIds);
    let extra = {};
    if (page <= 1) extra = {
        _trackIds: trackIds
    };
    return Object.assign({
        isEnd: trackIds.length <= page * pageSize,
        musicList: res
    }, extra);
}
async function $69c13ef3ab1c1f3e$var$search(query, page, type) {
    if (type === "music") return await $69c13ef3ab1c1f3e$var$searchMusic(query, page);
    if (type === "album") return await $69c13ef3ab1c1f3e$var$searchAlbum(query, page);
    if (type === "artist") return await $69c13ef3ab1c1f3e$var$searchArtist(query, page);
    if (type === "sheet") return await $69c13ef3ab1c1f3e$var$searchMusicSheet(query, page);
    if (type === "lyric") return await $69c13ef3ab1c1f3e$var$searchLyric(query, page);
}
const $69c13ef3ab1c1f3e$var$pluginInstance = {
    platform: "小芸音乐",
    author: "SoEasy同学",
    version: "0.0.3",
    srcUrl: "https://musicfreepluginshub.2020818.xyz/db53f4f10cbdb85d14b8bf490e3401f0.js",
    cacheControl: "no-store",
    hints: {
        importMusicSheet: [
            "网易云：APP点击分享，然后复制链接",
            "默认歌单无法导入，先新建一个空白歌单复制过去再导入新歌单即可"
        ],
        importMusicItem: []
    },
    supportedSearchType: [
        "music",
        "album",
        "sheet",
        "artist",
        "lyric"
    ],
    search: $69c13ef3ab1c1f3e$var$search,
    getMediaSource: $69c13ef3ab1c1f3e$var$getMediaSource,
    getMusicInfo: $69c13ef3ab1c1f3e$var$getMusicInfo,
    getAlbumInfo: $69c13ef3ab1c1f3e$var$getAlbumInfo,
    getLyric: $69c13ef3ab1c1f3e$var$getLyric,
    getArtistWorks: $69c13ef3ab1c1f3e$var$getArtistWorks,
    importMusicSheet: $69c13ef3ab1c1f3e$var$importMusicSheet,
    getTopLists: $69c13ef3ab1c1f3e$var$getTopLists,
    getTopListDetail: $69c13ef3ab1c1f3e$var$getTopListDetail,
    getRecommendSheetTags: $69c13ef3ab1c1f3e$var$getRecommendSheetTags,
    getMusicSheetInfo: $69c13ef3ab1c1f3e$var$getMusicSheetInfo,
    getRecommendSheetsByTag: $69c13ef3ab1c1f3e$var$getRecommendSheetsByTag
};
$69c13ef3ab1c1f3e$var$search("童话镇", 1, "music").then((res)=>{
    console.log(res);
    $69c13ef3ab1c1f3e$var$getMediaSource(res.data[0], "standard").then((res)=>{
        console.log(res);
    });
    $69c13ef3ab1c1f3e$var$getLyric(res.data[0]).then((res)=>{
        console.log(res);
    });
});
var $69c13ef3ab1c1f3e$export$2e2bcd8739ae039 = $69c13ef3ab1c1f3e$var$pluginInstance;


//# sourceMappingURL=xiaoyun.js.map

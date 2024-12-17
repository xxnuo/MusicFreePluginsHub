var $8zHUo$axios = require("axios");
var $8zHUo$cryptojs = require("crypto-js");
var $8zHUo$qs = require("qs");
var $8zHUo$biginteger = require("big-integer");
var $8zHUo$dayjs = require("dayjs");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}





const $882b6d93070905b3$var$headers = {
    authority: "music.163.com",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
    "content-type": "application/x-www-form-urlencoded",
    accept: "*/*",
    origin: "https://music.163.com",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://music.163.com/api/djradio/v2/get",
    "accept-language": "zh-CN,zh;q=0.9"
};
function $882b6d93070905b3$var$a() {
    var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
    for(d = 0; 16 > d; d += 1)e = Math.random() * b.length, e = Math.floor(e), c += b.charAt(e);
    return c;
}
function $882b6d93070905b3$var$b(a, b) {
    var c = $8zHUo$cryptojs.enc.Utf8.parse(b), d = $8zHUo$cryptojs.enc.Utf8.parse("0102030405060708"), e = $8zHUo$cryptojs.enc.Utf8.parse(a), f = $8zHUo$cryptojs.AES.encrypt(e, c, {
        iv: d,
        mode: $8zHUo$cryptojs.mode.CBC
    });
    return f.toString();
}
function $882b6d93070905b3$var$c(text) {
    text = text.split("").reverse().join("");
    const d = "010001";
    const e = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7";
    const hexText = text.split("").map((_)=>_.charCodeAt(0).toString(16)).join("");
    const res = $8zHUo$biginteger(hexText, 16).modPow($8zHUo$biginteger(d, 16), $8zHUo$biginteger(e, 16)).toString(16);
    return Array(256 - res.length).fill("0").join("").concat(res);
}
function $882b6d93070905b3$var$getParamsAndEnc(text) {
    const first = $882b6d93070905b3$var$b(text, "0CoJUm6Qyw8W8jud");
    const rand = $882b6d93070905b3$var$a();
    const params = $882b6d93070905b3$var$b(first, rand);
    const encSecKey = $882b6d93070905b3$var$c(rand);
    return {
        params: params,
        encSecKey: encSecKey
    };
}
function $882b6d93070905b3$var$formatMusicItem(_) {
    return {
        id: _.mainSong.id,
        artwork: _.coverUrl,
        title: _.mainSong.name,
        artist: _.mainSong.artists[0].name,
        album: _.radio.name,
        url: `https://music.163.com/song/media/outer/url?id=${_.mainSong.id}.mp3`,
        qualities: {
            standard: {
                size: (_.mainSong.lMusic || {})?.size
            }
        },
        copyrightId: _?.copyrightId
    };
}
function $882b6d93070905b3$var$formatAlbumItem(_) {
    return {
        id: _.id,
        artist: _.dj.nickname,
        title: _.name,
        artwork: _.picUrl,
        description: _.desc,
        date: $8zHUo$dayjs.unix(_.createTime / 1000).format("YYYY-MM-DD")
    };
}
function $882b6d93070905b3$var$musicCanPlayFilter(_) {
    return _.feeScope === 0 || _.feeScope === 8;
}
const $882b6d93070905b3$var$pageSize = 30;
async function $882b6d93070905b3$var$searchBase(query, page, type) {
    const data = {
        s: query,
        limit: $882b6d93070905b3$var$pageSize,
        type: type,
        offset: (page - 1) * $882b6d93070905b3$var$pageSize,
        csrf_token: ""
    };
    const pae = $882b6d93070905b3$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = $8zHUo$qs.stringify(pae);
    const res = (await (0, ($parcel$interopDefault($8zHUo$axios)))({
        method: "post",
        url: "https://music.163.com/weapi/search/get",
        headers: $882b6d93070905b3$var$headers,
        data: paeData
    })).data;
    return res;
}
async function $882b6d93070905b3$var$searchUserRadio(uid) {
    const data = {
        userId: uid,
        csrf_token: ""
    };
    const pae = $882b6d93070905b3$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = $8zHUo$qs.stringify(pae);
    const res = (await (0, ($parcel$interopDefault($8zHUo$axios)))({
        method: "post",
        url: "https://music.163.com/weapi/djradio/get/byuser",
        headers: $882b6d93070905b3$var$headers,
        data: paeData
    })).data;
    return res;
}
async function $882b6d93070905b3$var$searchAlbum(query, page) {
    const res = await $882b6d93070905b3$var$searchBase(query, page, 1009);
    const albums = res.result.djRadios.map($882b6d93070905b3$var$formatAlbumItem);
    return {
        isEnd: res.result.albumCount <= page * $882b6d93070905b3$var$pageSize,
        data: albums
    };
}
async function $882b6d93070905b3$var$searchArtist(query, page) {
    const res = await $882b6d93070905b3$var$searchBase(query, page, 1002);
    const artists = [];
    const userprofiles = res.result.userprofiles;
    for(let i = 0; i < userprofiles.length; i++){
        const _ = userprofiles[i];
        const albumSize = await $882b6d93070905b3$var$searchUserRadio(_.userId);
        artists.push({
            name: _.nickname,
            id: _.userId,
            avatar: _.avatarUrl,
            worksNum: albumSize.count
        });
    }
    return {
        isEnd: res.result.artistCount <= page * $882b6d93070905b3$var$pageSize,
        data: artists
    };
}
async function $882b6d93070905b3$var$getArtistWorks(artistItem, page, type) {
    if (type === "music") return {
        isEnd: true,
        data: []
    };
    else if (type === "album") {
        const res = await $882b6d93070905b3$var$searchUserRadio(artistItem.id);
        return {
            isEnd: true,
            data: res.djRadios.map($882b6d93070905b3$var$formatAlbumItem)
        };
    }
}
async function $882b6d93070905b3$var$getLyric(musicItem) {
    const data = {
        id: musicItem.id,
        csrf_token: ""
    };
    const pae = $882b6d93070905b3$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = $8zHUo$qs.stringify(pae);
    const result = (await (0, ($parcel$interopDefault($8zHUo$axios)))({
        method: "post",
        url: `https://music.163.com/api/dj/program/detail`,
        headers: $882b6d93070905b3$var$headers,
        data: paeData
    })).data;
    return {
        rawLrc: result.program.description,
        translation: null
    };
}
async function $882b6d93070905b3$var$getAlbumInfo(albumItem, page) {
    const data = {
        radioId: albumItem.id,
        csrf_token: "",
        limit: $882b6d93070905b3$var$pageSize,
        offset: (page - 1) * $882b6d93070905b3$var$pageSize
    };
    const pae = $882b6d93070905b3$var$getParamsAndEnc(JSON.stringify(data));
    const paeData = $8zHUo$qs.stringify(pae);
    const res = (await (0, ($parcel$interopDefault($8zHUo$axios)))({
        method: "post",
        url: `https://music.163.com/weapi/dj/program/byradio`,
        headers: $882b6d93070905b3$var$headers,
        data: paeData
    })).data;
    return {
        isEnd: res.programs <= page * $882b6d93070905b3$var$pageSize,
        musicList: (res.programs || []).filter($882b6d93070905b3$var$musicCanPlayFilter).map($882b6d93070905b3$var$formatMusicItem)
    };
}
async function $882b6d93070905b3$var$getMediaSource(musicItem, quality) {
    if (quality !== "standard") return;
    return {
        url: `https://music.163.com/song/media/outer/url?id=${musicItem.id}.mp3`
    };
}
module.exports = {
    platform: "\u7F51\u6613\u4E91\u7535\u53F0",
    author: "\u5495\u5495mur",
    version: "0.0.2",
    srcUrl: "https://fastly.jsdelivr.net/gh/GuGuMur/MusicFreePlugin-NeteaseRadio@master/dist/plugin.js",
    cacheControl: "no-store",
    supportedSearchType: [
        "album",
        "artist"
    ],
    async search (query, page, type) {
        if (type === "album") return await $882b6d93070905b3$var$searchAlbum(query, page);
        if (type === "artist") return await $882b6d93070905b3$var$searchArtist(query, page);
    },
    getLyric: $882b6d93070905b3$var$getLyric,
    getMediaSource: $882b6d93070905b3$var$getMediaSource,
    getAlbumInfo: $882b6d93070905b3$var$getAlbumInfo,
    getArtistWorks: $882b6d93070905b3$var$getArtistWorks
};


//# sourceMappingURL=plugin.js.map

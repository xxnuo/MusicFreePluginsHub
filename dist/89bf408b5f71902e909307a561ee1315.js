"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dayjs = require("dayjs");
const he = require("he");
const CryptoJs = require("crypto-js");
const { load } = require('cheerio');
const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63",
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
};
let cookie;
async function getCid(bvid, aid) {
    const params = bvid
        ? {
            bvid: bvid,
        }
        : {
            aid: aid,
        };
    const cidRes = (await axios_1.default.get("https://api.bilibili.com/x/web-interface/view?%s", {
        headers: headers,
        params: params,
    })).data;
    return cidRes;
}
function durationToSec(duration) {
    if (typeof duration === "number") {
        return duration;
    }
    if (typeof duration === "string") {
        var dur = duration.split(":");
        return dur.reduce(function (prev, curr) {
            return 60 * prev + +curr;
        }, 0);
    }
    return 0;
}
const searchHeaders = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63",
    accept: "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br",
    origin: "https://search.bilibili.com",
    "sec-fetch-site": "same-site",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://search.bilibili.com/",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
};
async function getCookie() {
    if (!cookie) {
        cookie = (await axios_1.default.get("https://api.bilibili.com/x/frontend/finger/spi", {
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/114.0.0.0",
            },
        })).data.data;
    }
}
const pageSize = 20;
async function searchBase(keyword, page, searchType) {
    await getCookie();
    const params = {
        context: "",
        page: page,
        order: "",
        page_size: pageSize,
        keyword: keyword,
        duration: "",
        tids_1: "",
        tids_2: "",
        __refresh__: true,
        _extra: "",
        highlight: 1,
        single_column: 0,
        platform: "pc",
        from_source: "",
        search_type: searchType,
        dynamic_offset: 0,
    };
    const res = (await axios_1.default.get("https://api.bilibili.com/x/web-interface/search/type", {
        headers: Object.assign(Object.assign({}, searchHeaders), { cookie: `buvid3=${cookie.b_3};buvid4=${cookie.b_4}` }),
        params: params,
    })).data;
    return res.data;
}
async function getFavoriteList(id) {
    const result = [];
    const pageSize = 20;
    let page = 1;
    while (true) {
        try {
            const { data: { data: { medias, has_more }, }, } = await axios_1.default.get("https://api.bilibili.com/x/v3/fav/resource/list", {
                params: {
                    media_id: id,
                    platform: "web",
                    ps: pageSize,
                    pn: page,
                },
            });
            result.push(...medias);
            if (!has_more) {
                break;
            }
            page += 1;
        }
        catch (error) {
            console.warn(error);
            break;
        }
    }
    return result;
}
function formatMedia(result) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const title = he.decode((_b = (_a = result.title) === null || _a === void 0 ? void 0 : _a.replace(/(\<em(.*?)\>)|(\<\/em\>)/g, "")) !== null && _b !== void 0 ? _b : "");
    return {
        id: (_d = (_c = result.cid) !== null && _c !== void 0 ? _c : result.bvid) !== null && _d !== void 0 ? _d : result.aid,
        aid: result.aid,
        bvid: result.bvid,
        artist: (_e = result.author) !== null && _e !== void 0 ? _e : (_f = result.owner) === null || _f === void 0 ? void 0 : _f.name,
        title,
        alias: (_g = title.match(/《(.+?)》/)) === null || _g === void 0 ? void 0 : _g[1],
        album: (_h = result.bvid) !== null && _h !== void 0 ? _h : result.aid,
        artwork: ((_j = result.pic) === null || _j === void 0 ? void 0 : _j.startsWith("//"))
            ? "http:".concat(result.pic)
            : result.pic,
        duration: durationToSec(result.duration),
        tags: (_k = result.tag) === null || _k === void 0 ? void 0 : _k.split(","),
        date: dayjs.unix(result.pubdate || result.created).format("YYYY-MM-DD"),
    };
}
async function searchAlbum(keyword, page) {
    const resultData = await searchBase(keyword, page, "video");
    const albums = resultData.result.map(formatMedia);
    return {
        isEnd: resultData.numResults <= page * pageSize,
        data: albums,
    };
}
async function searchArtist(keyword, page) {
    const resultData = await searchBase(keyword, page, "bili_user");
    const artists = resultData.result.map((result) => {
        var _a;
        return ({
            name: result.uname,
            id: result.mid,
            fans: result.fans,
            description: result.usign,
            avatar: ((_a = result.upic) === null || _a === void 0 ? void 0 : _a.startsWith("//"))
                ? `https://${result.upic}`
                : result.upic,
            worksNum: result.videos,
        });
    });
    return {
        isEnd: resultData.numResults <= page * pageSize,
        data: artists,
    };
}
function getMixinKey(e) {
    var t = [];
    return ([
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5,
        49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55,
        40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57,
        62, 11, 36, 20, 34, 44, 52,
    ].forEach(function (r) {
        e.charAt(r) && t.push(e.charAt(r));
    }),
        t.join("").slice(0, 32));
}
function hmacSha256(key, message) {
    const hmac = CryptoJs.HmacSHA256(message, key);
    return hmac.toString(CryptoJs.enc.Hex);
}
async function getBiliTicket(csrf) {
    const ts = Math.floor(Date.now() / 1000);
    const hexSign = hmacSha256('XgwSnGZ1p', `ts${ts}`);
    const url = 'https://api.bilibili.com/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket';
    try {
        const response = await axios_1.default.post(url, null, {
            params: {
                key_id: 'ec02',
                hexsign: hexSign,
                'context[ts]': ts,
                csrf: csrf || ''
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0'
            }
        });
        const data = await response.data;
        return data.data;
    }
    catch (e) {
        throw e;
    }
}
let img, sub, syncedTime;
async function getWBIKeys() {
    if (img && sub && syncedTime && syncedTime.getDate() === (new Date()).getDate()) {
        return {
            img,
            sub
        };
    }
    else {
        const data = await getBiliTicket('');
        img = data.nav.img;
        img = img.slice(img.lastIndexOf('/') + 1, img.lastIndexOf('.'));
        sub = data.nav.sub;
        sub = sub.slice(sub.lastIndexOf('/') + 1, sub.lastIndexOf('.'));
        syncedTime = new Date();
        return {
            img,
            sub
        };
    }
}
async function getRid(params) {
    const wbiKeys = await getWBIKeys();
    const npi = wbiKeys.img + wbiKeys.sub;
    const o = getMixinKey(npi);
    const l = Object.keys(params).sort();
    let c = [];
    for (let d = 0, u = /[!'\(\)*]/g; d < l.length; ++d) {
        let [h, p] = [l[d], params[l[d]]];
        p && "string" == typeof p && (p = p.replace(u, "")),
            null != p &&
                c.push("".concat(encodeURIComponent(h), "=").concat(encodeURIComponent(p)));
    }
    const f = c.join("&");
    const w_rid = CryptoJs.MD5(f + o).toString();
    return w_rid;
}
let w_webid;
let w_webid_date;
async function getWWebId(id) {
    if (w_webid && w_webid_date && (Date.now() - w_webid_date.getTime() < 1000 * 60 * 60)) {
        return w_webid;
    }
    const html = (await axios_1.default.get("https://space.bilibili.com/" + id, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63",
        }
    })).data;
    const $ = load(html);
    const content = $("#__RENDER_DATA__").text();
    const jsonContent = JSON.parse(decodeURIComponent(content));
    w_webid = jsonContent.access_id;
    w_webid_date = new Date();
    return w_webid;
}
async function getArtistWorks(artistItem, page, type) {
    const queryHeaders = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63",
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        origin: "https://space.bilibili.com",
        "sec-fetch-site": "same-site",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        referer: `https://space.bilibili.com/${artistItem.id}/video`,
    };
    await getCookie();
    const w_webid = await getWWebId(artistItem.id);
    const now = Math.round(Date.now() / 1e3);
    const params = {
        mid: artistItem.id,
        ps: 30,
        tid: 0,
        pn: page,
        web_location: 1550101,
        order_avoided: true,
        order: "pubdate",
        keyword: "",
        platform: "web",
        dm_img_list: "[]",
        dm_img_str: "V2ViR0wgMS4wIChPcGVuR0wgRVMgMi4wIENocm9taXVtKQ",
        dm_cover_img_str: "QU5HTEUgKE5WSURJQSwgTlZJRElBIEdlRm9yY2UgR1RYIDE2NTAgKDB4MDAwMDFGOTEpIERpcmVjdDNEMTEgdnNfNV8wIHBzXzVfMCwgRDNEMTEpR29vZ2xlIEluYy4gKE5WSURJQS",
        dm_img_inter: '{"ds":[],"wh":[0,0,0],"of":[0,0,0]}',
        w_webid: w_webid,
        wts: now.toString(),
    };
    const w_rid = await getRid(params);
    const res = (await axios_1.default.get("https://api.bilibili.com/x/space/wbi/arc/search", {
        headers: Object.assign(Object.assign({}, queryHeaders), { cookie: `buvid3=${cookie.b_3};buvid4=${cookie.b_4}` }),
        params: Object.assign(Object.assign({}, params), { w_rid }),
    })).data;
    console.log(res);
    const resultData = res.data;
    const albums = resultData.list.vlist.map(formatMedia);
    return {
        isEnd: resultData.page.pn * resultData.page.ps >= resultData.page.count,
        data: albums,
    };
}
async function getMediaSource(musicItem, quality) {
    var _a;
    let cid = musicItem.cid;
    if (!cid) {
        cid = (await getCid(musicItem.bvid, musicItem.aid)).data.cid;
    }
    const _params = musicItem.bvid
        ? {
            bvid: musicItem.bvid,
        }
        : {
            aid: musicItem.aid,
        };
    const res = (await axios_1.default.get("https://api.bilibili.com/x/player/playurl", {
        headers: headers,
        params: Object.assign(Object.assign({}, _params), { cid: cid, fnval: 16 }),
    })).data;
    let url;
    if (res.data.dash) {
        const audios = res.data.dash.audio;
        audios.sort((a, b) => a.bandwidth - b.bandwidth);
        switch (quality) {
            case "low":
                url = audios[0].baseUrl;
                break;
            case "standard":
                url = audios[1].baseUrl;
                break;
            case "high":
                url = audios[2].baseUrl;
                break;
            case "super":
                url = audios[3].baseUrl;
                break;
        }
    }
    else {
        url = res.data.durl[0].url;
    }
    const hostUrl = url.substring(url.indexOf("/") + 2);
    const _headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63",
        accept: "*/*",
        host: hostUrl.substring(0, hostUrl.indexOf("/")),
        "accept-encoding": "gzip, deflate, br",
        connection: "keep-alive",
        referer: "https://www.bilibili.com/video/".concat((_a = (musicItem.bvid !== null && musicItem.bvid !== undefined
            ? musicItem.bvid
            : musicItem.aid)) !== null && _a !== void 0 ? _a : ""),
    };
    return {
        url: url,
        headers: _headers,
    };
}
async function getTopLists() {
    const precious = {
        title: "入站必刷",
        data: [
            {
                id: "popular/precious?page_size=100&page=1",
                title: "入站必刷",
                coverImg: "https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_history.png",
            },
        ],
    };
    const weekly = {
        title: "每周必看",
        data: [],
    };
    const weeklyRes = await axios_1.default.get("https://api.bilibili.com/x/web-interface/popular/series/list", {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        },
    });
    weekly.data = weeklyRes.data.data.list.slice(0, 8).map((e) => ({
        id: `popular/series/one?number=${e.number}`,
        title: e.subject,
        description: e.name,
        coverImg: "https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_weekly.png",
    }));
    const boardKeys = [
        {
            id: "ranking/v2?rid=0&type=all",
            title: "全站",
        },
        {
            id: "ranking/v2?rid=3&type=all",
            title: "音乐",
        },
        {
            id: "ranking/v2?rid=1&type=all",
            title: "动画",
        },
        {
            id: "ranking/v2?rid=119&type=all",
            title: "鬼畜",
        },
        {
            id: "ranking/v2?rid=168&type=all",
            title: "国创相关",
        },
        {
            id: "ranking/v2?rid=129&type=all",
            title: "舞蹈",
        },
        {
            id: "ranking/v2?rid=4&type=all",
            title: "游戏",
        },
        {
            id: "ranking/v2?rid=36&type=all",
            title: "知识",
        },
        {
            id: "ranking/v2?rid=188&type=all",
            title: "科技",
        },
        {
            id: "ranking/v2?rid=234&type=all",
            title: "运动",
        },
        {
            id: "ranking/v2?rid=223&type=all",
            title: "汽车",
        },
        {
            id: "ranking/v2?rid=160&type=all",
            title: "生活",
        },
        {
            id: "ranking/v2?rid=211&type=all",
            title: "美食",
        },
        {
            id: "ranking/v2?rid=217&type=all",
            title: "动物圈",
        },
        {
            id: "ranking/v2?rid=155&type=all",
            title: "时尚",
        },
        {
            id: "ranking/v2?rid=5&type=all",
            title: "娱乐",
        },
        {
            id: "ranking/v2?rid=181&type=all",
            title: "影视",
        },
        {
            id: "ranking/v2?rid=0&type=origin",
            title: "原创",
        },
        {
            id: "ranking/v2?rid=0&type=rookie",
            title: "新人",
        },
    ];
    const board = {
        title: "排行榜",
        data: boardKeys.map((_) => (Object.assign(Object.assign({}, _), { coverImg: "https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_rank.png" }))),
    };
    return [weekly, precious, board];
}
async function getTopListDetail(topListItem) {
    const res = await axios_1.default.get(`https://api.bilibili.com/x/web-interface/${topListItem.id}`, {
        headers: Object.assign(Object.assign({}, headers), { referer: "https://www.bilibili.com/" }),
    });
    return Object.assign(Object.assign({}, topListItem), { musicList: res.data.data.list.map(formatMedia) });
}
async function importMusicSheet(urlLike) {
    var _a, _b, _c, _d;
    let id;
    if (!id) {
        id = (_a = urlLike.match(/^\s*(\d+)\s*$/)) === null || _a === void 0 ? void 0 : _a[1];
    }
    if (!id) {
        id = (_b = urlLike.match(/^(?:.*)fid=(\d+).*$/)) === null || _b === void 0 ? void 0 : _b[1];
    }
    if (!id) {
        id = (_c = urlLike.match(/\/playlist\/pl(\d+)/i)) === null || _c === void 0 ? void 0 : _c[1];
    }
    if (!id) {
        id = (_d = urlLike.match(/\/list\/ml(\d+)/i)) === null || _d === void 0 ? void 0 : _d[1];
    }
    if (!id) {
        return;
    }
    const musicSheet = await getFavoriteList(id);
    return musicSheet.map((_) => {
        var _a, _b;
        return ({
            id: _.id,
            aid: _.aid,
            bvid: _.bvid,
            artwork: _.cover,
            title: _.title,
            artist: (_a = _.upper) === null || _a === void 0 ? void 0 : _a.name,
            album: (_b = _.bvid) !== null && _b !== void 0 ? _b : _.aid,
            duration: durationToSec(_.duration),
        });
    });
}
function formatComment(item) {
    var _a, _b, _c, _d, _e;
    return {
        id: item.rpid,
        nickName: (_a = item.member) === null || _a === void 0 ? void 0 : _a.uname,
        avatar: (_b = item.member) === null || _b === void 0 ? void 0 : _b.avatar,
        comment: (_c = item.content) === null || _c === void 0 ? void 0 : _c.message,
        like: item.like,
        createAt: item.ctime * 1000,
        location: ((_e = (_d = item.reply_control) === null || _d === void 0 ? void 0 : _d.location) === null || _e === void 0 ? void 0 : _e.startsWith("IP属地：")) ? item.reply_control.location.slice(5) : undefined
    };
}
async function getMusicComments(musicItem) {
    var _a, _b;
    const params = {
        type: 1,
        mode: 3,
        oid: musicItem.aid,
        plat: 1,
        web_location: 1315875,
        wts: Math.floor(Date.now() / 1000)
    };
    const w_rid = await getRid(params);
    const res = (await (axios_1.default.get("https://api.bilibili.com/x/v2/reply/wbi/main", {
        params: Object.assign(Object.assign({}, params), { w_rid })
    }))).data;
    const data = res.data.replies;
    const comments = [];
    for (let i = 0; i < data.length; ++i) {
        comments[i] = formatComment(data[i]);
        if ((_a = data[i].replies) === null || _a === void 0 ? void 0 : _a.length) {
            comments[i].replies = (_b = data[i]) === null || _b === void 0 ? void 0 : _b.replies.map(formatComment);
        }
    }
    return {
        isEnd: true,
        data: comments
    };
}
module.exports = {
    platform: "bilibili",
    appVersion: ">=0.0",
    version: "0.2.2",
    author: "猫头猫",
    cacheControl: "no-cache",
    srcUrl: "https://gitee.com/maotoumao/MusicFreePlugins/raw/v0.1/dist/bilibili/index.js",
    primaryKey: ["id", "aid", "bvid", "cid"],
    hints: {
        importMusicSheet: [
            "bilibili 移动端：APP点击我的，空间，右上角分享，复制链接，浏览器打开切换桌面版网站，点击播放全部视频，复制链接",
            "bilibili H5/PC端：复制收藏夹URL，或者直接输入ID即可",
            "非公开收藏夹无法导入，编辑收藏夹改为公开即可",
            "导入时间和歌单大小有关，请耐心等待",
        ],
    },
    supportedSearchType: ["music", "album", "artist"],
    async search(keyword, page, type) {
        if (type === "album" || type === "music") {
            return await searchAlbum(keyword, page);
        }
        if (type === "artist") {
            return await searchArtist(keyword, page);
        }
    },
    getMediaSource,
    async getAlbumInfo(albumItem) {
        var _a;
        const cidRes = await getCid(albumItem.bvid, albumItem.aid);
        const _ref2 = (_a = cidRes === null || cidRes === void 0 ? void 0 : cidRes.data) !== null && _a !== void 0 ? _a : {};
        const cid = _ref2.cid;
        const pages = _ref2.pages;
        let musicList;
        if (pages.length === 1) {
            musicList = [Object.assign(Object.assign({}, albumItem), { cid: cid })];
        }
        else {
            musicList = pages.map(function (_) {
                return Object.assign(Object.assign({}, albumItem), { cid: _.cid, title: _.part, duration: durationToSec(_.duration), id: _.cid });
            });
        }
        return {
            musicList,
        };
    },
    getArtistWorks,
    getTopLists,
    getTopListDetail,
    importMusicSheet,
    getMusicComments
};

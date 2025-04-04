var $fFvhi$axios = require("axios");
var $fFvhi$cryptojs = require("crypto-js");
var $fFvhi$he = require("he");

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

$parcel$export(module.exports, "default", () => $d25ff3d008f9e7e0$export$2e2bcd8739ae039);



const $d25ff3d008f9e7e0$var$pageSize = 20;
function $d25ff3d008f9e7e0$var$formatMusicItem(_) {
    var _a, _b, _c;
    const albumid = _.albumid || ((_a = _.album) === null || _a === void 0 ? void 0 : _a.id);
    const albummid = _.albummid || ((_b = _.album) === null || _b === void 0 ? void 0 : _b.mid);
    const albumname = _.albumname || ((_c = _.album) === null || _c === void 0 ? void 0 : _c.title);
    return {
        id: _.id || _.songid,
        songmid: _.mid || _.songmid,
        title: _.title || _.songname,
        artist: _.singer.map((s)=>s.name).join(", "),
        artwork: albummid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${albummid}.jpg` : undefined,
        album: albumname,
        lrc: _.lyric || undefined,
        albumid: albumid,
        albummid: albummid
    };
}
function $d25ff3d008f9e7e0$var$formatAlbumItem(_) {
    return {
        id: _.albumID || _.albumid,
        albumMID: _.albumMID || _.album_mid,
        title: _.albumName || _.album_name,
        artwork: _.albumPic || `https://y.gtimg.cn/music/photo_new/T002R800x800M000${_.albumMID || _.album_mid}.jpg`,
        date: _.publicTime || _.pub_time,
        singerID: _.singerID || _.singer_id,
        artist: _.singerName || _.singer_name,
        singerMID: _.singerMID || _.singer_mid,
        description: _.desc
    };
}
function $d25ff3d008f9e7e0$var$formatArtistItem(_) {
    return {
        name: _.singerName,
        id: _.singerID,
        singerMID: _.singerMID,
        avatar: _.singerPic,
        worksNum: _.songNum
    };
}
const $d25ff3d008f9e7e0$var$searchTypeMap = {
    0: "song",
    2: "album",
    1: "singer",
    3: "songlist",
    7: "song",
    12: "mv"
};
const $d25ff3d008f9e7e0$var$headers = {
    referer: "https://y.qq.com",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    Cookie: "uin="
};
async function $d25ff3d008f9e7e0$var$searchBase(query, page, type) {
    const res = (await (0, ($parcel$interopDefault($fFvhi$axios)))({
        url: "https://u.y.qq.com/cgi-bin/musicu.fcg",
        method: "POST",
        data: {
            req_1: {
                method: "DoSearchForQQMusicDesktop",
                module: "music.search.SearchCgiService",
                param: {
                    num_per_page: $d25ff3d008f9e7e0$var$pageSize,
                    page_num: page,
                    query: query,
                    search_type: type
                }
            }
        },
        headers: $d25ff3d008f9e7e0$var$headers,
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true
    })).data;
    return {
        isEnd: res.req_1.data.meta.sum <= page * $d25ff3d008f9e7e0$var$pageSize,
        data: res.req_1.data.body[$d25ff3d008f9e7e0$var$searchTypeMap[type]].list
    };
}
async function $d25ff3d008f9e7e0$var$searchMusic(query, page) {
    const songs = await $d25ff3d008f9e7e0$var$searchBase(query, page, 0);
    return {
        isEnd: songs.isEnd,
        data: songs.data.map($d25ff3d008f9e7e0$var$formatMusicItem)
    };
}
async function $d25ff3d008f9e7e0$var$searchAlbum(query, page) {
    const albums = await $d25ff3d008f9e7e0$var$searchBase(query, page, 2);
    return {
        isEnd: albums.isEnd,
        data: albums.data.map($d25ff3d008f9e7e0$var$formatAlbumItem)
    };
}
async function $d25ff3d008f9e7e0$var$searchArtist(query, page) {
    const artists = await $d25ff3d008f9e7e0$var$searchBase(query, page, 1);
    return {
        isEnd: artists.isEnd,
        data: artists.data.map($d25ff3d008f9e7e0$var$formatArtistItem)
    };
}
async function $d25ff3d008f9e7e0$var$searchMusicSheet(query, page) {
    const musicSheet = await $d25ff3d008f9e7e0$var$searchBase(query, page, 3);
    return {
        isEnd: musicSheet.isEnd,
        data: musicSheet.data.map((item)=>({
                title: item.dissname,
                createAt: item.createtime,
                description: item.introduction,
                playCount: item.listennum,
                worksNums: item.song_count,
                artwork: item.imgurl,
                id: item.dissid,
                artist: item.creator.name
            }))
    };
}
async function $d25ff3d008f9e7e0$var$searchLyric(query, page) {
    const songs = await $d25ff3d008f9e7e0$var$searchBase(query, page, 7);
    return {
        isEnd: songs.isEnd,
        data: songs.data.map((it)=>Object.assign(Object.assign({}, $d25ff3d008f9e7e0$var$formatMusicItem(it)), {
                rawLrcTxt: it.content
            }))
    };
}
function $d25ff3d008f9e7e0$var$getQueryFromUrl(key, search) {
    try {
        const sArr = search.split("?");
        let s = "";
        if (sArr.length > 1) s = sArr[1];
        else return key ? undefined : {};
        const querys = s.split("&");
        const result = {};
        querys.forEach((item)=>{
            const temp = item.split("=");
            result[temp[0]] = decodeURIComponent(temp[1]);
        });
        return key ? result[key] : result;
    } catch (err) {
        return key ? "" : {};
    }
}
function $d25ff3d008f9e7e0$var$changeUrlQuery(obj, baseUrl) {
    const query = $d25ff3d008f9e7e0$var$getQueryFromUrl(null, baseUrl);
    let url = baseUrl.split("?")[0];
    const newQuery = Object.assign(Object.assign({}, query), obj);
    let queryArr = [];
    Object.keys(newQuery).forEach((key)=>{
        if (newQuery[key] !== undefined && newQuery[key] !== "") queryArr.push(`${key}=${encodeURIComponent(newQuery[key])}`);
    });
    return `${url}?${queryArr.join("&")}`.replace(/\?$/, "");
}
const $d25ff3d008f9e7e0$var$typeMap = {
    m4a: {
        s: "C400",
        e: ".m4a"
    },
    128: {
        s: "M500",
        e: ".mp3"
    },
    320: {
        s: "M800",
        e: ".mp3"
    },
    ape: {
        s: "A000",
        e: ".ape"
    },
    flac: {
        s: "F000",
        e: ".flac"
    }
};
async function $d25ff3d008f9e7e0$var$getAlbumInfo(albumItem) {
    const url = $d25ff3d008f9e7e0$var$changeUrlQuery({
        data: JSON.stringify({
            comm: {
                ct: 24,
                cv: 10000
            },
            albumSonglist: {
                method: "GetAlbumSongList",
                param: {
                    albumMid: albumItem.albumMID,
                    albumID: 0,
                    begin: 0,
                    num: 999,
                    order: 2
                },
                module: "music.musichallAlbum.AlbumSongList"
            }
        })
    }, "https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8");
    const res = (await (0, ($parcel$interopDefault($fFvhi$axios)))({
        url: url,
        headers: $d25ff3d008f9e7e0$var$headers,
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true
    })).data;
    return {
        musicList: res.albumSonglist.data.songList.map((item)=>{
            const _ = item.songInfo;
            return $d25ff3d008f9e7e0$var$formatMusicItem(_);
        })
    };
}
async function $d25ff3d008f9e7e0$var$getArtistSongs(artistItem, page) {
    const url = $d25ff3d008f9e7e0$var$changeUrlQuery({
        data: JSON.stringify({
            comm: {
                ct: 24,
                cv: 0
            },
            singer: {
                method: "get_singer_detail_info",
                param: {
                    sort: 5,
                    singermid: artistItem.singerMID,
                    sin: (page - 1) * $d25ff3d008f9e7e0$var$pageSize,
                    num: $d25ff3d008f9e7e0$var$pageSize
                },
                module: "music.web_singer_info_svr"
            }
        })
    }, "http://u.y.qq.com/cgi-bin/musicu.fcg");
    const res = (await (0, ($parcel$interopDefault($fFvhi$axios)))({
        url: url,
        method: "get",
        headers: $d25ff3d008f9e7e0$var$headers,
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true
    })).data;
    return {
        isEnd: res.singer.data.total_song <= page * $d25ff3d008f9e7e0$var$pageSize,
        data: res.singer.data.songlist.map($d25ff3d008f9e7e0$var$formatMusicItem)
    };
}
async function $d25ff3d008f9e7e0$var$getArtistAlbums(artistItem, page) {
    const url = $d25ff3d008f9e7e0$var$changeUrlQuery({
        data: JSON.stringify({
            comm: {
                ct: 24,
                cv: 0
            },
            singerAlbum: {
                method: "get_singer_album",
                param: {
                    singermid: artistItem.singerMID,
                    order: "time",
                    begin: (page - 1) * $d25ff3d008f9e7e0$var$pageSize,
                    num: $d25ff3d008f9e7e0$var$pageSize / 1,
                    exstatus: 1
                },
                module: "music.web_singer_info_svr"
            }
        })
    }, "http://u.y.qq.com/cgi-bin/musicu.fcg");
    const res = (await (0, ($parcel$interopDefault($fFvhi$axios)))({
        url: url,
        method: "get",
        headers: $d25ff3d008f9e7e0$var$headers,
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true
    })).data;
    return {
        isEnd: res.singerAlbum.data.total <= page * $d25ff3d008f9e7e0$var$pageSize,
        data: res.singerAlbum.data.list.map($d25ff3d008f9e7e0$var$formatAlbumItem)
    };
}
async function $d25ff3d008f9e7e0$var$getArtistWorks(artistItem, page, type) {
    if (type === "music") return $d25ff3d008f9e7e0$var$getArtistSongs(artistItem, page);
    if (type === "album") return $d25ff3d008f9e7e0$var$getArtistAlbums(artistItem, page);
}
async function $d25ff3d008f9e7e0$var$getLyric(musicItem) {
    const result = (await (0, ($parcel$interopDefault($fFvhi$axios)))({
        url: `http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=${musicItem.songmid}&pcachetime=${new Date().getTime()}&g_tk=5381&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`,
        headers: {
            Referer: "https://y.qq.com",
            Cookie: "uin="
        },
        method: "get",
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true
    })).data;
    const res = JSON.parse(result.replace(/callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g, ""));
    let translation;
    if (res.trans) translation = (0, ($parcel$interopDefault($fFvhi$he))).decode((0, ($parcel$interopDefault($fFvhi$cryptojs))).enc.Base64.parse(res.trans).toString((0, ($parcel$interopDefault($fFvhi$cryptojs))).enc.Utf8));
    return {
        rawLrc: (0, ($parcel$interopDefault($fFvhi$he))).decode((0, ($parcel$interopDefault($fFvhi$cryptojs))).enc.Base64.parse(res.lyric).toString((0, ($parcel$interopDefault($fFvhi$cryptojs))).enc.Utf8)),
        translation: translation
    };
}
async function $d25ff3d008f9e7e0$var$importMusicSheet(urlLike) {
    let id;
    if (!id) id = (urlLike.match(/https?:\/\/i\.y\.qq\.com\/n2\/m\/share\/details\/taoge\.html\?.*id=([0-9]+)/) || [])[1];
    if (!id) id = (urlLike.match(/https?:\/\/y\.qq\.com\/n\/ryqq\/playlist\/([0-9]+)/) || [])[1];
    if (!id) id = (urlLike.match(/^(\d+)$/) || [])[1];
    if (!id) return;
    const result = (await (0, ($parcel$interopDefault($fFvhi$axios)))({
        url: `http://i.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&utf8=1&disstid=${id}&loginUin=0`,
        headers: {
            Referer: "https://y.qq.com/n/yqq/playlist",
            Cookie: "uin="
        },
        method: "get",
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true
    })).data;
    const res = JSON.parse(result.replace(/callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g, ""));
    return res.cdlist[0].songlist.map($d25ff3d008f9e7e0$var$formatMusicItem);
}
async function $d25ff3d008f9e7e0$var$getTopLists() {
    const list = await (0, ($parcel$interopDefault($fFvhi$axios)))({
        url: "https://u.y.qq.com/cgi-bin/musicu.fcg?_=1577086820633&data=%7B%22comm%22%3A%7B%22g_tk%22%3A5381%2C%22uin%22%3A123456%2C%22format%22%3A%22json%22%2C%22inCharset%22%3A%22utf-8%22%2C%22outCharset%22%3A%22utf-8%22%2C%22notice%22%3A0%2C%22platform%22%3A%22h5%22%2C%22needNewCode%22%3A1%2C%22ct%22%3A23%2C%22cv%22%3A0%7D%2C%22topList%22%3A%7B%22module%22%3A%22musicToplist.ToplistInfoServer%22%2C%22method%22%3A%22GetAll%22%2C%22param%22%3A%7B%7D%7D%7D",
        method: "get",
        headers: {
            Cookie: "uin="
        },
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true
    });
    return list.data.topList.data.group.map((e)=>({
            title: e.groupName,
            data: e.toplist.map((_)=>({
                    id: _.topId,
                    description: _.intro,
                    title: _.title,
                    period: _.period,
                    coverImg: _.headPicUrl || _.frontPicUrl
                }))
        }));
}
async function $d25ff3d008f9e7e0$var$getTopListDetail(topListItem) {
    var _a;
    const res = await (0, ($parcel$interopDefault($fFvhi$axios)))({
        url: `https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&data=%7B%22detail%22%3A%7B%22module%22%3A%22musicToplist.ToplistInfoServer%22%2C%22method%22%3A%22GetDetail%22%2C%22param%22%3A%7B%22topId%22%3A${topListItem.id}%2C%22offset%22%3A0%2C%22num%22%3A100%2C%22period%22%3A%22${(_a = topListItem.period) !== null && _a !== void 0 ? _a : ""}%22%7D%7D%2C%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A0%7D%7D`,
        method: "get",
        headers: {
            Cookie: "uin="
        },
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true
    });
    return Object.assign(Object.assign({}, topListItem), {
        musicList: res.data.detail.data.songInfoList.map($d25ff3d008f9e7e0$var$formatMusicItem)
    });
}
async function $d25ff3d008f9e7e0$var$getRecommendSheetTags() {
    const res = (await (0, ($parcel$interopDefault($fFvhi$axios))).get("https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg?format=json&inCharset=utf8&outCharset=utf-8", {
        headers: {
            referer: "https://y.qq.com/"
        }
    })).data.data.categories;
    const data = res.slice(1).map((_)=>({
            title: _.categoryGroupName,
            data: _.items.map((tag)=>({
                    id: tag.categoryId,
                    title: tag.categoryName
                }))
        }));
    const pinned = [];
    for (let d of data)if (d.data.length) pinned.push(d.data[0]);
    return {
        pinned: pinned,
        data: data
    };
}
async function $d25ff3d008f9e7e0$var$getRecommendSheetsByTag(tag, page) {
    const pageSize = 20;
    const rawRes = (await (0, ($parcel$interopDefault($fFvhi$axios))).get("https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg", {
        headers: {
            referer: "https://y.qq.com/"
        },
        params: {
            inCharset: "utf8",
            outCharset: "utf-8",
            sortId: 5,
            categoryId: (tag === null || tag === void 0 ? void 0 : tag.id) || "10000000",
            sin: pageSize * (page - 1),
            ein: page * pageSize - 1
        }
    })).data;
    const res = JSON.parse(rawRes.replace(/callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g, "")).data;
    const isEnd = res.sum <= page * pageSize;
    const data = res.list.map((item)=>{
        var _a, _b;
        return {
            id: item.dissid,
            createTime: item.createTime,
            title: item.dissname,
            artwork: item.imgurl,
            description: item.introduction,
            playCount: item.listennum,
            artist: (_b = (_a = item.creator) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""
        };
    });
    return {
        isEnd: isEnd,
        data: data
    };
}
async function $d25ff3d008f9e7e0$var$getMusicSheetInfo(sheet, page) {
    const data = await $d25ff3d008f9e7e0$var$importMusicSheet(sheet.id);
    return {
        isEnd: true,
        musicList: data
    };
}
const $d25ff3d008f9e7e0$var$qualityLevels = {
    low: "128k",
    standard: "320k",
    high: "flac",
    super: "flac24bit"
};
async function $d25ff3d008f9e7e0$var$getMediaSource(musicItem, quality) {
    let url = "";
    const res1 = (await (0, ($parcel$interopDefault($fFvhi$axios))).get(`https://lxmusicapi.onrender.com/url/tx/${musicItem.songmid}/${$d25ff3d008f9e7e0$var$qualityLevels[quality]}`, {
        headers: {
            "X-Request-Key": "share-v2"
        }
    })).data;
    if (!res1.url || res1.msg != "success") {
        const res2 = (await (0, ($parcel$interopDefault($fFvhi$axios))).get(`https://lxmusicapi.onrender.com/url/tx/${musicItem.songmid}/${$d25ff3d008f9e7e0$var$qualityLevels[quality]}`, {
            headers: {
                "X-Request-Key": "share-v2"
            }
        })).data;
        if (!res2.url || res2.msg != "success") ;
        else url = res2.url;
    } else url = res1.url;
    return {
        url: url
    };
}
async function $d25ff3d008f9e7e0$var$search(query, page, type) {
    if (type === "music") return await $d25ff3d008f9e7e0$var$searchMusic(query, page);
    if (type === "album") return await $d25ff3d008f9e7e0$var$searchAlbum(query, page);
    if (type === "artist") return await $d25ff3d008f9e7e0$var$searchArtist(query, page);
    if (type === "sheet") return await $d25ff3d008f9e7e0$var$searchMusicSheet(query, page);
    if (type === "lyric") return await $d25ff3d008f9e7e0$var$searchLyric(query, page);
}
const $d25ff3d008f9e7e0$var$pluginInstance = {
    platform: "小秋音乐",
    author: "SoEasy同学",
    version: "0.0.3",
    srcUrl: "https://musicfreepluginshub.2020818.xyz/cdf10b110435c7e5979906706a9480c0.js",
    cacheControl: "no-cache",
    hints: {
        importMusicSheet: [
            "QQ音乐APP：自建歌单-分享-分享到微信好友/QQ好友；然后点开并复制链接，直接粘贴即可",
            "H5：复制URL并粘贴，或者直接输入纯数字歌单ID即可",
            "导入时间和歌单大小有关，请耐心等待"
        ],
        importMusicItem: []
    },
    primaryKey: [
        "id",
        "songmid"
    ],
    supportedSearchType: [
        "music",
        "album",
        "sheet",
        "artist",
        "lyric"
    ],
    search: $d25ff3d008f9e7e0$var$search,
    getMediaSource: $d25ff3d008f9e7e0$var$getMediaSource,
    getLyric: $d25ff3d008f9e7e0$var$getLyric,
    getAlbumInfo: $d25ff3d008f9e7e0$var$getAlbumInfo,
    getArtistWorks: $d25ff3d008f9e7e0$var$getArtistWorks,
    importMusicSheet: $d25ff3d008f9e7e0$var$importMusicSheet,
    getTopLists: $d25ff3d008f9e7e0$var$getTopLists,
    getTopListDetail: $d25ff3d008f9e7e0$var$getTopListDetail,
    getRecommendSheetTags: $d25ff3d008f9e7e0$var$getRecommendSheetTags,
    getRecommendSheetsByTag: $d25ff3d008f9e7e0$var$getRecommendSheetsByTag,
    getMusicSheetInfo: $d25ff3d008f9e7e0$var$getMusicSheetInfo
};
var /*search("和你在一起 孙楠", 1, "music").then((res) => {
    console.log(res)
    getMediaSource(res.data[0], "standard").then((res) => {
        console.log(res)
    })
    getLyric(res.data[0]).then((res) => {
        console.log(res)
    })
})*/ $d25ff3d008f9e7e0$export$2e2bcd8739ae039 = $d25ff3d008f9e7e0$var$pluginInstance;


//# sourceMappingURL=xiaoqiu.js.map
